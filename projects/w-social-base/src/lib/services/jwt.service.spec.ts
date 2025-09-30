import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let mockToken: string;
  let expiredToken: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService]
    });
    service = TestBed.inject(JwtService);
    
    // Clear localStorage before each test
    localStorage.clear();

    // Create mock JWT tokens
    // Valid token (expires in the future)
    const validPayload = {
      sub: 'user123',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    };
    const validHeader = { alg: 'HS256', typ: 'JWT' };
    mockToken = `${btoa(JSON.stringify(validHeader))}.${btoa(JSON.stringify(validPayload))}.signature`;

    // Expired token
    const expiredPayload = {
      sub: 'user123',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      iat: Math.floor(Date.now() / 1000) - 7200
    };
    expiredToken = `${btoa(JSON.stringify(validHeader))}.${btoa(JSON.stringify(expiredPayload))}.signature`;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Storage', () => {
    it('should store token in localStorage', () => {
      service.setToken(mockToken);
      expect(localStorage.getItem('jwt_token')).toBe(mockToken);
    });

    it('should retrieve token from localStorage', () => {
      localStorage.setItem('jwt_token', mockToken);
      expect(service.getToken()).toBe(mockToken);
    });

    it('should remove token from localStorage', () => {
      service.setToken(mockToken);
      service.removeToken();
      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(service.getToken()).toBeNull();
    });

    it('should emit token changes through observable', (done) => {
      service.token$.subscribe(token => {
        if (token === mockToken) {
          done();
        }
      });
      service.setToken(mockToken);
    });
  });

  describe('Token Decoding', () => {
    it('should decode valid JWT token', () => {
      const payload = service.decodeToken(mockToken);
      expect(payload).toBeTruthy();
      expect(payload?.sub).toBe('user123');
      expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should return null for invalid token format', () => {
      const payload = service.decodeToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for null token', () => {
      const payload = service.decodeToken(null!);
      expect(payload).toBeNull();
    });

    it('should decode token from storage if no token provided', () => {
      service.setToken(mockToken);
      const payload = service.decodeToken();
      expect(payload?.sub).toBe('user123');
    });
  });

  describe('Token Validation', () => {
    it('should validate unexpired token', () => {
      expect(service.isTokenValid(mockToken)).toBe(true);
    });

    it('should invalidate expired token', () => {
      expect(service.isTokenValid(expiredToken)).toBe(false);
    });

    it('should invalidate null token', () => {
      expect(service.isTokenValid(null!)).toBe(false);
    });

    it('should check token from storage if no token provided', () => {
      service.setToken(mockToken);
      expect(service.isTokenValid()).toBe(true);
    });

    it('should detect expired token', () => {
      expect(service.isTokenExpired(expiredToken)).toBe(true);
      expect(service.isTokenExpired(mockToken)).toBe(false);
    });
  });

  describe('Token Expiration', () => {
    it('should get token expiration date', () => {
      const expirationDate = service.getTokenExpirationDate(mockToken);
      expect(expirationDate).toBeInstanceOf(Date);
      expect(expirationDate?.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return null for token without exp claim', () => {
      const noExpPayload = { sub: 'user123' };
      const noExpHeader = { alg: 'HS256', typ: 'JWT' };
      const noExpToken = `${btoa(JSON.stringify(noExpHeader))}.${btoa(JSON.stringify(noExpPayload))}.signature`;
      
      const expirationDate = service.getTokenExpirationDate(noExpToken);
      expect(expirationDate).toBeNull();
    });
  });

  describe('User Information', () => {
    it('should get user ID from token', () => {
      const userId = service.getUserId(mockToken);
      expect(userId).toBe('user123');
    });

    it('should return null for token without sub claim', () => {
      const noSubPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const noSubHeader = { alg: 'HS256', typ: 'JWT' };
      const noSubToken = `${btoa(JSON.stringify(noSubHeader))}.${btoa(JSON.stringify(noSubPayload))}.signature`;
      
      const userId = service.getUserId(noSubToken);
      expect(userId).toBeNull();
    });
  });

  describe('Authentication Status', () => {
    it('should return true for authenticated user with valid token', () => {
      service.setToken(mockToken);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false for unauthenticated user', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false for user with expired token', () => {
      service.setToken(expiredToken);
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});