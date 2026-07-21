import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostMeta } from '../../core/models/content.models';
import { BlogService } from '../../core/services/blog.service';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, AssetUrlPipe, Icon],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  private static readonly PLACEHOLDER_COVER = 'assets/blog/placeholder.svg';

  private readonly blogService = inject(BlogService);

  @Input({ required: true }) post!: BlogPostMeta;

  get coverSrc(): string {
    return this.post.cover || PostCard.PLACEHOLDER_COVER;
  }

  formatDate(date: string): string {
    return this.blogService.formatDate(date);
  }

  formatCategory(category: string): string {
    return this.blogService.formatCategory(category);
  }
}
