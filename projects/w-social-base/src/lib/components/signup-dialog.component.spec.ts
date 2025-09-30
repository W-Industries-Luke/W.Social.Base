import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SignUpDialogComponent } from './signup-dialog.component';
import { AuthService } from '../services/auth.service';

describe('SignUpDialogComponent', () => {
  let component: SignUpDialogComponent;
  let fixture: ComponentFixture<SignUpDialogComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SignUpDialogComponent>>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        SignUpDialogComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.signUpForm.get('username')?.value).toBe('');
    expect(component.signUpForm.get('email')?.value).toBe('');
    expect(component.signUpForm.get('password')?.value).toBe('');
    expect(component.signUpForm.get('confirmPassword')?.value).toBe('');
    expect(component.signUpForm.invalid).toBeTruthy();
  });

  it('should validate required fields', () => {
    const usernameControl = component.signUpForm.get('username');
    const emailControl = component.signUpForm.get('email');
    const passwordControl = component.signUpForm.get('password');
    const confirmPasswordControl = component.signUpForm.get('confirmPassword');

    expect(usernameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
    expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.signUpForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.signUpForm.get('password');
    
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    expect(passwordControl?.hasError('pattern')).toBeTruthy();
    
    passwordControl?.setValue('StrongPass123');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
    expect(passwordControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate password confirmation', () => {
    component.signUpForm.patchValue({
      password: 'StrongPass123',
      confirmPassword: 'DifferentPass123'
    });
    
    const confirmPasswordControl = component.signUpForm.get('confirmPassword');
    expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeTruthy();
    
    component.signUpForm.patchValue({
      confirmPassword: 'StrongPass123'
    });
    
    expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should validate username pattern', () => {
    const usernameControl = component.signUpForm.get('username');
    
    usernameControl?.setValue('invalid-username!');
    expect(usernameControl?.hasError('pattern')).toBeTruthy();
    
    usernameControl?.setValue('valid_username123');
    expect(usernameControl?.hasError('pattern')).toBeFalsy();
  });

  it('should close dialog with signup data on successful submission', (done) => {
    component.signUpForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'StrongPass123',
      confirmPassword: 'StrongPass123'
    });

    component.onSubmit();

    // Since we're using setTimeout in the component, we need to wait
    setTimeout(() => {
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        success: true,
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'StrongPass123',
          confirmPassword: 'StrongPass123'
        }
      });
      done();
    }, 1600);
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});