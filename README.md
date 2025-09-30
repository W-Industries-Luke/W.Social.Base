# W.Social.Base

Angular standalone library for social media features with authentication and real-time messaging capabilities.

This is a **standalone library** - import only the services and components you need without any pre-configured modules.

## Features

- **Authentication Service**: Secure authentication with JWT token support
- **JWT Management**: Comprehensive JWT token handling with automatic refresh and validation
- **HTTP Interceptor**: Automatic JWT token attachment and 401 error handling
- **Storage Services**: LocalStorage, SessionStorage, and Cookie management with error handling
- **Real-time Messaging**: SignalR-based messaging system for real-time communication
- **Configuration Management**: Centralized configuration service for API routes
- **Jest Testing**: Unit testing setup with Jest testing framework
- **Standalone Design**: No bundled modules - import individual services as needed

## Installation

```bash
npm install w-social-base
```

## Usage

### Importing Individual Services

This library follows a standalone approach. Import only the services you need:

```typescript
import { AuthService, LoginRequest } from 'w-social-base';
import { MsgService, Message } from 'w-social-base';
import { ConfigService } from 'w-social-base';
import { JwtService, JwtInterceptor } from 'w-social-base';
import { LocalStorageService, SessionStorageService, CookieService } from 'w-social-base';
```

### Module Configuration

Configure your app module with the dependencies you need:

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { 
  AuthService, 
  MsgService, 
  ConfigService, 
  JwtService, 
  JwtInterceptor,
  LocalStorageService,
  SessionStorageService,
  CookieService
} from 'w-social-base';

@NgModule({
  imports: [
    HttpClientModule, // Required for AuthService and JwtInterceptor
    // Add any Angular Material modules you need
    // Add any other dependencies
  ],
  providers: [
    AuthService,
    MsgService,
    ConfigService,
    JwtService,
    LocalStorageService,
    SessionStorageService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    // Configure other providers as needed
  ],
  // ...
})
export class AppModule { }
```

### Authentication Service

```typescript
import { AuthService, LoginRequest } from 'w-social-base';

constructor(private authService: AuthService) {}

login() {
  const credentials: LoginRequest = {
    username: 'user@example.com',
    password: 'password'
  };
  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      console.log('Login successful:', response);
    },
    error: (error) => {
      console.error('Login failed:', error);
    }
  });
}
```

### JWT Service

The JWT service provides comprehensive JSON Web Token management including storage, validation, and decoding.

```typescript
import { JwtService } from 'w-social-base';

constructor(private jwtService: JwtService) {
  // Subscribe to token changes
  this.jwtService.token$.subscribe(token => {
    console.log('Token changed:', token);
  });
}

// Store JWT token
storeToken(token: string) {
  this.jwtService.setToken(token);
}

// Check if user is authenticated
checkAuth() {
  if (this.jwtService.isAuthenticated()) {
    console.log('User is authenticated');
    console.log('User ID:', this.jwtService.getUserId());
    console.log('Token expires:', this.jwtService.getTokenExpirationDate());
  } else {
    console.log('User is not authenticated');
  }
}

// Handle logout
logout() {
  this.jwtService.removeToken();
}
```

### JWT Interceptor

The JWT interceptor automatically attaches JWT tokens to HTTP requests and handles token refresh on 401 errors.

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'w-social-base';

// Add to your module providers
{
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
}
```

The interceptor will:
- Automatically add `Authorization: Bearer <token>` header to requests
- Skip authentication for login, register, and refresh routes
- Automatically attempt token refresh on 401 responses
- Remove invalid tokens and retry requests with new tokens

### Message Service (SignalR)

```typescript
import { MsgService, Message } from 'w-social-base';

constructor(private msgService: MsgService) {
  // Subscribe to incoming messages
  this.msgService.message$.subscribe((message: Message) => {
    console.log('New message:', message);
  });
  
  // Subscribe to connection status
  this.msgService.connectionStatus$.subscribe((status) => {
    console.log('Connection status:', status);
  });
}

async connectToChat() {
  try {
    await this.msgService.startConnection('your-jwt-token');
    console.log('Connected to chat');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

async sendMessage() {
  const message = {
    userId: 'user123',
    userName: 'John Doe',
    content: 'Hello everyone!',
    type: 'text' as const
  };
  
  try {
    await this.msgService.sendMessage(message);
    console.log('Message sent');
  } catch (error) {
    console.error('Send failed:', error);
  }
}
```

### Configuration Service

```typescript
import { ConfigService } from 'w-social-base';

constructor(private configService: ConfigService) {}

getApiUrl() {
  const heartlandAuthUrl = this.configService.getHeartlandAuthRoute();
  console.log('Heartland Auth URL:', heartlandAuthUrl); // https://www.heartlandauth.com
}
```

### Storage Services

The library provides three storage services for different data persistence needs:

#### LocalStorageService

```typescript
import { LocalStorageService } from 'w-social-base';

constructor(private localStorage: LocalStorageService) {}

// Store and retrieve data
storeUserPreferences() {
  this.localStorage.setItem('theme', 'dark');
  this.localStorage.setItem('language', 'en');
  
  // Retrieve data
  const theme = this.localStorage.getItem('theme');
  const language = this.localStorage.getItem('language');
  
  console.log('Theme:', theme, 'Language:', language);
}

// Check availability and manage storage
manageStorage() {
  if (this.localStorage.isAvailable()) {
    console.log('localStorage is available');
    console.log('Items count:', this.localStorage.length());
    console.log('All keys:', this.localStorage.getAllKeys());
  }
}
```

