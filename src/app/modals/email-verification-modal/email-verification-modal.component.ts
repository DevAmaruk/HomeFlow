import { Component, OnInit } from '@angular/core';
import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonRow,
	IonText,
	IonTitle,
	IonToolbar,
	ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-email-verification-modal',
	templateUrl: './email-verification-modal.component.html',
	styleUrls: ['./email-verification-modal.component.scss'],
	imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonText],
})
export class EmailVerificationModalComponent {
	constructor(private readonly _modalCtrl: ModalController, private readonly _authService: AuthService) {}

	public async resendVerificationEmail() {
		try {
			await this._authService.resendVerificationEmail();
			console.log('Verification email resent.');
		} catch (error) {
			console.error('Error resending verification email:', error);
		}
	}

	public closeModal() {
		this._modalCtrl.dismiss();
	}
}
