import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem and getItem', () => {
    it('should set and get an item', () => {
      const key = 'testKey';
      const value = 'testValue';

      service.setItem(key, value);
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });

    it('should return null for non-existent key', () => {
      const result = service.getItem('nonExistentKey');
      expect(result).toBeNull();
    });

    it('should handle special characters in key and value', () => {
      const key = 'test@key#with$special%characters';
      const value = 'test value with special chars: !@#$%^&*()';

      service.setItem(key, value);
      const retrievedValue = service.getItem(key);

      expect(retrievedValue).toBe(value);
    });
  });

  describe('removeItem', () => {
    it('should remove an existing item', () => {
      const key = 'testKey';
      const value = 'testValue';

      service.setItem(key, value);
      expect(service.getItem(key)).toBe(value);

      service.removeItem(key);
      expect(service.getItem(key)).toBeNull();
    });

    it('should handle removing non-existent item gracefully', () => {
      expect(() => service.removeItem('nonExistentKey')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
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
    it('should return all keys', () => {
      const keys = ['key1', 'key2', 'key3'];
      keys.forEach(key => service.setItem(key, `value_${key}`));

      const retrievedKeys = service.getAllKeys();

      expect(retrievedKeys.length).toBe(3);
      keys.forEach(key => {
        expect(retrievedKeys).toContain(key);
      });
    });

    it('should return empty array when no items exist', () => {
      const keys = service.getAllKeys();
      expect(keys).toEqual([]);
    });
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
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
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw errors
      const originalSetItem = Storage.prototype.setItem;
      const originalGetItem = Storage.prototype.getItem;
      const originalRemoveItem = Storage.prototype.removeItem;

      spyOn(console, 'error');

      // Test setItem error
      Storage.prototype.setItem = jasmine.createSpy().and.throwError('Storage error');
      expect(() => service.setItem('key', 'value')).not.toThrow();
      expect(console.error).toHaveBeenCalled();

      // Test getItem error
      Storage.prototype.getItem = jasmine.createSpy().and.throwError('Storage error');
      expect(service.getItem('key')).toBeNull();

      // Test removeItem error
      Storage.prototype.removeItem = jasmine.createSpy().and.throwError('Storage error');
      expect(() => service.removeItem('key')).not.toThrow();

      // Restore original methods
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
      Storage.prototype.removeItem = originalRemoveItem;
    });
  });
});