# Dialog Components Usage Guide

This library now includes Angular Material dialog components for authentication workflows.

## Components

### LoginDialogComponent
A Material Design dialog component for user login with form validation.

### SignUpDialogComponent
A Material Design dialog component for user registration with form validation.

### DialogService
A service for easily opening authentication dialogs.

## Installation Requirements

Make sure you have Angular Material installed in your consuming application:

```bash
ng add @angular/material
```

## Usage

### Method 1: Using DialogService (Recommended)

```typescript
import { Component } from '@angular/core';
import { DialogService, LoginResponse } from 'w-social-base';

@Component({
  selector: 'app-example',
  template: `
    <button mat-raised-button color="primary" (click)="openLogin()">
      Login
    </button>
    <button mat-raised-button color="accent" (click)="openSignUp()">
      Sign Up
    </button>
  `
})
export class ExampleComponent {
  
  constructor(private dialogService: DialogService) {}

  openLogin() {
    this.dialogService.openLoginDialog({ title: 'Welcome Back!' })
      .subscribe((result: LoginResponse | undefined) => {
        if (result) {
          console.log('Login successful:', result);
          // Handle successful login
        } else {
          console.log('Login cancelled');
        }
      });
  }

  openSignUp() {
    this.dialogService.openSignUpDialog({ title: 'Join Us!' })
      .subscribe((result: any | undefined) => {
        if (result?.success) {
          console.log('Sign up successful:', result.data);
          // Handle successful sign up
        } else {
          console.log('Sign up cancelled');
        }
      });
  }
}
```

### Method 2: Using MatDialog Directly

```typescript
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent, SignUpDialogComponent } from 'w-social-base';

@Component({
  selector: 'app-example',
  template: `
    <button mat-raised-button (click)="openLoginDialog()">Login</button>
    <button mat-raised-button (click)="openSignUpDialog()">Sign Up</button>
  `
})
export class ExampleComponent {
  
  constructor(private dialog: MatDialog) {}

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      data: { title: 'Custom Login Title' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Login result:', result);
      }
    });
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignUpDialogComponent, {
      width: '400px',
      data: { title: 'Create New Account' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Sign up result:', result);
      }
    });
  }
}
```

## Required Angular Material Modules

Make sure your consuming application includes these Angular Material modules:

```typescript
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  // ...
})
export class AppModule { }
```

## Features

### LoginDialogComponent Features:
- Form validation (required fields, email format, minimum password length)
- Password visibility toggle
- Loading states with spinner
- Error message display
- Integration with existing AuthService
- Responsive design

### SignUpDialogComponent Features:
- Comprehensive form validation
- Username pattern validation (alphanumeric + underscore only)
- Email format validation
- Strong password requirements
- Password confirmation matching
- Password visibility toggles for both fields
- Loading states
- Error message display

## Form Validation

### Login Form:
- Username/Email: Required
- Password: Required, minimum 6 characters

### Sign Up Form:
- Username: Required, minimum 3 characters, alphanumeric + underscore only
- Email: Required, valid email format
- Password: Required, minimum 8 characters, must contain uppercase, lowercase, and number
- Confirm Password: Required, must match password

## Interfaces

```typescript
export interface LoginDialogData {
  title?: string;
}

export interface SignUpDialogData {
  title?: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## Integration with AuthService

The LoginDialogComponent automatically integrates with the existing AuthService for authentication. The SignUpDialogComponent is prepared for integration once a signup endpoint is implemented in the AuthService.