import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmdrService } from '../../services/emdr.service';
import { SignalRService } from '../../services/signalr.service';
import { EmdrState } from '../../models/emdr-state.model';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './emdr-screen.component.html',
  styleUrl: './emdr-screen.component.scss'
})
export class EmdrScreenComponent {
  ballPosition: number = 0;
  speed: number = 5;
  soundEnabled: boolean = false;

  constructor(private signalRService: SignalRService, private emdrService: EmdrService) {}

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
  }

  setEmdrState(emdrState: EmdrState): void {
    this.signalRService.setEmdrState("1", emdrState);
  }

  updateSpeed(): void {
    this.emdrService.setSpeed(this.speed);
  }

  sendSpeed(): void {
    this.signalRService.setSpeed("1", this.speed);
  }

  enableSound(): void {
    this.emdrService.enableSound(this.soundEnabled);
  }
}