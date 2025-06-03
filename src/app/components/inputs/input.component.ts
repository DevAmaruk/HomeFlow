import { Component, Input } from '@angular/core';
import {
	FormControlName,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	IonGrid,
	IonCol,
	IonRow,
	IonInput,
	IonText,
	IonContent,
} from '@ionic/angular/standalone';

const ionicElements = [IonGrid, IonRow, IonCol, IonInput, IonText];

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	imports: [...ionicElements, ReactiveFormsModule, FormsModule],
})
export class InputComponent {
	@Input() formControlName?: FormControlName;
}