#### SessionStorageService

```typescript
import { SessionStorageService } from 'w-social-base';

constructor(private sessionStorage: SessionStorageService) {}

// Store temporary session data
storeSessionData() {
  this.sessionStorage.setItem('currentTab', 'dashboard');
  this.sessionStorage.setItem('tempData', JSON.stringify({ key: 'value' }));
  
  // Data persists only for the session
  const currentTab = this.sessionStorage.getItem('currentTab');
  console.log('Current tab:', currentTab);
}
```

#### CookieService

```typescript
import { CookieService, CookieOptions } from 'w-social-base';

constructor(private cookieService: CookieService) {}

// Set cookies with various options
setCookies() {
  // Simple cookie
  this.cookieService.setItem('username', 'john_doe');
  
  // Cookie with expiration (7 days)
  this.cookieService.setItem('remember_me', 'true', { expires: 7 });
  
  // Secure cookie with path and sameSite
  const options: CookieOptions = {
    expires: 30,
    path: '/',
    secure: true,
    sameSite: 'Strict'
  };
  this.cookieService.setItem('auth_preference', 'secure', options);
}

// Retrieve and manage cookies
manageCookies() {
  // Get single cookie
  const username = this.cookieService.getItem('username');
  
  // Get all cookies
  const allCookies = this.cookieService.getAll();
  console.log('All cookies:', allCookies);
  
  // Remove specific cookie
  this.cookieService.removeItem('username');
  
  // Clear all cookies
  this.cookieService.clear();
}
```

## Configuration

The library includes a default configuration with the Heartland Auth API route:

```typescript
{
  apiRoutes: {
    heartlandAuth: 'https://www.heartlandauth.com'
  }
}
```

## Available Services

### AuthService
- `login(credentials)` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user information
- `refreshToken()` - Refresh authentication token
- `validateToken(token)` - Validate JWT token

### MsgService (SignalR)
- `startConnection(accessToken?)` - Start SignalR connection
- `stopConnection()` - Stop SignalR connection
- `sendMessage(message)` - Send a message
- `joinGroup(groupName)` - Join a chat group
- `leaveGroup(groupName)` - Leave a chat group
- Observable streams: `message$`, `connectionStatus$`, `userConnected$`, `userDisconnected$`

### ConfigService
- `getApiRoute(routeName)` - Get specific API route
- `getHeartlandAuthRoute()` - Get Heartland Auth route
- `getAllApiRoutes()` - Get all configured API routes

### JwtService
- `setToken(token)` - Store JWT token in localStorage
- `getToken()` - Retrieve JWT token from storage
- `removeToken()` - Remove JWT token from storage
- `decodeToken(token?)` - Decode JWT token payload
- `isTokenValid(token?)` - Check if token exists and is not expired
- `isTokenExpired(token?)` - Check if token is expired
- `getTokenExpirationDate(token?)` - Get token expiration date
- `getUserId(token?)` - Get user ID from token
- `isAuthenticated()` - Check if user has valid token
- Observable stream: `token$` - Emits token changes

### JwtInterceptor
- Automatically adds Authorization header to HTTP requests
- Handles token refresh on 401 unauthorized responses
- Excludes login, register, and refresh routes from token attachment
- Integrates with AuthService for token refresh functionality

### LocalStorageService
- `setItem(key, value)` - Store item in localStorage
- `getItem(key)` - Retrieve item from localStorage
- `removeItem(key)` - Remove item from localStorage
- `clear()` - Clear all localStorage items
- `getAllKeys()` - Get all localStorage keys
- `isAvailable()` - Check if localStorage is supported
- `length()` - Get number of stored items

### SessionStorageService
- `setItem(key, value)` - Store item in sessionStorage
- `getItem(key)` - Retrieve item from sessionStorage
- `removeItem(key)` - Remove item from sessionStorage
- `clear()` - Clear all sessionStorage items
- `getAllKeys()` - Get all sessionStorage keys
- `isAvailable()` - Check if sessionStorage is supported
- `length()` - Get number of stored items

### CookieService
- `setItem(key, value, options?)` - Set cookie with optional configuration
- `getItem(key)` - Get cookie value
- `removeItem(key, options?)` - Remove cookie
- `clear(options?)` - Clear all cookies
- `getAllKeys()` - Get all cookie names
- `getAll()` - Get all cookies as object
- `isAvailable()` - Check if cookies are supported
- `length()` - Get number of cookies
- Cookie options: expires, path, domain, secure, sameSite

## Development

### Building the Library

```bash
ng build w-social-base
```

### Running Tests

```bash
npm test
```

### Running Tests with Coverage

```bash
npm run test:coverage
```

## Dependencies

### Required
- Angular 20+ (latest version)
- RxJS
- Zone.js

### Optional (based on services used)
- `@angular/common/http` - Required if using AuthService
- `@microsoft/signalr` - Required if using MsgService
- Angular Material modules - Add individually as needed for your UI

### Development
- Jest (for testing)

## License

MIT License - see LICENSE file for details.
