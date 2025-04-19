import { Component } from '@angular/core';
import { SignInService } from '../../services/sign-in/sign-in.service';
import { CommonModule } from '@angular/common';
import { User, UserCredential } from '@angular/fire/auth';

@Component({
	selector: 'app-login',
	imports: [CommonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	public user: any;

	constructor(private readonly _signInService: SignInService) {
		this.user = this._signInService.user;
	}

	async signUpUser(email: string, password: string) {
		this._signInService.signUpWithEmailAndPassword(email, password);
	}
}
