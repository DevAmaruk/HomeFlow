import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	public signUpForm: FormGroup = new FormGroup({});
	public signInForm: FormGroup = new FormGroup({});

	public user: User | undefined;

	constructor(
		private readonly _authService: AuthService,
		private readonly _route: Router,
		private readonly _firestore: Firestore,
	) {}

	async ngOnInit() {
		this.createSignUpForm();
		this.createSignInForm();
		// this.onAnonymousSignIn();
	}

	public createSignUpForm() {
		this.signUpForm = new FormGroup({
			email: new FormControl(''),
			password: new FormControl(''),
		});
	}

	public createSignInForm() {
		this.signInForm = new FormGroup({
			email: new FormControl(''),
			password: new FormControl(''),
		});
	}

	// // Anonymous sign in method
	// async onAnonymousSignIn() {
	// 	try {
	// 		this.userCredential = await this._authService.anonymousSignIn();
	// 		this.user = this.userCredential.user;
	// 		console.log('User signed in anonymously:', this.user.uid);
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			console.error('Error signing in anonymously:', error.message);
	// 		}
	// 	}
	// }

	public async onSignUp() {
		try {
			const { email, password } = this.signUpForm.value;

			// We get the user from the AuthService
			this.user = await this._authService.signUp(email, password);

			// Check if the user is null of undefined
			if (!this.user) {
				throw new Error('User is null or undefined after sign up.');
			}

			// We get the email from the current user signing up
			const userUid = this.user.uid;

			// Check if the email is null of undefined
			if (!userUid) {
				throw new Error('User uid is null or undefined.');
			}

			// We create a ref to the document in the Users collection using the user uid.
			const userDocRef = doc(this._firestore, 'Users', userUid);

			//We set the document with the uid of the signed up user and add the fields email and uid inside.
			await setDoc(userDocRef, {
				email: this.user.email,
				uid: this.user.uid,
			});

			this.signUpForm.reset();

			this._route.navigate(['/family']);
			console.log('User signed up successfully:', this.user.email);
		} catch (error) {
			console.error('Error signing up:', error);
		}
	}

	public async onSignIn() {
		try {
			const { email, password } = this.signInForm.value;

			this.user = await this._authService.signIn(email, password);

			if (!this.user) {
				throw new Error('User is null or undefined after sign in.');
			}

			console.log('User signed in successfully:', this.user.email);

			this.signInForm.reset();

			this._route.navigate(['/chore-homepage']);
		} catch (error) {
			console.error('Error signing in:', error);
		}
	}
}
