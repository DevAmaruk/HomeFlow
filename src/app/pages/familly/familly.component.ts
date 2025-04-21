import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FamillyService } from '../../services/famillyService/familly.service';

/*
This component will ask the user to create a family group.
The input value will be used to create the collection for the user.
*/

@Component({
	selector: 'app-familly',
	imports: [],
	templateUrl: './familly.component.html',
	styleUrl: './familly.component.scss',
})
export class FamillyComponent {
	constructor(private readonly _router: Router, private readonly _famillyService: FamillyService) {}

	public async createFamilly(famillyInputName: string) {
		await this._famillyService.createFamillyGroup(famillyInputName); // Call the service to create the family group
		this._router.navigate(['/chore-homepage']);
	}
}
