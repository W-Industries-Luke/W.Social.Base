import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // Routes that should not have JWT token attached
  private readonly excludedRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh'
  ];

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for excluded routes
    if (this.shouldSkipToken(request.url)) {
      return next.handle(request);
    }

    // Add JWT token to request if available
    const token = this.jwtService.getToken();
    if (token && this.jwtService.isTokenValid(token)) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 unauthorized errors
        if (error.status === 401 && token) {
          return this.handle401Error(request, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Add JWT token to request headers
   */
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Check if token should be skipped for this request
   */
  private shouldSkipToken(url: string): boolean {
    return this.excludedRoutes.some(route => url.includes(route));
  }

  /**
   * Handle 401 unauthorized error by attempting to refresh token
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokenResponse: { token: string }) => {
          this.isRefreshing = false;
          this.jwtService.setToken(tokenResponse.token);
          this.refreshTokenSubject.next(tokenResponse.token);
          
          // Retry the original request with new token
          return next.handle(this.addTokenToRequest(request, tokenResponse.token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.jwtService.removeToken();
          return throwError(() => error);
        })
      );
    }

    // If refresh is in progress, wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addTokenToRequest(request, token));
      })
    );
  }
}