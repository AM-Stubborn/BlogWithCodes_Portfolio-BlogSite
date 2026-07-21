import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SiteService } from '../../core/services/site.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, AsyncPipe, Icon],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  private readonly siteService = inject(SiteService);
  readonly site$ = this.siteService.getSite();
  readonly year = new Date().getFullYear();
}
