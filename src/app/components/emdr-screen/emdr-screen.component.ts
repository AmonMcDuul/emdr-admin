import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmdrService } from '../../services/emdr.service';

@Component({
  selector: 'app-emdr-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './emdr-screen.component.html',
  styleUrl: './emdr-screen.component.scss'
})
export class EmdrScreenComponent {
  ballPosition: number = 0;
  speed: number = 5;

  constructor(private emdrService: EmdrService) {}

  ngOnInit(): void {
    this.emdrService.onPositionUpdate((position: number) => {
      this.ballPosition = position;
    });
  }

  start(): void {
    this.emdrService.start();
  }

  pause(): void {
    this.emdrService.pause();
  }

  stop(): void {
    this.emdrService.stop();
  }

  updateSpeed(): void {
    this.emdrService.setSpeed(this.speed);
  }
}