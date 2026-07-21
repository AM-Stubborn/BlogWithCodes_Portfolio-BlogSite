import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { SiteContent } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly http = inject(HttpClient);
  private readonly site$ = this.http
    .get<SiteContent>('content/site.json')
    .pipe(shareReplay(1));

  getSite(): Observable<SiteContent> {
    return this.site$;
  }
}
