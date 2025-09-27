import { TestBed } from '@angular/core/testing';
import { MsgService, Message, ConnectionStatus } from './msg.service';
import { ConfigService } from './config.service';

// Mock SignalR
jest.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: jest.fn().mockImplementation(() => ({
    withUrl: jest.fn().mockReturnThis(),
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    configureLogging: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      invoke: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      onreconnecting: jest.fn(),
      onreconnected: jest.fn(),
      onclose: jest.fn(),
      state: 'Connected',
      connectionId: 'test-connection-id'
    })
  })),
  LogLevel: {
    Information: 'Information'
  }
}));

describe('MsgService', () => {
  let service: MsgService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgService, ConfigService]
    });
    service = TestBed.inject(MsgService);
    configService = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial connection status as disconnected', () => {
    const status = service.getConnectionStatus();
    expect(status.isConnected).toBe(false);
  });

  it('should return false for isConnected initially', () => {
    expect(service.isConnected()).toBe(false);
  });

  it('should have observable streams', () => {
    expect(service.message$).toBeDefined();
    expect(service.connectionStatus$).toBeDefined();
    expect(service.userConnected$).toBeDefined();
    expect(service.userDisconnected$).toBeDefined();
  });

  it('should start connection successfully', async () => {
    const connectionPromise = service.startConnection('test-token');
    await expect(connectionPromise).resolves.not.toThrow();
  });

  it('should throw error when sending message without connection', async () => {
    const message: Omit<Message, 'id' | 'timestamp'> = {
      userId: 'user1',
      userName: 'Test User',
      content: 'Test message',
      type: 'text'
    };

    await expect(service.sendMessage(message)).rejects.toThrow('SignalR connection is not established');
  });

  it('should throw error when joining group without connection', async () => {
    await expect(service.joinGroup('test-group')).rejects.toThrow('SignalR connection is not established');
  });

  it('should throw error when leaving group without connection', async () => {
    await expect(service.leaveGroup('test-group')).rejects.toThrow('SignalR connection is not established');
  });
});