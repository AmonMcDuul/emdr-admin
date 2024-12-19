import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmdrService {
  private ballPosition: number = 0; 
  private direction: number = 1; // 1 for right, -1 for left
  private containerWidth: number = 640;
  private ballSize: number = 30; 
  private speed: number = 5; 
  private intervalId: any; 

  private positionUpdateCallback: (position: number) => void = () => {};

  onPositionUpdate(callback: (position: number) => void): void {
    this.positionUpdateCallback = callback;
  }

  start(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.moveBall(), 20);
    }
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stop(): void {
    this.pause();
    this.ballPosition = 0;
    this.direction = 1;
    this.positionUpdateCallback(this.ballPosition);
  }

  setSpeed(newSpeed: number): void {
    this.speed = newSpeed;
  }

  private moveBall(): void {
    this.ballPosition += this.direction * this.speed;

    // Check for collisions with container edges
    if (this.ballPosition >= this.containerWidth - this.ballSize) {
      this.direction = -1; // Bounce left
    } else if (this.ballPosition <= 0) {
      this.direction = 1; // Bounce right
    }

    this.positionUpdateCallback(this.ballPosition);
  }
}
