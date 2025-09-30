import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, SignUpRequest } from '../services/auth.service';

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
  template: `
    <h2 mat-dialog-title>{{ data?.title || 'Create Account' }}</h2>
    
    <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="signup-dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput 
                 formControlName="username" 
                 placeholder="Choose a username"
                 autocomplete="username">
          <mat-error *ngIf="signUpForm.get('username')?.hasError('required')">
            Username is required
          </mat-error>
          <mat-error *ngIf="signUpForm.get('username')?.hasError('minlength')">
            Username must be at least 3 characters long
          </mat-error>
          <mat-error *ngIf="signUpForm.get('username')?.hasError('pattern')">
            Username can only contain letters, numbers, and underscores
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput 
                 formControlName="email" 
                 placeholder="Enter your email address"
                 autocomplete="email">
          <mat-error *ngIf="signUpForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="signUpForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput 
                 [type]="hidePassword ? 'password' : 'text'" 
                 formControlName="password"
                 placeholder="Create a password"
                 autocomplete="new-password">
          <button mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="signUpForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="signUpForm.get('password')?.hasError('minlength')">
            Password must be at least 8 characters long
          </mat-error>
          <mat-error *ngIf="signUpForm.get('password')?.hasError('pattern')">
            Password must contain at least one uppercase letter, one lowercase letter, and one number
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput 
                 [type]="hideConfirmPassword ? 'password' : 'text'" 
                 formControlName="confirmPassword"
                 placeholder="Confirm your password"
                 autocomplete="new-password">
          <button mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hideConfirmPassword = !hideConfirmPassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hideConfirmPassword">
            <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="signUpForm.get('confirmPassword')?.hasError('required')">
            Please confirm your password
          </mat-error>
          <mat-error *ngIf="signUpForm.get('confirmPassword')?.hasError('passwordMismatch')">
            Passwords do not match
          </mat-error>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Creating account...</span>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button 
                type="button" 
                (click)="onCancel()"
                [disabled]="isLoading">
          Cancel
        </button>
        <button mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="signUpForm.invalid || isLoading">
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .signup-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      max-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
      text-align: center;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 16px 0;
    }

    .loading-container span {
      font-size: 14px;
      color: #666;
    }

    mat-dialog-actions {
      margin-top: 16px;
    }
  `]
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