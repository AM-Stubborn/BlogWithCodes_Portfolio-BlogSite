import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Project } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly projects$ = this.http
    .get<Project[]>('content/projects/index.json')
    .pipe(shareReplay(1));

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectOrNull(slug: string): Observable<Project | null> {
    return this.projects$.pipe(
      map((projects) => projects.find((project) => project.slug === slug) ?? null),
    );
  }
}
