import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ProjectsService } from '../../core/services/projects.service';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-project-detail',
  imports: [AsyncPipe, RouterLink, AssetUrlPipe, Icon],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private readonly projectsService = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);

  readonly project$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),
    switchMap((slug) => this.projectsService.getProjectOrNull(slug)),
  );
}
