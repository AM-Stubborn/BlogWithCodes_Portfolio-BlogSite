import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { Place, PlaceMeta } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly http = inject(HttpClient);
  private readonly index$ = this.http.get<PlaceMeta[]>('content/places/index.json').pipe(
    map((places) =>
      [...places].sort((a, b) => +new Date(b.visitedOn) - +new Date(a.visitedOn)),
    ),
    shareReplay(1),
  );

  /** Listing data only. Trail stories are loaded on the detail page. */
  getPlaces(): Observable<PlaceMeta[]> {
    return this.index$;
  }

  getPlaceOrNull(slug: string): Observable<Place | null> {
    return this.index$.pipe(
      switchMap((places) => {
        const meta = places.find((place) => place.slug === slug);
        if (!meta) {
          return of(null);
        }

        return this.http.get(`content/places/${slug}.txt`, { responseType: 'text' }).pipe(
          map((notes) => ({
            ...meta,
            notes: notes.replace(/^\uFEFF/, '').trim(),
          })),
          catchError(() => of(null)),
        );
      }),
    );
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  formatType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
