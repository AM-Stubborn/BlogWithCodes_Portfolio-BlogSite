import { Component, Input } from '@angular/core';
import { Icon } from '../icon/icon';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';

@Component({
  selector: 'app-instagram-embed',
  imports: [Icon, AssetUrlPipe],
  templateUrl: './instagram-embed.html',
  styleUrl: './instagram-embed.scss',
})
export class InstagramEmbed {
  /** Cover/photo shown as the reel thumbnail. */
  @Input({ required: true }) poster!: string;

  /** Accessible label for the thumbnail image. */
  @Input() alt = 'Instagram reel preview';

  href: string | null = null;

  @Input()
  set instagramUrl(value: string | null | undefined) {
    this.href = normalizeInstagramUrl(value);
  }
}

function normalizeInstagramUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }

  try {
    const url = new URL(raw.trim());
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host !== 'instagram.com' && host !== 'instagr.am') {
      return null;
    }

    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    const kind = segments[0].toLowerCase();
    const code = segments[1];

    if (!/^[\w-]+$/.test(code) || code.length < 5) {
      return null;
    }

    if (kind !== 'reel' && kind !== 'reels' && kind !== 'p' && kind !== 'tv') {
      return null;
    }

    const type = kind === 'reels' ? 'reel' : kind;
    return `https://www.instagram.com/${type}/${code}/`;
  } catch {
    return null;
  }
}
