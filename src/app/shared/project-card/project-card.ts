import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/models/content.models';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, AssetUrlPipe, Icon],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  @Input({ required: true }) project!: Project;
}
