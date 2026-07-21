import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PlacesService } from '../../core/services/places.service';
import { PlaceCard } from '../../shared/place-card/place-card';
import { Icon } from '../../shared/icon/icon';
import { map } from 'rxjs';

@Component({
  selector: 'app-places-list',
  imports: [AsyncPipe, PlaceCard, Icon],
  templateUrl: './places-list.html',
  styleUrl: './places-list.scss',
})
export class PlacesList {
  private readonly placesService = inject(PlacesService);

  readonly places$ = this.placesService.getPlaces();
  readonly trekCount$ = this.places$.pipe(
    map((places) => places.filter((place) => place.type === 'trek').length),
  );
  readonly travelCount$ = this.places$.pipe(
    map((places) => places.filter((place) => place.type === 'travel').length),
  );
}
