import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';

@Component({
	selector: 'app-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	public signUpForm: FormGroup;

	public currentUser?: User | null;

	constructor(private readonly _authService: AuthService) {
		this.signUpForm = new FormGroup({
			email: new FormControl(''),
			password: new FormControl(''),
		});

		this._authService
			.anonymousSignIn()
			.then(userCredential => {
				console.log('User signed in anonymously:', userCredential);
			})
			.catch(error => {
				console.error('Error signing in anonymously:', error);
			});

		this.currentUser = this._authService.user;
	}

	async onSignUp() {
		const { email, password } = this.signUpForm.value;

		try {
			const userCredential = await this._authService.signUp(email, password);
			console.log('User signed up successfully:', userCredential);
		} catch (error) {
			console.error('Error signing up:', error);
		}
	}

	async onSignIn() {
		const { email, password } = this.signUpForm.value;
		try {
			const userCredential = await this._authService.signIn(email, password);
			console.log('User signed in successfully:', userCredential.user);
		} catch (error) {
			console.error('Error signing in:', error);
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
