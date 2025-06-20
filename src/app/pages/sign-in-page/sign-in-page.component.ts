import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { AuthErrorCodes, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonRow } from '@ionic/angular/standalone';
import { FirebaseError } from '@angular/fire/app';

/*
This page is used to sign in the user. It is a simple page that contains a form with two fields: email and password. 
It will check if the user is already signed in with Firebase Auth
*/

const ionicElements = [IonContent, IonGrid, IonRow, IonCol, IonImg, IonButton, IonInput];

@Component({
	selector: 'app-sign-in-page',
	imports: [ReactiveFormsModule, ...ionicElements],
	templateUrl: './sign-in-page.component.html',
	styleUrl: './sign-in-page.component.scss',
})
export class SignInPageComponent implements OnInit {
	public signInForm: FormGroup = new FormGroup({});
	public passwordResetForm: FormGroup = new FormGroup({});

	public user: User | null = null;

	public errorMessage: string | null = null;

	constructor(private readonly _authService: AuthService, private readonly _route: Router) {}

	ngOnInit() {
		this.createSignInForm();
		this.createPasswordResetForm();
	}

	public createSignInForm() {
		this.signInForm = new FormGroup({
			email: new FormControl(''),
			password: new FormControl(''),
		});
	}

	public createPasswordResetForm() {
		this.passwordResetForm = new FormGroup({
			email: new FormControl('', Validators.compose([Validators.email])),
		});
	}

	public async onSignIn() {
		this.errorMessage = null;
		try {
			//We create a variable Object that contains both values of the signInForm.
			const { email, password } = this.signInForm.value;

			// We get the user from the AuthService SignIn method.
			this.user = await this._authService.signIn(email, password);

			if (!this.user) {
				throw new Error('User is null or undefined after sign in.');
			}

			console.log('User signed in successfully:', this.user.email);

			// To prevent any theft, we reset the form.
			this.signInForm.reset();

			this._route.navigate(['/chore-menu-homepage/chore-homepage']);
		} catch (error) {
			if (error instanceof FirebaseError) {
				console.error('Firebase error code:', error.code); // Log the error code
				switch (error.code) {
					case AuthErrorCodes.INVALID_PASSWORD:
						this.errorMessage = 'Wrong password. Please try again.';
						break;
					case AuthErrorCodes.INVALID_EMAIL:
						this.errorMessage = 'Invalid email. Please try again.';
						break;
					case AuthErrorCodes.CREDENTIAL_MISMATCH:
						this.errorMessage = 'Your credentials do not match. Please check your email and password.';
						break;
					default:
						this.errorMessage = 'An unexpected error occurred. Please try again.';
				}
			} else {
				this.errorMessage = 'An error occurred. Please try again.';
			}
		}
	}

	public async onPasswordReset() {
		try {
			const { email } = this.passwordResetForm.value;

			if (!email) {
				throw new Error('Email is required for password reset.');
			}

			await this._authService.sendPasswordResetEmail(email);
			console.log('Password reset email sent successfully to:', email);

			this.passwordResetForm.reset();
		} catch (error) {
			console.error('Error sending password reset email:', error);
		}
	}
}
