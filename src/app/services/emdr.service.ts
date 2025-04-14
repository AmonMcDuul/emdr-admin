import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class EmdrService {
  // Ball movement properties
  private ballPosition: number = 0;
  private direction: number = 1;
  private containerWidth: number = 800;
  private ballSize: number = 30;
  private speed: number = 5;
  
  // Animation control
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = 0;
  
  // Audio properties
  private soundEnabled: boolean = false;
  private positionUpdateCallback: (position: number) => void = () => {};
  
  // Distraction properties
  private distractionEnabled: boolean = false;
  private distractionMode: 'dots' | 'math' = 'dots';
  private distractionUpdateCallback: (data: any) => void = () => {};
  private mathQuestionInterval: any = null;
  private currentMathQuestion: string = '';
  private currentMathAnswer: number = 0;

  // Audio synth
  private synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.1,
      release: 0.05,
    },
    volume: -8
  }).toDestination();

  constructor() {
    Tone.start();
  }

  // Position updates
  onPositionUpdate(callback: (position: number) => void): void {
    this.positionUpdateCallback = callback;
  }

  // Distraction updates
  onDistractionUpdate(callback: (data: any) => void): void {
    this.distractionUpdateCallback = callback;
  }

  // Sound control
  enableSound(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  // Distraction control
  enableDistraction(enabled: boolean, mode: 'dots' | 'math' = 'dots'): void {
    this.distractionEnabled = enabled;
    this.distractionMode = mode;
    
    if (enabled) {
      if (mode === 'math') {
        this.startMathQuestions();
      }
    } else {
      if (mode === 'math') {
        this.stopMathQuestions();
      }
      this.distractionUpdateCallback({ type: 'clear' });
    }
  }

  // Animation control
  start(): void {
    if (this.animationFrameId === null) {
      this.lastUpdateTime = performance.now();
      this.animate();
    }
  }

  pause(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop(): void {
    this.pause();
    this.ballPosition = 0;
    this.direction = 1;
    this.positionUpdateCallback(this.ballPosition);
  }

  setSpeed(newSpeed: number): void {
    this.speed = Math.max(1, Math.min(20, newSpeed));
  }

  setContainerWidth(width: number): void {
    this.containerWidth = width;
  }

  // Math questions distraction
  private startMathQuestions(): void {
    this.generateMathQuestion();
    this.mathQuestionInterval = setInterval(() => {
      this.generateMathQuestion();
    }, 5000); // New question every 5 seconds
  }

  private stopMathQuestions(): void {
    if (this.mathQuestionInterval) {
      clearInterval(this.mathQuestionInterval);
      this.mathQuestionInterval = null;
    }
  }

  private generateMathQuestion(): void {
    const operations = ['+', '-', '*'];
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = operations[Math.floor(Math.random() * operations.length)];

    switch(op) {
      case '+':
        this.currentMathAnswer = a + b;
        break;
      case '-':
        this.currentMathAnswer = a - b;
        break;
      case '*':
        this.currentMathAnswer = a * b;
        break;
    }

    this.currentMathQuestion = `${a} ${op} ${b} = ?`;
    this.distractionUpdateCallback({
      type: 'math',
      question: this.currentMathQuestion,
      answer: this.currentMathAnswer
    });
  }

  // Main animation loop
  private animate(): void {
    const now = performance.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;
    this.ballPosition += this.direction * this.speed * (deltaTime / 16);

    // Boundary checking
    if (this.ballPosition >= this.containerWidth - this.ballSize) {
      this.playBounceSound();
      this.direction = -1;
      this.ballPosition = this.containerWidth - this.ballSize;
    } else if (this.ballPosition <= 0) {
      this.playBounceSound();
      this.direction = 1;
      this.ballPosition = 0;
    }

    this.positionUpdateCallback(this.ballPosition);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private playBounceSound(): void {
    if (this.soundEnabled) {
      try {
        const note = this.direction > 0 ? 'C5' : 'G4';
        this.synth.triggerAttackRelease(note, 0.05);
      } catch (e) {
        console.warn('Audio playback error:', e);
      }
    }
  }

  cleanup(): void {
    this.pause();
    this.stopMathQuestions();
    this.synth.dispose();
  }
}