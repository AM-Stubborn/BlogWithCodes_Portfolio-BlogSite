import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Place } from '../../core/models/content.models';
import { PlacesService } from '../../core/services/places.service';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-place-card',
  imports: [RouterLink, AssetUrlPipe, Icon],
  templateUrl: './place-card.html',
  styleUrl: './place-card.scss',
})
export class PlaceCard {
  private readonly placesService = inject(PlacesService);

  @Input({ required: true }) place!: Place;

  formatDate(date: string): string {
    return this.placesService.formatDate(date);
  }

  formatType(type: string): string {
    return this.placesService.formatType(type);
  }
}
