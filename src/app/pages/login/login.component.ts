import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthErrorCodes, User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	public signUpForm: FormGroup = new FormGroup({});

	private userCredential: UserCredential | null = null;
	public user?: User | null;

	constructor(
		private readonly _authService: AuthService,
		private readonly _route: Router,
		private readonly _firestore: Firestore,
	) {}

	async ngOnInit() {
		await this.createSignUpForm();
		// this.onAnonymousSignIn();
	}

	async createSignUpForm() {
		this.signUpForm = new FormGroup({
			email: new FormControl(''),
			password: new FormControl(''),
		});
	}

	// Anonymous sign in method
	async onAnonymousSignIn() {
		try {
			this.userCredential = await this._authService.anonymousSignIn();
			this.user = this.userCredential.user;
			console.log('User signed in anonymously:', this.user.uid);
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error signing in anonymously:', error.message);
			}
		}
	}

	async onSignUp() {
		const { email, password } = this.signUpForm.value;
		try {
			this.userCredential = await this._authService.signUp(email, password);
			this.user = this.userCredential.user;
			const userEmail = this.user.email;

			const userDocRef = doc(this._firestore, 'Users', userEmail!);
			await setDoc(userDocRef, {
				email: this.user.email,
				uid: this.user.uid,
			});

			this._route.navigate(['/family']);
			console.log('User signed up successfully:', this.user.email);
		} catch (error) {
			if (error instanceof FirebaseError) {
				switch (error.code) {
					case AuthErrorCodes.WEAK_PASSWORD:
						console.log('Weak password:', error.code);
						break;
					case AuthErrorCodes.INVALID_EMAIL:
						console.log('Invalid email:', error.code);
						break;
					case AuthErrorCodes.EMAIL_EXISTS:
						console.log('Email already exists:', error.code);
						break;
					default:
						console.error('Error signing up:', error.message);
				}
			}
		}
	}

	async onSignIn() {
		const { email, password } = this.signUpForm.value;
		try {
			this.userCredential = await this._authService.signIn(email, password);
			this.user = this.userCredential.user;
			console.log('User signed in successfully:', this.user.email);
			this._route.navigate(['/chore-homepage']);
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
					console.log('Invalid password:', error.code);
				} else if (error.code === AuthErrorCodes.USER_DELETED) {
					console.log('User not found:', error.code);
				} else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
					console.log('Invalid email:', error.code);
				} else if (error.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
					console.log('Credential already in use:', error.code);
				}
			}
		}
	}

	async onSignOut() {
		try {
			await this._authService.signOut();
			console.log('User signed out successfully');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}
}
