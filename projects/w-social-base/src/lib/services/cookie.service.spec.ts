import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService]
    });
    service = TestBed.inject(CookieService);
    
    // Clear all cookies before each test
    service.clear();
  });

  afterEach(() => {
    // Clean up after each test
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem and getItem', () => {
    it('should set and get a cookie', () => {
      const key = 'testKey';
      const value = 'testValue';

      service.setItem(key, value);
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should return null for non-existent cookie', () => {
      const result = service.getItem('nonExistentKey');
      expect(result).toBeNull();
    });

    it('should handle special characters in key and value', () => {
      const key = 'test_key_with_special_chars';
      const value = 'test value with spaces and symbols';

      service.setItem(key, value);
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should set cookie with expiration date', () => {
      const key = 'expiringCookie';
      const value = 'expiringValue';
      const futureDate = new Date();
      futureDate.setTime(futureDate.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now

      service.setItem(key, value, { expires: futureDate });
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should set cookie with expiration in days', () => {
      const key = 'expiringCookieDays';
      const value = 'expiringValueDays';

      service.setItem(key, value, { expires: 1 }); // 1 day
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should set cookie with path option', () => {
      const key = 'pathCookie';
      const value = 'pathValue';

      service.setItem(key, value, { path: '/' });
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should set cookie with secure option', () => {
      const key = 'secureCookie';
      const value = 'secureValue';

      service.setItem(key, value, { secure: true });
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should set cookie with sameSite option', () => {
      const key = 'sameSiteCookie';
      const value = 'sameSiteValue';

      service.setItem(key, value, { sameSite: 'Lax' });
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });
  });

  describe('removeItem', () => {
    it('should remove an existing cookie', () => {
      const key = 'testKey';
      const value = 'testValue';

      service.setItem(key, value);
      expect(service.getItem(key)).toBe(value);

      service.removeItem(key);
      expect(service.getItem(key)).toBeNull();
    });

    it('should handle removing non-existent cookie gracefully', () => {
      expect(() => service.removeItem('nonExistentKey')).not.toThrow();
    });

    it('should remove cookie with specific path', () => {
      const key = 'pathCookie';
      const value = 'pathValue';

      service.setItem(key, value, { path: '/' });
      expect(service.getItem(key)).toBe(value);

      service.removeItem(key, { path: '/' });
      expect(service.getItem(key)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cookies', () => {
      service.setItem('key1', 'value1');
      service.setItem('key2', 'value2');
      service.setItem('key3', 'value3');

      expect(service.length()).toBe(3);

      service.clear();

      expect(service.length()).toBe(0);
      expect(service.getItem('key1')).toBeNull();
      expect(service.getItem('key2')).toBeNull();
      expect(service.getItem('key3')).toBeNull();
    });
  });

  describe('getAllKeys', () => {
    it('should return all cookie keys', () => {
      const keys = ['key1', 'key2', 'key3'];
      keys.forEach(key => service.setItem(key, `value_${key}`));

      const retrievedKeys = service.getAllKeys();

      expect(retrievedKeys.length).toBe(3);
      keys.forEach(key => {
        expect(retrievedKeys).toContain(key);
      });
    });

    it('should return empty array when no cookies exist', () => {
      const keys = service.getAllKeys();
      expect(keys).toEqual([]);
    });
  });

  describe('getAll', () => {
    it('should return all cookies as an object', () => {
      const testData = {
        'key1': 'value1',
        'key2': 'value2',
        'key3': 'value3'
      };

      Object.entries(testData).forEach(([key, value]) => {
        service.setItem(key, value);
      });

      const allCookies = service.getAll();

      expect(Object.keys(allCookies).length).toBe(3);
      Object.entries(testData).forEach(([key, value]) => {
        expect(allCookies[key]).toBe(value);
      });
    });

    it('should return empty object when no cookies exist', () => {
      const allCookies = service.getAll();
      expect(allCookies).toEqual({});
    });
  });

  describe('isAvailable', () => {
    it('should return true when cookies are available', () => {
      expect(service.isAvailable()).toBe(true);
    });
  });

  describe('length', () => {
    it('should return correct length', () => {
      expect(service.length()).toBe(0);

      service.setItem('key1', 'value1');
      expect(service.length()).toBe(1);

      service.setItem('key2', 'value2');
      expect(service.length()).toBe(2);

      service.removeItem('key1');
      expect(service.length()).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle cookie errors gracefully', () => {
      spyOn(console, 'error');

      // Mock document.cookie to throw error on access
      const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
      
      Object.defineProperty(document, 'cookie', {
        get: jasmine.createSpy().and.throwError('Cookie access error'),
        set: jasmine.createSpy().and.throwError('Cookie set error'),
        configurable: true
      });

      expect(() => service.setItem('key', 'value')).not.toThrow();
      expect(service.getItem('key')).toBeNull();
      expect(() => service.removeItem('key')).not.toThrow();

      // Restore original cookie descriptor
      if (originalCookieDescriptor) {
        Object.defineProperty(Document.prototype, 'cookie', originalCookieDescriptor);
      }
    });
  });
});