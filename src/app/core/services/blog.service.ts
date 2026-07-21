import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, switchMap, throwError } from 'rxjs';
import { marked } from 'marked';
import { BlogPost, BlogPostMeta } from '../models/content.models';

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

  getPosts(): Observable<BlogPostMeta[]> {
    return this.index$;
  }

  getPostsByCategory(category: string): Observable<BlogPostMeta[]> {
    const normalized = category.toLowerCase();
    return this.index$.pipe(
      map((posts) => posts.filter((post) => post.category.toLowerCase() === normalized)),
    );
  }

  getCategories(): Observable<string[]> {
    return this.index$.pipe(
      map((posts) =>
        [...new Set(posts.map((post) => post.category))].sort((a, b) =>
          a.localeCompare(b),
        ),
      ),
    );
  }

  getPost(slug: string): Observable<BlogPost> {
    return this.index$.pipe(
      switchMap((posts) => {
        const meta = posts.find((post) => post.slug === slug);
        if (!meta) {
          return throwError(() => new Error(`Post not found: ${slug}`));
        }

        return this.http.get(`content/posts/${slug}.md`, { responseType: 'text' }).pipe(
          map((markdown) => ({
            ...meta,
            contentHtml: marked.parse(markdown, { async: false }) as string,
          })),
        );
      }),
    );
  }

  formatCategory(category: string): string {
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
