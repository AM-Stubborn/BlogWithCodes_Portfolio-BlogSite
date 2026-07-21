import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs';
import { SiteService } from '../../core/services/site.service';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, AssetUrlPipe],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader implements OnInit {
  private readonly siteService = inject(SiteService);
  private readonly router = inject(Router);

  readonly site$ = this.siteService.getSite();
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly links = [
    { label: 'About', fragment: 'about', path: '/' },
    { label: 'Approach', fragment: 'approach', path: '/' },
    { label: 'Experience', fragment: 'experience', path: '/' },
    { label: 'Projects', fragment: null, path: '/projects' },
    { label: 'Places', fragment: null, path: '/places' },
    { label: 'Blog', fragment: null, path: '/blog' },
    { label: 'Contact', fragment: 'contact', path: '/' },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
