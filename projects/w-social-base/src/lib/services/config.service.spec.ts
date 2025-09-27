import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return heartland auth route', () => {
    const route = service.getHeartlandAuthRoute();
    expect(route).toBe('https://www.heartlandauth.com');
  });

  it('should return specific API route', () => {
    const route = service.getApiRoute('heartlandAuth');
    expect(route).toBe('https://www.heartlandauth.com');
  });

  it('should return empty string for non-existent route', () => {
    const route = service.getApiRoute('nonExistentRoute');
    expect(route).toBe('');
  });

  it('should return all API routes', () => {
    const routes = service.getAllApiRoutes();
    expect(routes).toEqual({
      heartlandAuth: 'https://www.heartlandauth.com'
    });
  });
});