import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginRequest, LoginResponse, AuthUser } from './auth.service';
import { ConfigService } from './config.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, ConfigService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockLoginRequest: LoginRequest = {
      username: 'testuser',
      password: 'testpass'
    };

    const mockLoginResponse: LoginResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        isAuthenticated: true
      }
    };

    service.login(mockLoginRequest).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
    });

    const req = httpMock.expectOne(`${configService.getHeartlandAuthRoute()}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockLoginResponse);
  });

  it('should logout successfully', () => {
    service.logout().subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${configService.getHeartlandAuthRoute()}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should get current user', () => {
    const mockUser: AuthUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      isAuthenticated: true
    };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${configService.getHeartlandAuthRoute()}/auth/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should validate token', () => {
    const token = 'test-token';

    service.validateToken(token).subscribe(isValid => {
      expect(isValid).toBe(true);
    });

    const req = httpMock.expectOne(`${configService.getHeartlandAuthRoute()}/auth/validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token });
    req.flush(true);
  });
});