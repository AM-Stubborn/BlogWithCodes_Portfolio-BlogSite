import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, switchMap, throwError } from 'rxjs';
import { BlogPost, BlogPostMeta } from '../models/content.models';

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI',
  azure: 'Azure',
  csharp: 'C#',
  dotnet: '.NET',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  nodejs: 'Node.js',
  vue: 'Vue',
  angular: 'Angular',
  react: 'React',
  sql: 'SQL',
  architecture: 'Architecture',
  interview: 'Interview',
  devops: 'DevOps',
  algorithms: 'Algorithms',
  security: 'Security',
  testing: 'Testing',
  frontend: 'Frontend',
  general: 'General',
};

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly index$ = this.http
    .get<BlogPostMeta[]>('content/posts/index.json')
    .pipe(
      map((posts) =>
        [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
      ),
      shareReplay(1),
    );

  /** Published posts only (drafts excluded from lists / home preview). */
  getPosts(): Observable<BlogPostMeta[]> {
    return this.index$.pipe(map((posts) => posts.filter((post) => !post.draft)));
  }

  getPostsByCategory(category: string): Observable<BlogPostMeta[]> {
    const normalized = category.toLowerCase();
    return this.getPosts().pipe(
      map((posts) => posts.filter((post) => post.category.toLowerCase() === normalized)),
    );
  }

  getCategories(): Observable<string[]> {
    return this.getPosts().pipe(
      map((posts) =>
        [...new Set(posts.map((post) => post.category))].sort((a, b) =>
          a.localeCompare(b),
        ),
      ),
    );
  }

  /** Resolves by slug for published and draft posts (direct URL still works). */
  getPost(slug: string): Observable<BlogPost> {
    return this.index$.pipe(
      switchMap((posts) => {
        const meta = posts.find((post) => post.slug === slug);
        if (!meta) {
          return throwError(() => new Error(`Post not found: ${slug}`));
        }

        return this.http.get(`content/posts/${slug}.html`, { responseType: 'text' }).pipe(
          map((html) => ({
            ...meta,
            contentHtml: this.stripDuplicateCoverImage(html, meta.cover),
          })),
        );
      }),
    );
  }

  /**
   * Cover is rendered in the post header; remove the matching first body image
   * (and empty Blogger separator wrappers) so it is not shown twice.
   */
  private stripDuplicateCoverImage(html: string, cover: string): string {
    if (!cover?.trim()) {
      return html;
    }

    const coverPath = cover.replace(/^\/+/, '').toLowerCase();
    const coverFile = coverPath.split('/').pop() ?? '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const images = Array.from(doc.body.querySelectorAll('img'));

    const match = images.find((img) => {
      const src = (img.getAttribute('src') || '').replace(/^\/+/, '').toLowerCase();
      return src === coverPath || src.endsWith(coverPath) || (coverFile.length > 0 && src.endsWith(coverFile));
    });

    if (!match) {
      return html;
    }

    let node: Element | null = match;
    while (node) {
      const parent: Element | null = node.parentElement;
      if (!parent || parent === doc.body) {
        node.remove();
        break;
      }

      const isWrapper =
        parent.tagName === 'A' ||
        parent.tagName === 'SPAN' ||
        parent.tagName === 'P' ||
        parent.tagName === 'H1' ||
        parent.tagName === 'H2' ||
        parent.tagName === 'H3' ||
        parent.classList.contains('separator');

      node.remove();

      if (!isWrapper || parent.textContent?.trim() || parent.querySelector('img,table,ul,ol,pre,blockquote')) {
        break;
      }

      node = parent;
    }

    return doc.body.innerHTML;
  }

  formatCategory(category: string): string {
    const key = category.toLowerCase();
    if (CATEGORY_LABELS[key]) {
      return CATEGORY_LABELS[key];
    }
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }
}
