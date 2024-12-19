import { GameObjects } from 'phaser';

export interface GameSceneObjects {
  scoreText: GameObjects.Text;
  problemText: GameObjects.Text;
  feedbackText: GameObjects.Text;
  buttons: GameObjects.Container;
}

export interface GameState {
  score: number;
}

export interface ButtonConfig {
  x: number;
  y: number;
  width: number;
  value: number;
  onClick: (value: number) => void;
}