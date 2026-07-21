import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProjectsService } from '../../core/services/projects.service';
import { ProjectCard } from '../../shared/project-card/project-card';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-projects-list',
  imports: [AsyncPipe, ProjectCard, Icon],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
})
export class ProjectsList {
  private readonly projectsService = inject(ProjectsService);
  readonly projects$ = this.projectsService.getProjects();
}
