import { Routes } from '@angular/router';

export const routes: Routes = [
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
		redirectTo: 'category',
		pathMatch: 'full',
	},
];
