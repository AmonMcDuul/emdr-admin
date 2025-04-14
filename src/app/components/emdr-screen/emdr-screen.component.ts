import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmdrService } from '../../services/emdr.service';
import { SignalRService } from '../../services/signalr.service';
import { EmdrState } from '../../models/emdr-state.model';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './emdr-screen.component.html',
  styleUrls: ['./emdr-screen.component.scss']
})
export class EmdrScreenComponent implements OnDestroy {
  ballPosition: number = 0;
  speed: number = 5;
  soundEnabled: boolean = false;
  distractionEnabled: boolean = false;
  distractionDots: any[] = [];
  sessionId: string = "1"; 
  distractionMode: 'dots' | 'math' = 'dots';
  currentMathQuestion: string = '';

  constructor(
    private signalRService: SignalRService, 
    private emdrService: EmdrService
  ) {
    this.generateDistractionDots();
  }

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
    
    this.emdrService.onDistractionUpdate((data: any) => {
      if (data.type === 'math') {
        this.currentMathQuestion = data.question;
      }
    });
  }

  ngOnDestroy(): void {
    this.signalRService.disconnect();
  }

  setEmdrState(emdrState: EmdrState): void {
    this.signalRService.setEmdrState(this.sessionId, emdrState);
  }

  updateSpeed(): void {
    this.emdrService.setSpeed(this.speed);
  }

  sendSpeed(): void {
    this.signalRService.setSpeed(this.sessionId, this.speed);
  }

  enableSound(): void {
    this.emdrService.enableSound(this.soundEnabled);
    this.signalRService.toggleSound(this.sessionId, this.soundEnabled);
  }

  toggleDistraction(): void {
    this.distractionEnabled = !this.distractionEnabled;
    this.emdrService.enableDistraction(this.distractionEnabled, this.distractionMode);
    this.signalRService.toggleDistraction(this.sessionId, this.distractionEnabled);
  }

  changeDistractionMode(mode: 'dots' | 'math'): void {
    this.distractionMode = mode;
    if (this.distractionEnabled) {
      this.emdrService.enableDistraction(true, mode);
    }
  }

  private generateDistractionDots(): void {
    for (let i = 0; i < 20; i++) {
      this.distractionDots.push({
        'top.%': Math.random() * 100,
        'left.%': Math.random() * 100,
        'opacity': 0.2 + Math.random() * 0.8
      });
    }
  }
}