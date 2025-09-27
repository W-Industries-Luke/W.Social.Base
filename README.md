# W.Social.Base

Angular standalone library for social media features with authentication and real-time messaging capabilities.

This is a **standalone library** - import only the services and components you need without any pre-configured modules.

## Features

- **Authentication Service**: Secure authentication with JWT token support
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
```

### Module Configuration

Configure your app module with the dependencies you need:

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, MsgService, ConfigService } from 'w-social-base';

@NgModule({
  imports: [
    HttpClientModule, // Required for AuthService
    // Add any Angular Material modules you need
    // Add any other dependencies
  ],
  providers: [
    AuthService,
    MsgService,
    ConfigService,
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
