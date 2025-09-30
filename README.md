# W.Social.Base

Angular standalone library for social media features with authentication and real-time messaging capabilities.

This is a **standalone library** - import only the services and components you need without any pre-configured modules.

## Features

- **Authentication Service**: Secure authentication with JWT token support
- **Real-time Messaging**: SignalR-based messaging system for real-time communication
- **Social Feed Components**: Ready-to-use components for displaying posts and feeds
- **Configuration Management**: Centralized configuration service for API routes
- **Jest Testing**: Unit testing setup with Jest testing framework
- **Standalone Design**: No bundled modules - import individual services as needed

## Installation

```bash
npm install w-social-base
```

## Usage

### Importing Individual Services and Components

This library follows a standalone approach. Import only the services and components you need:

```typescript
import { AuthService, LoginRequest } from 'w-social-base';
import { MsgService, Message } from 'w-social-base';
import { ConfigService } from 'w-social-base';
import { PostComponent, FeedComponent, Post } from 'w-social-base';
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

## Available Components

### PostComponent (`wsb-post`)

A standalone component for displaying individual social media posts with like, repost, and comment functionality.

**Inputs:**
- `post: Post | null` - The post data to display

**Outputs:**
- `like: EventEmitter<string>` - Emitted when user likes a post (post ID)
- `repost: EventEmitter<string>` - Emitted when user reposts (post ID)
- `comment: EventEmitter<string>` - Emitted when user clicks comment (post ID)

**Usage:**
```typescript
import { PostComponent, Post } from 'w-social-base';

// In your component
post: Post = {
  id: '1',
  authorId: 'user123',
  authorName: 'John Doe',
  content: 'Hello world!',
  timestamp: new Date(),
  likes: 5,
  reposts: 2,
  comments: 3
};

handleLike(postId: string) {
  console.log('Liked post:', postId);
}
```

```html
<wsb-post
  [post]="post"
  (like)="handleLike($event)"
  (repost)="handleRepost($event)"
  (comment)="handleComment($event)">
</wsb-post>
```

### FeedComponent (`wsb-feed`)

A standalone component for displaying a list of posts with loading states and pagination support.

**Inputs:**
- `posts: Post[] | null` - Array of posts to display
- `loading: boolean` - Shows loading spinner when true
- `loadingMore: boolean` - Shows loading state for pagination
- `hasMore: boolean` - Shows "Load More" button when true
- `title?: string` - Optional feed title
- `subtitle?: string` - Optional feed subtitle
- `emptyMessage?: string` - Custom message for empty state

**Outputs:**
- `postLike: EventEmitter<string>` - Emitted when user likes any post
- `postRepost: EventEmitter<string>` - Emitted when user reposts any post
- `postComment: EventEmitter<string>` - Emitted when user clicks comment on any post
- `loadMore: EventEmitter<void>` - Emitted when user clicks "Load More"

**Usage:**
```typescript
import { FeedComponent, Post } from 'w-social-base';

// In your component
posts: Post[] = [/* your posts array */];
loading = false;
hasMore = true;

handlePostInteraction(postId: string) {
  console.log('Post interaction:', postId);
}

loadMorePosts() {
  // Load more posts logic
}
```

```html
<wsb-feed
  [posts]="posts"
  [loading]="loading"
  [hasMore]="hasMore"
  [title]="'My Social Feed'"
  [subtitle]="'Latest updates'"
  (postLike)="handlePostInteraction($event)"
  (postRepost)="handlePostInteraction($event)"
  (postComment)="handlePostInteraction($event)"
  (loadMore)="loadMorePosts()">
</wsb-feed>
```

### Post Interface

```typescript
interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePic?: string;
  content: string;
  timestamp: Date;
  likes: number;
  reposts: number;
  comments: number;
  isLiked?: boolean;
  isReposted?: boolean;
  type?: 'text' | 'image' | 'video';
  mediaUrl?: string;
}
```

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
