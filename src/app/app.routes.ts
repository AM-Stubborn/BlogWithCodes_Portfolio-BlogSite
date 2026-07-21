import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Manish Bhatia — BlogWithCodes',
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects-list/projects-list').then((m) => m.ProjectsList),
    title: 'Projects — BlogWithCodes',
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
    title: 'Project — BlogWithCodes',
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog-list/blog-list').then((m) => m.BlogList),
    title: 'Blog — BlogWithCodes',
  },
  {
    path: 'blog/category/:category',
    loadComponent: () => import('./pages/blog-list/blog-list').then((m) => m.BlogList),
    title: 'Category — BlogWithCodes',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-post/blog-post').then((m) => m.BlogPostPage),
    title: 'Post — BlogWithCodes',
  },
  {
    path: 'places',
    loadComponent: () => import('./pages/places-list/places-list').then((m) => m.PlacesList),
    title: 'Places Visited — BlogWithCodes',
  },
  {
    path: 'places/:slug',
    loadComponent: () => import('./pages/place-detail/place-detail').then((m) => m.PlaceDetail),
    title: 'Place — BlogWithCodes',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found',
  },
];
