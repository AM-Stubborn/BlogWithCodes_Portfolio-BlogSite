import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { BlogService } from '../../core/services/blog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { Icon } from '../../shared/icon/icon';
import { YoutubeEmbed } from '../../shared/youtube-embed/youtube-embed';

@Component({
  selector: 'app-blog-post',
  imports: [AsyncPipe, RouterLink, AssetUrlPipe, Icon, YoutubeEmbed],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
})
export class BlogPostPage {
  private readonly blogService = inject(BlogService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly post$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),
    switchMap((slug) =>
      this.blogService.getPost(slug).pipe(
        map((post) => ({
          ...post,
          safeHtml: this.sanitizer.bypassSecurityTrustHtml(post.contentHtml),
        })),
        catchError(() => of(null)),
      ),
    ),
  );

  formatCategory(category: string): string {
    return this.blogService.formatCategory(category);
  }

  formatDate(date: string): string {
    return this.blogService.formatDate(date);
  }
}
