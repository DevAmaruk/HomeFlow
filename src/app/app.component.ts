import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import '@khmyznikov/pwa-install';

@Component({
	selector: 'app-root',
	imports: [IonApp, IonRouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
	constructor() {
		addIcons(allIcons);
	}
}
