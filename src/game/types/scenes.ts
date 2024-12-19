import { GameObjects } from "phaser";

export interface GameSceneObjects {
    scoreText: GameObjects.Text;
    problemText: GameObjects.Text;
    feedbackText: GameObjects.Text;
    buttons: GameObjects.Container;
    endGameButton: GameObjects.Text;
}

export interface GameState {
    score: number;
    ageGroup: number;
}

export interface ButtonConfig {
    x: number;
    y: number;
    width: number;
    value: string | number;
    onClick: (value: string | number) => void;
}
