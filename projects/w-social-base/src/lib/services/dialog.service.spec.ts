import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { DialogService } from './dialog.service';
import { LoginDialogComponent } from '../components/login-dialog.component';
import { SignUpDialogComponent } from '../components/signup-dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatDialog.open.and.returnValue(mockDialogRef);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open login dialog with default configuration', () => {
    const mockResponse = { token: 'mock-token', user: { id: '1', username: 'test', email: 'test@example.com', isAuthenticated: true } };
    mockDialogRef.afterClosed.and.returnValue(of(mockResponse));

    service.openLoginDialog();

    expect(mockMatDialog.open).toHaveBeenCalledWith(LoginDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: {},
      disableClose: false,
      autoFocus: true
    });
  });

  it('should open login dialog with custom data', () => {
    const customData = { title: 'Custom Login' };
    mockDialogRef.afterClosed.and.returnValue(of(undefined));

    service.openLoginDialog(customData);

    expect(mockMatDialog.open).toHaveBeenCalledWith(LoginDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: customData,
      disableClose: false,
      autoFocus: true
    });
  });

  it('should open signup dialog with default configuration', () => {
    const mockResponse = { success: true, data: {} };
    mockDialogRef.afterClosed.and.returnValue(of(mockResponse));

    service.openSignUpDialog();

    expect(mockMatDialog.open).toHaveBeenCalledWith(SignUpDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: {},
      disableClose: false,
      autoFocus: true
    });
  });

  it('should open signup dialog with custom data', () => {
    const customData = { title: 'Custom Sign Up' };
    mockDialogRef.afterClosed.and.returnValue(of(undefined));

    service.openSignUpDialog(customData);

    expect(mockMatDialog.open).toHaveBeenCalledWith(SignUpDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: customData,
      disableClose: false,
      autoFocus: true
    });
  });

  it('should return observable from dialog afterClosed', () => {
    const mockResponse = { token: 'mock-token', user: { id: '1', username: 'test', email: 'test@example.com', isAuthenticated: true } };
    mockDialogRef.afterClosed.and.returnValue(of(mockResponse));

    const result = service.openLoginDialog();

    result.subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });
});