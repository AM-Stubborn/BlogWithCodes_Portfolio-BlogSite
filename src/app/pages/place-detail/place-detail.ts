import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { PlacesService } from '../../core/services/places.service';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { Icon } from '../../shared/icon/icon';
import { InstagramEmbed } from '../../shared/instagram-embed/instagram-embed';

@Component({
  selector: 'app-place-detail',
  imports: [AsyncPipe, RouterLink, AssetUrlPipe, Icon, InstagramEmbed],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.scss',
})
export class PlaceDetail {
  private readonly placesService = inject(PlacesService);
  private readonly route = inject(ActivatedRoute);

  readonly place$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),
    switchMap((slug) => this.placesService.getPlaceOrNull(slug)),
  );

  formatDate(date: string): string {
    return this.placesService.formatDate(date);
  }

  formatType(type: string): string {
    return this.placesService.formatType(type);
  }
}
