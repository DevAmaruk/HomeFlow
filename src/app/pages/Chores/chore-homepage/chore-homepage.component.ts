import { Component } from '@angular/core';
import { FamillyService } from '../../../services/famillyService/familly.service';

/*
This component is used to display the hompage of the chores section.
It will list all the chores that are added to the familly group as active chores.
It allows to add a new member to the familly group.
*/

@Component({
	selector: 'app-chore-homepage',
	imports: [],
	templateUrl: './chore-homepage.component.html',
	styleUrl: './chore-homepage.component.scss',
})
export class ChoreHomepageComponent {
	constructor(private readonly _famillyService: FamillyService) {}
}
