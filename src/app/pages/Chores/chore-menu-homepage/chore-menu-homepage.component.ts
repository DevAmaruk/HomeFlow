import { Component, OnInit } from '@angular/core';
import {
	IonCol,
	IonGrid,
	IonImg,
	IonRow,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonText,
} from '@ionic/angular/standalone';

const ionicElements = [
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonText,
	IonCol,
	IonRow,
	IonGrid,
	IonImg,
];

@Component({
	selector: 'app-chore-menu-homepage',
	templateUrl: './chore-menu-homepage.component.html',
	styleUrls: ['./chore-menu-homepage.component.scss'],
	imports: [...ionicElements],
})
export class ChoreMenuHomepageComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
