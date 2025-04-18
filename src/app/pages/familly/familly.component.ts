import { Component } from '@angular/core';
import { TaskSelectionService } from '../../services/tasks/task-selection.service';
import { Router, RouterLink } from '@angular/router';

/*
This component will ask the user to create a family group.
The input value will be used to create the collection for the user.
*/

@Component({
	selector: 'app-familly',
	imports: [RouterLink],
	templateUrl: './familly.component.html',
	styleUrl: './familly.component.scss',
})
export class FamillyComponent {
	constructor(private readonly _taskSelectionService: TaskSelectionService, private readonly _router: Router) {}

	public familyName: string = '';

	public createFamily(inputValue: string) {
		this.familyName = inputValue;
		this._taskSelectionService.setFamillyGroup(this.familyName);
		this._router.navigate(['/chore-homepage']);
		console.log('Family name:', this.familyName);
	}
}
