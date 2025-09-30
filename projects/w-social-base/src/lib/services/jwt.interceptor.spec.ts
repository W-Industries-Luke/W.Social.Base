import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { JwtService } from './jwt.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { of, throwError } from 'rxjs';

describe('JwtInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let jwtService: jasmine.SpyObj<JwtService>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockToken: string;

  beforeEach(() => {
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['getToken', 'isTokenValid', 'setToken', 'removeToken']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Create mock token
    const payload = {
      sub: 'user123',
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const header = { alg: 'HS256', typ: 'JWT' };
    mockToken = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.signature`;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token is valid', () => {
    jwtService.getToken.and.returnValue(mockToken);
    jwtService.isTokenValid.and.returnValue(true);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not add Authorization header when no token exists', () => {
    jwtService.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not add Authorization header when token is invalid', () => {
    jwtService.getToken.and.returnValue(mockToken);
    jwtService.isTokenValid.and.returnValue(false);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  describe('Excluded Routes', () => {
    it('should not add token to login route', () => {
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);

      httpClient.post('/auth/login', {}).subscribe();

      const req = httpMock.expectOne('/auth/login');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not add token to register route', () => {
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);

      httpClient.post('/auth/register', {}).subscribe();

      const req = httpMock.expectOne('/auth/register');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not add token to refresh route', () => {
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);

      httpClient.post('/auth/refresh', {}).subscribe();

      const req = httpMock.expectOne('/auth/refresh');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('401 Error Handling', () => {
    it('should attempt token refresh on 401 error', () => {
      const newToken = 'new-token';
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);
      authService.refreshToken.and.returnValue(of({ token: newToken }));
      jwtService.setToken.and.stub();

      httpClient.get('/api/protected').subscribe({
        next: (response) => expect(response).toEqual({ data: 'success' }),
        error: () => fail('Should not error after successful refresh')
      });

      // First request with 401 error
      const firstReq = httpMock.expectOne(req => 
        req.url === '/api/protected' && 
        req.headers.get('Authorization') === `Bearer ${mockToken}`
      );
      firstReq.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Second request with new token
      const secondReq = httpMock.expectOne(req => 
        req.url === '/api/protected' && 
        req.headers.get('Authorization') === `Bearer ${newToken}`
      );
      secondReq.flush({ data: 'success' });

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(jwtService.setToken).toHaveBeenCalledWith(newToken);
    });

    it('should remove token when refresh fails', () => {
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);
      authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));
      jwtService.removeToken.and.stub();

      httpClient.get('/api/protected').subscribe({
        next: () => fail('Should error when refresh fails'),
        error: (error) => expect(error).toBeTruthy()
      });

      // First request with 401 error
      const req = httpMock.expectOne('/api/protected');
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(jwtService.removeToken).toHaveBeenCalled();
    });

    it('should not attempt refresh for non-401 errors', () => {
      jwtService.getToken.and.returnValue(mockToken);
      jwtService.isTokenValid.and.returnValue(true);

      httpClient.get('/api/test').subscribe({
        next: () => fail('Should error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ error: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should not attempt refresh when no token exists', () => {
      jwtService.getToken.and.returnValue(null);

      httpClient.get('/api/test').subscribe({
        next: () => fail('Should error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
  });
});