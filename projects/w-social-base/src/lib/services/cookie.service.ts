import { Injectable } from '@angular/core';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor() {}

  /**
   * Set a cookie
   */
  setItem(key: string, value: string, options?: CookieOptions): void {
    try {
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

      if (options) {
        if (options.expires) {
          if (typeof options.expires === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            cookieString += `; expires=${date.toUTCString()}`;
          } else {
            cookieString += `; expires=${options.expires.toUTCString()}`;
          }
        }

        if (options.path) {
          cookieString += `; path=${options.path}`;
        }

        if (options.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
          cookieString += `; secure`;
        }

        if (options.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }

        // Note: httpOnly cannot be set via JavaScript for security reasons
        // It can only be set by the server
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  /**
   * Get a cookie value
   */
  getItem(key: string): string | null {
    try {
      const name = encodeURIComponent(key) + '=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');

      for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
          return decodeURIComponent(cookie.substring(name.length));
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  /**
   * Remove a cookie
   */
  removeItem(key: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void {
    try {
      const removeOptions: CookieOptions = {
        expires: new Date(0),
        ...options
      };
      this.setItem(key, '', removeOptions);
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }

  /**
   * Clear all cookies (removes all cookies for the current domain and path)
   */
  clear(options?: Pick<CookieOptions, 'path' | 'domain'>): void {
    try {
      const cookies = this.getAllKeys();
      cookies.forEach(key => {
        this.removeItem(key, options);
      });
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }

  /**
   * Get all cookie keys
   */
  getAllKeys(): string[] {
    try {
      const decodedCookie = decodeURIComponent(document.cookie);
      if (!decodedCookie) {
        return [];
      }

      return decodedCookie.split(';')
        .map(cookie => cookie.trim())
        .filter(cookie => cookie.length > 0)
        .map(cookie => {
          const equalIndex = cookie.indexOf('=');
          return equalIndex > 0 ? decodeURIComponent(cookie.substring(0, equalIndex)) : '';
        })
        .filter(key => key.length > 0);
    } catch (error) {
      console.error('Error getting cookie keys:', error);
      return [];
    }
  }

  /**
   * Check if cookies are available
   */
  isAvailable(): boolean {
    try {
      const test = '__cookie_test__';
      this.setItem(test, 'test');
      const result = this.getItem(test) === 'test';
      this.removeItem(test);
      return result;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the number of cookies
   */
  length(): number {
    try {
      return this.getAllKeys().length;
    } catch (error) {
      console.error('Error getting cookie count:', error);
      return 0;
    }
  }

  /**
   * Get all cookies as an object
   */
  getAll(): { [key: string]: string } {
    try {
      const cookies: { [key: string]: string } = {};
      const keys = this.getAllKeys();
      
      keys.forEach(key => {
        const value = this.getItem(key);
        if (value !== null) {
          cookies[key] = value;
        }
      });
      
      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }
}