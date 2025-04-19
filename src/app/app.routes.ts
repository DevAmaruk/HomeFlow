import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
	},
	{
		path: 'family',
		loadComponent: () => import('./pages/familly/familly.component').then(c => c.FamillyComponent),
	},
	{
		path: 'chore-homepage',
		loadComponent: () =>
			import('./pages/Chores/chore-list-homepage/chore-list-homepage.component').then(c => c.ChoreListHomepageComponent),
	},
	{
		path: 'category',
		loadComponent: () =>
			import('./pages/Chores/chore-category-selection/chore-category-selection.component').then(
				c => c.ChoreCategorySelectionComponent,
			),
	},
	{
		path: 'tasks/:categoryId',
		loadComponent: () =>
			import('./pages/Chores/chore-task-selection/chore-task-selection.component').then(c => c.ChoreTaskSelectionComponent),
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
];
