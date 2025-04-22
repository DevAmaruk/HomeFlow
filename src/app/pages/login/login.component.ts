import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

	public user?: User | null;

	public isSignInHidden: boolean = true;

	constructor(
		private readonly _authService: AuthService,
		private readonly _route: Router,
		private readonly _firestore: Firestore,
	) {}

	async ngOnInit() {
		this.createSignUpForm();
		this.createSignInForm();
	}

	public toggleSignInVisibility() {
		this.isSignInHidden = !this.isSignInHidden;
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

	public async onSignUp() {
		try {
			const { email, password } = this.signUpForm.value;

			// We get the user from the AuthService
			this.user = await this._authService.signUp(email, password);

			// Check if the user is null of undefined
			if (!this.user) {
				throw new Error('User is null or undefined after sign up.');
			}

			// We create a ref to the document in the Users collection using the user uid.
			const userDocRef = doc(this._firestore, 'Users', this.user.uid);

			//We set the document with the uid of the signed up user and add the fields email and uid inside.
			await setDoc(userDocRef, {
				email: this.user.email,
				uid: this.user.uid,
			});

			// To prevent any theft, we reset the form.
			this.signUpForm.reset();

			this._route.navigate(['/family']);
			console.log('User signed up successfully:', this.user.email);
		} catch (error) {
			console.error('Error signing up:', error);
		}
	}

	public async onSignIn() {
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

			this._route.navigate(['/chore-homepage']);
		} catch (error) {
			console.error('Error signing in:', error);
		}
	}
}
