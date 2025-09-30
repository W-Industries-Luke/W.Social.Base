import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, SignUpRequest } from '../../services/auth.service';

export interface SignUpDialogData {
  title?: string;
}

@Component({
  selector: 'lib-signup-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './signup-dialog.component.html',
  styleUrl: './signup-dialog.component.css'
})
export class SignUpDialogComponent {
  signUpForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SignUpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SignUpDialogData
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.signUpForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const signUpData: SignUpRequest = {
        username: this.signUpForm.get('username')?.value,
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value,
        confirmPassword: this.signUpForm.get('confirmPassword')?.value
      };

      // Note: For now, we'll just close with the signup data since there's no signup endpoint yet
      // In a real implementation, you would call this.authService.signUp(signUpData)
      setTimeout(() => {
        this.isLoading = false;
        this.dialogRef.close({ success: true, data: signUpData });
      }, 1500);

      // TODO: Implement actual signup service call when endpoint is available
      // this.authService.signUp(signUpData).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     this.dialogRef.close(response);
      //   },
      //   error: (error) => {
      //     this.isLoading = false;
      //     this.errorMessage = error.error?.message || 'Sign up failed. Please try again.';
      //   }
      // });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}