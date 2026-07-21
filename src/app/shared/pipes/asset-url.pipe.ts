import { Pipe, PipeTransform } from '@angular/core';

/**
 * Resolves content image paths against the deployed base href.
 * Prefer paths like `assets/places/triund-trek.jpg` (no leading slash).
 */
@Pipe({ name: 'assetUrl' })
export class AssetUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) {
      return '';
    }

    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
      return path;
    }

    const normalized = path.replace(/^\/+/, '');
    const base = document.querySelector('base')?.getAttribute('href') || '/';

    try {
      return new URL(normalized, window.location.origin + base).toString();
    } catch {
      return normalized;
    }
  }
}
