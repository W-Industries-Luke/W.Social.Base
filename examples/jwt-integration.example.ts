/**
 * Example integration of AuthService with JwtService and JwtInterceptor
 * This shows how to use the JWT services alongside the existing authentication
 */

import { Component, Injectable, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { 
  AuthService, 
  JwtService, 
  JwtInterceptor, 
  LoginRequest, 
  LoginResponse 
} from 'w-social-base';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationManager {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {
    // Listen for token changes and sync with JWT service
    this.jwtService.token$.subscribe(token => {
      if (token) {
        console.log('Token updated:', {
          userId: this.jwtService.getUserId(),
          expiresAt: this.jwtService.getTokenExpirationDate(),
          isValid: this.jwtService.isTokenValid()
        });
      }
    });
  }

  /**
   * Enhanced login that stores JWT token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.authService.login(credentials).toPromise();
      
      if (response?.token) {
        // Store the JWT token using JwtService
        this.jwtService.setToken(response.token);
        console.log('Login successful, token stored');
      }
      
      return response!;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced logout that clears JWT token
   */
  async logout(): Promise<void> {
    try {
      await this.authService.logout().toPromise();
    } finally {
      // Always clear the stored token
      this.jwtService.removeToken();
      console.log('Logout completed, token cleared');
    }
  }

  /**
   * Check authentication status using JWT
   */
  isAuthenticated(): boolean {
    return this.jwtService.isAuthenticated();
  }

  /**
   * Get current user info from token
   */
  getCurrentUserInfo() {
    if (!this.isAuthenticated()) {
      return null;
    }

    const payload = this.jwtService.decodeToken();
    return {
      userId: this.jwtService.getUserId(),
      tokenPayload: payload,
      expirationDate: this.jwtService.getTokenExpirationDate(),
      isExpired: this.jwtService.isTokenExpired()
    };
  }

  /**
   * Manually refresh token if needed
   */
  async refreshTokenIfNeeded(): Promise<void> {
    const token = this.jwtService.getToken();
    
    if (!token) {
      throw new Error('No token available');
    }

    // Check if token expires in the next 5 minutes
    const expirationDate = this.jwtService.getTokenExpirationDate();
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    
    if (expirationDate && expirationDate < fiveMinutesFromNow) {
      console.log('Token expires soon, refreshing...');
      
      try {
        const response = await this.authService.refreshToken().toPromise();
        if (response?.token) {
          this.jwtService.setToken(response.token);
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.jwtService.removeToken();
        throw error;
      }
    }
  }
}

@Component({
  selector: 'app-auth-example',
  template: `
    <div>
      <h2>Authentication Example</h2>
      
      <div *ngIf="!authManager.isAuthenticated()">
        <h3>Login</h3>
        <input [(ngModel)]="username" placeholder="Username" />
        <input [(ngModel)]="password" type="password" placeholder="Password" />
        <button (click)="login()">Login</button>
      </div>
      
      <div *ngIf="authManager.isAuthenticated()">
        <h3>Authenticated</h3>
        <p>User ID: {{ getCurrentUserInfo()?.userId }}</p>
        <p>Token expires: {{ getCurrentUserInfo()?.expirationDate | date }}</p>
        <button (click)="logout()">Logout</button>
        <button (click)="checkTokenStatus()">Check Token Status</button>
      </div>
    </div>
  `
})
export class AuthExampleComponent {
  username = '';
  password = '';

  constructor(public authManager: AuthenticationManager) {}

  async login() {
    try {
      await this.authManager.login({
        username: this.username,
        password: this.password
      });
    } catch (error) {
      alert('Login failed');
    }
  }

  async logout() {
    await this.authManager.logout();
  }

  getCurrentUserInfo() {
    return this.authManager.getCurrentUserInfo();
  }

  async checkTokenStatus() {
    try {
      await this.authManager.refreshTokenIfNeeded();
      alert('Token is valid and refreshed if needed');
    } catch (error) {
      alert('Token check failed: ' + error);
    }
  }
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    // JWT Interceptor will automatically handle token attachment
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  declarations: [AuthExampleComponent]
})
export class AuthExampleModule { }

/**
 * Usage Notes:
 * 
 * 1. The JwtInterceptor will automatically:
 *    - Add Authorization headers to HTTP requests
 *    - Handle 401 responses by refreshing tokens
 *    - Skip token attachment for auth routes
 * 
 * 2. The JwtService provides:
 *    - Automatic token storage and retrieval
 *    - Token validation and expiration checking
 *    - JWT payload decoding for user information
 * 
 * 3. Integration with AuthService:
 *    - Login responses are automatically stored as JWT tokens
 *    - Logout clears stored tokens
 *    - Token refresh is handled automatically by the interceptor
 * 
 * 4. Best Practices:
 *    - Always check authentication status before accessing protected resources
 *    - Use the reactive token$ observable to respond to authentication changes
 *    - Handle token refresh proactively to avoid 401 errors
 */