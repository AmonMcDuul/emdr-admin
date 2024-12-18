import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './emdr-screen.component.html',
  styleUrl: './emdr-screen.component.scss'
})
export class EmdrScreenComponent {
  ballPosition: number = 0; 
  direction: number = 1; // 1 for right, -1 for left
  containerWidth: number = 640;
  ballSize: number = 30;
  speed: number = 5; 

  private intervalId: any;

  start(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.moveBall();
      }, 20);
    }
  }

  pause(): void {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  stop(): void {
    this.pause();
    this.ballPosition = 0;
    this.direction = 1;
  }

  private moveBall(): void {
    this.ballPosition += this.direction * this.speed;

    if (this.ballPosition >= this.containerWidth - this.ballSize) {
      this.direction = -1;
    } else if (this.ballPosition <= 0) {
      this.direction = 1;
    }
  }

  updateSpeed(): void {
    this.pause();
    this.start();
  }
}