import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	IonAvatar,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonImg,
	IonInput,
	IonLabel,
	IonRow,
	IonText,
	IonToolbar,
	ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth/auth.service';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FamillyService } from '../../../services/famillyService/familly.service';

/*
This page serves as profile page where the user can log out, change its username, profile picture, etc. 
*/

const ionicElements = [
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonLabel,
	IonInput,
	IonAvatar,
	IonImg,
	IonGrid,
	IonRow,
	IonCol,
	IonText,
];

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

	public userEmailForm: FormGroup = new FormGroup({
		email: new FormControl('', Validators.email),
	});

	constructor(
		private readonly _modalCtrl: ModalController,
		private readonly _authService: AuthService,
		private readonly _firestore: Firestore,
		private readonly _router: Router,
		private readonly _famillyService: FamillyService,
	) {}

	async ionViewWillEnter() {
		this.userNameForm.patchValue({ username: this.user?.displayName });
		this.userEmailForm.patchValue({ email: this.user?.email });
	}

	// public async updateEmail() {
	// 	try {
	// 		const { email } = this.userEmailForm.value;

	// 		await this._authService.updateUserEmail(email);

	// 		// Update email in Firestore Users collection
	// 		const userDocRef = doc(this._firestore, 'Users', this.user.uid);
	// 		await updateDoc(userDocRef, { email });

	// 		console.log('Email updated successfully:', email);
	// 	} catch (error) {
	// 		console.error('Error updating email:', error);
	// 	}
	// }

	public async updateUsername() {
		try {
			const { username } = this.userNameForm.value;
			await this._authService.updateUserProfile({ displayName: username });

			const userDocRef = doc(this._firestore, 'Users', this.user.uid);
			await updateDoc(userDocRef, { username });
			console.log('Username updated successfully:', username);
		} catch (error) {
			console.error('Error updating username:', error);
		}
	}

	public async addMemberToFamilly(memberId: IonInput) {
		try {
			const memberIdentifier = memberId.value as string;
			if (memberIdentifier) {
				await this._famillyService.addMemberToFamillyGroup(memberIdentifier);
			}
			// console.log('Member added to family group successfully!');
		} catch (error) {
			console.error('Error adding member to family group:', error);
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
