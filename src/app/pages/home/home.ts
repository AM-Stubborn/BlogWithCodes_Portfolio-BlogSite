import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../core/services/site.service';
import { BlogService } from '../../core/services/blog.service';
import { PlacesService } from '../../core/services/places.service';
import { PostCard } from '../../shared/post-card/post-card';
import { PlaceCard } from '../../shared/place-card/place-card';
import { Icon } from '../../shared/icon/icon';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { YoutubeEmbed } from '../../shared/youtube-embed/youtube-embed';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, RouterLink, PostCard, PlaceCard, Icon, AssetUrlPipe, YoutubeEmbed],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly siteService = inject(SiteService);
  private readonly blogService = inject(BlogService);
  private readonly placesService = inject(PlacesService);

  readonly site$ = this.siteService.getSite();
  readonly latestPosts$ = this.blogService.getPosts().pipe(map((posts) => posts.slice(0, 3)));
  readonly latestPlaces$ = this.placesService.getPlaces().pipe(map((places) => places.slice(0, 3)));
}
