import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface JwtTokenPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_KEY = 'jwt_token';
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  
  public token$ = this.tokenSubject.asObservable();

  constructor() {}

  /**
   * Store JWT token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  /**
   * Get JWT token from storage
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Remove JWT token from storage
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
  }

  /**
   * Decode JWT token payload without verification
   */
  decodeToken(token?: string): JwtTokenPayload | null {
    const tokenToUse = token || this.getToken();
    if (!tokenToUse) {
      return null;
    }

    try {
      const parts = tokenToUse.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token exists and is not expired
   */
  isTokenValid(token?: string): boolean {
    const tokenToUse = token || this.getToken();
    if (!tokenToUse) {
      return false;
    }

    const payload = this.decodeToken(tokenToUse);
    if (!payload || !payload.exp) {
      return false;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token?: string): boolean {
    return !this.isTokenValid(token);
  }

  /**
   * Get token expiration date
   */
  getTokenExpirationDate(token?: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  /**
   * Get user ID from token
   */
  getUserId(token?: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}