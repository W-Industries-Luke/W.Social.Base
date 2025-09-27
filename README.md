# W.Social.Base

Angular core library for social media features with authentication and real-time messaging capabilities.

## Features

- **Authentication Service**: Secure authentication with JWT token support
- **Real-time Messaging**: SignalR-based messaging system for real-time communication
- **Configuration Management**: Centralized configuration service for API routes
- **Angular Material**: Pre-configured Material Design components
- **Jest Testing**: Unit testing setup with Jest testing framework

## Installation

```bash
npm install w-social-base
```

## Usage

### Importing the Module

```typescript
import { WSocialBaseModule } from 'w-social-base';

@NgModule({
  imports: [
    WSocialBaseModule,
    // ... other modules
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

- Angular 20+ (latest version)
- Angular Material
- Microsoft SignalR Client
- RxJS
- Zone.js

## License

MIT License - see LICENSE file for details.
