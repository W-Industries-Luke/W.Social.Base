import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, LoginRequest, LoginResponse } from '../services/auth.service';

export interface LoginDialogData {
  title?: string;
}

@Component({
  selector: 'lib-login-dialog',
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
    <h2 mat-dialog-title>{{ data?.title || 'Login' }}</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="login-dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username or Email</mat-label>
          <input matInput 
                 formControlName="username" 
                 placeholder="Enter your username or email"
                 autocomplete="username">
          <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
            Username is required
          </mat-error>
          <mat-error *ngIf="loginForm.get('username')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput 
                 [type]="hidePassword ? 'password' : 'text'" 
                 formControlName="password"
                 placeholder="Enter your password"
                 autocomplete="current-password">
          <button mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters long
          </mat-error>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Signing in...</span>
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
                [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .login-dialog-content {
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
export class LoginDialogComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response: LoginResponse) => {
          this.isLoading = false;
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}