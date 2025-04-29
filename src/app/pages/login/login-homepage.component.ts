import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonImg, IonButton, IonText, IonRouterLink } from '@ionic/angular/standalone';

const ionicElements = [IonContent, IonGrid, IonRow, IonCol, IonImg, IonButton, IonText, IonRouterLink];

@Component({
	selector: 'app-login-homepage',
	templateUrl: './login-homepage.component.html',
	styleUrls: ['./login-homepage.component.scss'],
	imports: [...ionicElements, RouterLink],
})
export class LoginHomepageComponent {}
