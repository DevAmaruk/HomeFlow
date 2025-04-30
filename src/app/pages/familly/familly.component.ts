import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FamillyService } from '../../services/famillyService/familly.service';
import { IonContent, IonGrid, IonInput, IonButton, IonCol, IonRow, IonText } from '@ionic/angular/standalone';

/*
This component will ask the user to create a family group.
The input value will be used to create the collection for the user.
*/

const ionicElements = [IonContent, IonInput, IonButton, IonGrid, IonCol, IonRow, IonText];

@Component({
	selector: 'app-familly',
	imports: [...ionicElements],
	templateUrl: './familly.component.html',
	styleUrl: './familly.component.scss',
})
export class FamillyComponent {
	constructor(private readonly _router: Router, private readonly _famillyService: FamillyService) {}

	public async createFamilly(famillyInputName: IonInput) {
		try {
			const famillyName = famillyInputName.value as string;
			if (famillyName) {
				await this._famillyService.createFamillyGroup(famillyName);
				this._router.navigate(['/chore-menu-homepage/chore-homepage']);
			}
		} catch (error) {
			console.error('Error creating family group:', error);
		}
	}
}
