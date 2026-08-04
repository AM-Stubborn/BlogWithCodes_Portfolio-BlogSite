import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube-embed',
  templateUrl: './youtube-embed.html',
  styleUrl: './youtube-embed.scss',
})
export class YoutubeEmbed {
  private readonly sanitizer = inject(DomSanitizer);

  /** When true, adds outer margin/border chrome for stand-alone embeds. */
  @Input() framed = true;

  embedUrl: SafeResourceUrl | null = null;

  @Input()
  set youtubeUrl(value: string | null | undefined) {
    const id = extractYoutubeId(value);
    this.embedUrl = id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${id}`,
        )
      : null;
  }
}

function extractYoutubeId(raw: string | null | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }

  try {
    const url = new URL(raw.trim());
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] ?? '';
      return isValidYoutubeId(id) ? id : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v') ?? '';
        return isValidYoutubeId(id) ? id : null;
      }

      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
      if (match && isValidYoutubeId(match[1])) {
        return match[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function isValidYoutubeId(id: string): boolean {
  return /^[\w-]{6,}$/.test(id);
}
