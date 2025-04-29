import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'login-homepage',
		loadComponent: () => import('./pages/login/login-homepage.component').then(c => c.LoginHomepageComponent),
	},
	{
		path: 'sign-up',
		loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
	},
	{
		path: 'sign-in',
		loadComponent: () => import('./pages/sign-in-page/sign-in-page.component').then(c => c.SignInPageComponent),
	},
	{
		path: 'family',
		loadComponent: () => import('./pages/familly/familly.component').then(c => c.FamillyComponent),
	},
	{
		path: 'chore-homepage',
		loadComponent: () => import('./pages/Chores/chore-homepage/chore-homepage.component').then(c => c.ChoreHomepageComponent),
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
		path: 'chore-edition/:taskId',
		loadComponent: () => import('./pages/Chores/chore-edition/chore-edition.component').then(c => c.ChoreEditionComponent),
	},
	{
		path: 'calendar',
		loadComponent: () => import('./pages/Chores/calendar/calendar.component').then(c => c.CalendarComponent),
	},
	{
		path: 'custom-task-creation',
		loadComponent: () =>
			import('./pages/Chores/custom-task-creation/custom-task-creation.component').then(c => c.CustomTaskCreationComponent),
	},
	{
		path: '',
		redirectTo: 'login-homepage',
		pathMatch: 'full',
	},
];
