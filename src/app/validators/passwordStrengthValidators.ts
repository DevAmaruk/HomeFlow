import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (!value) {
			return null; // If the value is empty, no error is returned.
		}

		const hasLetters = /[a-zA-Z]/.test(value);
		const hasNumbers = /\d/.test(value);
		const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(value);

		const isValid = hasLetters && hasNumbers && hasSymbols;

		return isValid ? null : { passwordStrength: true }; // Return error if invalid.
	};
}
