import { Component } from '@angular/core';

/* 
This component is responsible for selecting a chore category. 
It will be displayed as small cards with icons and texts that the user can click on.
Each card will open a new page with the tasks of that category.
At the bottom there will be a menu with the following :

- Calendar: Open the Calendar page
- Task List: Open the "homepage" of the chore section with the list of all tasks for the current day.
- Scoreboard: Open the scoreboard page
- Settings: Open the settings modal (TO THINK MORE ABOUT THIS ONE)
*/

@Component({
	selector: 'app-chore-category-selection',
	imports: [],
	templateUrl: './chore-category-selection.component.html',
	styleUrl: './chore-category-selection.component.scss',
})
export class ChoreCategorySelectionComponent {}
