import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginDialogComponent, LoginDialogData } from '../components/login-dialog/login-dialog.component';
import { SignUpDialogComponent, SignUpDialogData } from '../components/signup-dialog/signup-dialog.component';
import { LoginResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  /**
   * Opens the login dialog
   * @param data Optional configuration for the dialog
   * @returns Observable that emits the login response if successful, or undefined if cancelled
   */
  openLoginDialog(data?: LoginDialogData): Observable<LoginResponse | undefined> {
    const dialogRef: MatDialogRef<LoginDialogComponent, LoginResponse> = this.dialog.open(
      LoginDialogComponent, 
      {
        width: '400px',
        maxWidth: '90vw',
        data: data || {},
        disableClose: false,
        autoFocus: true
      }
    );

    return dialogRef.afterClosed();
  }

  /**
   * Opens the sign-up dialog
   * @param data Optional configuration for the dialog
   * @returns Observable that emits the signup result if successful, or undefined if cancelled
   */
  openSignUpDialog(data?: SignUpDialogData): Observable<any | undefined> {
    const dialogRef: MatDialogRef<SignUpDialogComponent, any> = this.dialog.open(
      SignUpDialogComponent, 
      {
        width: '400px',
        maxWidth: '90vw',
        data: data || {},
        disableClose: false,
        autoFocus: true
      }
    );

    return dialogRef.afterClosed();
  }
}