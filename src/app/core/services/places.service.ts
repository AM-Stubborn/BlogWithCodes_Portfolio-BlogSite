import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Place } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly http = inject(HttpClient);
  private readonly places$ = this.http.get<Place[]>('content/places.json').pipe(
    map((places) =>
      [...places].sort((a, b) => +new Date(b.visitedOn) - +new Date(a.visitedOn)),
    ),
    shareReplay(1),
  );

  getPlaces(): Observable<Place[]> {
    return this.places$;
  }

  getPlaceOrNull(slug: string): Observable<Place | null> {
    return this.places$.pipe(
      map((places) => places.find((item) => item.slug === slug) ?? null),
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
