import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginDialogComponent } from './login-dialog.component';
import { AuthService } from '../services/auth.service';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LoginDialogComponent>>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        LoginDialogComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should validate required fields', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    expect(usernameControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();

    usernameControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');

    expect(usernameControl?.hasError('required')).toBeFalsy();
    expect(passwordControl?.hasError('required')).toBeFalsy();
  });

  it('should call AuthService login on form submit', () => {
    const mockResponse = { token: 'mock-token', user: { id: '1', username: 'test', email: 'test@example.com', isAuthenticated: true } };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: 'test@example.com',
      password: 'password123'
    });
  });

  it('should close dialog with response on successful login', () => {
    const mockResponse = { token: 'mock-token', user: { id: '1', username: 'test', email: 'test@example.com', isAuthenticated: true } };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle login error', () => {
    const mockError = { error: { message: 'Invalid credentials' } };
    mockAuthService.login.and.returnValue(throwError(() => mockError));

    component.loginForm.patchValue({
      username: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBeFalsy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});