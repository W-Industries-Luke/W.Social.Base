import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface ConnectionStatus {
  isConnected: boolean;
  connectionId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  private hubConnection: HubConnection | null = null;
  private readonly baseUrl: string;
  
  // Subjects for real-time events
  private messageSubject = new Subject<Message>();
  private connectionStatusSubject = new BehaviorSubject<ConnectionStatus>({ isConnected: false });
  private userConnectedSubject = new Subject<string>();
  private userDisconnectedSubject = new Subject<string>();

  // Public observables
  public message$ = this.messageSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  public userConnected$ = this.userConnectedSubject.asObservable();
  public userDisconnected$ = this.userDisconnectedSubject.asObservable();

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.getHeartlandAuthRoute();
  }

  /**
   * Initialize and start SignalR connection
   */
  async startConnection(accessToken?: string): Promise<void> {
    try {
      const builder = new HubConnectionBuilder()
        .withUrl(`${this.baseUrl}/chatHub`, {
          accessTokenFactory: () => accessToken || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information);

      this.hubConnection = builder.build();

      // Set up event listeners
      this.setupEventListeners();

      await this.hubConnection.start();
      
      this.connectionStatusSubject.next({
        isConnected: true,
        connectionId: this.hubConnection.connectionId || undefined
      });

      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      this.connectionStatusSubject.next({
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      });
      throw error;
    }
  }

  /**
   * Stop SignalR connection
   */
  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.connectionStatusSubject.next({ isConnected: false });
        console.log('SignalR Disconnected');
      } catch (error) {
        console.error('SignalR Stop Error:', error);
        throw error;
      }
    }
  }

  /**
   * Send a message through SignalR
   */
  async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      try {
        await this.hubConnection.invoke('SendMessage', message);
      } catch (error) {
        console.error('Send Message Error:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  /**
   * Join a chat group/room
   */
  async joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      try {
        await this.hubConnection.invoke('JoinGroup', groupName);
      } catch (error) {
        console.error('Join Group Error:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  /**
   * Leave a chat group/room
   */
  async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      try {
        await this.hubConnection.invoke('LeaveGroup', groupName);
      } catch (error) {
        console.error('Leave Group Error:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatusSubject.value;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.hubConnection?.state === 'Connected' || false;
  }

  /**
   * Set up SignalR event listeners
   */
  private setupEventListeners(): void {
    if (!this.hubConnection) return;

    // Listen for incoming messages
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageSubject.next({
        ...message,
        timestamp: new Date(message.timestamp)
      });
    });

    // Listen for user connection events
    this.hubConnection.on('UserConnected', (userId: string) => {
      this.userConnectedSubject.next(userId);
    });

    // Listen for user disconnection events
    this.hubConnection.on('UserDisconnected', (userId: string) => {
      this.userDisconnectedSubject.next(userId);
    });

    // Handle connection state changes
    this.hubConnection.onreconnecting((error) => {
      console.log('SignalR Reconnecting...', error);
      this.connectionStatusSubject.next({
        isConnected: false,
        error: error ? error.message : 'Reconnecting...'
      });
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected', connectionId);
      this.connectionStatusSubject.next({
        isConnected: true,
        connectionId: connectionId
      });
    });

    this.hubConnection.onclose((error) => {
      console.log('SignalR Connection Closed', error);
      this.connectionStatusSubject.next({
        isConnected: false,
        error: error ? error.message : 'Connection closed'
      });
    });
  }
}