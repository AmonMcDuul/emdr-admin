import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private hubUrl = Environment.baseUrl + '/sessionHub';

  private connectionPromise: Promise<void> | null = null;

  constructor() {}

  connect(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return; 
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.connectionPromise = this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        this.connectionPromise = null; 
      })
      .catch((err) => {
        console.error('SignalR connection error:', err);
        this.connectionPromise = null; 
      });

    this.registerListeners();
  }

  private registerListeners(): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('ReceiveTest', (sessionId: string, a: number, b: number) => {
      console.log(a, b)
    });
  }
  
  async joinSession(sessionId: string) {
    await this.ensureConnected();
    this.hubConnection?.invoke('JoinSession', sessionId).catch((err) => {
      console.error(`Error joining session ${sessionId}:`, err);
    });
  }

  async leaveSession(sessionId: string) {
    await this.ensureConnected();
    this.hubConnection
    ?.invoke('LeaveSession', sessionId)
    .then(() => this.disconnect())
    .catch((err) => {
      console.error(`Error leaving Session ${sessionId}:`, err);
    });
  }

  private async ensureConnected(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return; 
    }

    if (this.connectionPromise) {
      await this.connectionPromise; 
    } else {
      throw new Error('SignalR connection is not established.');
    }
  }

  disconnect(): void {
    this.hubConnection?.stop().then(() => console.log('SignalR disconnected')).catch((err) => {
      console.error('SignalR disconnection error:', err);
    });
  }
}