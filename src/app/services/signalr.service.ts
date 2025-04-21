import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Environment } from '../../environment/environment';
import { EmdrState } from '../models/emdr-state.model';
import { EmdrService } from './emdr.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: HubConnection;
  private hubUrl = Environment.baseUrl + '/sessionHub';
  private connectionPromise: Promise<void> | null = null;
  private isExplicitlyDisconnected = false;

  constructor(private emdrService: EmdrService) {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 2000 + 2000; // 2-4 seconds
          }
          return null; // Stop trying
        }
      })
      .build();

    this.registerListeners();
  }

  async connect(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.isExplicitlyDisconnected = false;

    try {
      this.connectionPromise = this.hubConnection.start();
      await this.connectionPromise;
      console.log('SignalR connected');
    } catch (err) {
      console.error('SignalR connection error:', err);
      throw err;
    } finally {
      this.connectionPromise = null;
    }
  }

  private registerListeners(): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('RecieveEmdrState', (state: EmdrState) => {
      switch(state){
        case 'start': {
          this.emdrService.start()
          break;
        }
        case 'pause': {
          this.emdrService.pause()
          break;
        }
        case 'stop': {
          this.emdrService.stop()
          break;
        }
        default: {
          break;
        }
      }
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

  async setEmdrState(sessionId: string, state: EmdrState) {
    await this.ensureConnected();
    this.hubConnection?.invoke('SetEmdrState', sessionId, state).catch((err) => {
      console.error(`Error setting emdr state ${sessionId}:`, err);
    });
  }

  async setSpeed(sessionId: string, speed: number) {
    await this.ensureConnected();
    this.hubConnection?.invoke('SetSpeed', sessionId, speed).catch((err) => {
      console.error(`Error setting speed ${sessionId}:`, err);
    });
  }

  async toggleSound(sessionId: string, enableSound: boolean) {
    await this.ensureConnected();
    this.hubConnection?.invoke('ToggleSound', sessionId, enableSound).catch((err) => {
      console.error(`Error toggling sound ${sessionId}:`, err);
    });
  }

  async toggleDistraction(sessionId: string, enableDistraction: boolean, distractionMode: string) {
    await this.ensureConnected();
    this.hubConnection?.invoke('ToggleDistraction', sessionId, enableDistraction, distractionMode).catch((err) => {
      console.error(`Error toggling Distraction ${sessionId}:`, err);
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