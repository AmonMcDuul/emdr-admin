import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Environment } from '../../environment/environment';
import { EmdrState } from '../models/emdr-state.model';
import { EmdrService } from './emdr.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private hubUrl = Environment.baseUrl + '/sessionHub';

  private connectionPromise: Promise<void> | null = null;

  constructor(private emdrService: EmdrService) {}

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

  async toggleDistraction(sessionId: string, enableDistraction: boolean) {
    await this.ensureConnected();
    this.hubConnection?.invoke('ToggleDistraction', sessionId, enableDistraction).catch((err) => {
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