import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonToolbar,
	ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth/auth.service';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

/*
This page serves as profile page where the user can log out, change its username, profile picture, etc. 
*/

const ionicElements = [IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonLabel, IonInput];

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
	imports: [...ionicElements, ReactiveFormsModule],
})
export class ProfilePageComponent {
	@Input() user: any;

	public userNameForm: FormGroup = new FormGroup({
		username: new FormControl(''),
	});

	constructor(
		private readonly _modalCtrl: ModalController,
		private readonly _authService: AuthService,
		private readonly _firestore: Firestore,
		private readonly _router: Router,
	) {}

	async ionViewWillEnter() {
		console.log('User:', this.user);
		this.userNameForm.patchValue({ username: this.user?.displayName });
		console.log('UserNameForm:', this.userNameForm.value.username);
	}

	public async updateUsername() {
		try {
			const { username } = this.userNameForm.value;
			await this._authService.updateUserProfile({ displayName: username });

			const userDocRef = doc(this._firestore, 'Users', this.user.uid);
			await updateDoc(userDocRef, { username });
			console.log('Username updated successfully:', username);
			this.closeModal();
		} catch (error) {
			console.error('Error updating username:', error);
		}
	}

	public closeModal() {
		this._modalCtrl.dismiss();
	}

	public async onSignOut() {
		try {
			await this._authService.signOut();
			this._router.navigate(['/login-homepage']);

			this.closeModal();
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}
}
