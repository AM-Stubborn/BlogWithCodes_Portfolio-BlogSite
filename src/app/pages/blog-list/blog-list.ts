import { Component, HostListener, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { BlogService } from '../../core/services/blog.service';
import { PostCard } from '../../shared/post-card/post-card';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-blog-list',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, PostCard, Icon],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  private readonly blogService = inject(BlogService);
  private readonly route = inject(ActivatedRoute);

  readonly categories$ = this.blogService.getCategories();
  readonly menuOpen = signal(false);

  readonly category$ = this.route.paramMap.pipe(
    map((params) => params.get('category')),
  );

  readonly posts$ = this.category$.pipe(
    switchMap((category) =>
      category
        ? this.blogService.getPostsByCategory(category)
        : this.blogService.getPosts(),
    ),
  );

  formatCategory(category: string): string {
    return this.blogService.formatCategory(category);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
