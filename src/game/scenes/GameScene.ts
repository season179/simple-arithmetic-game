import { Scene } from 'phaser';
import { generateProblem, generateChoices } from '../utils/mathUtils';
import { Problem } from '../types';
import { GameSceneObjects, GameState } from '../types/scenes';
import { AnswerButton } from '../components/AnswerButton';

export class GameScene extends Scene {
  private currentProblem?: Problem;
  private gameObjects?: GameSceneObjects;
  private state: GameState = {
    score: 0
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.initializeGameObjects();
    this.createNewProblem();
  }

  private initializeGameObjects(): void {
    const buttonsContainer = this.add.container(0, 0);

    this.gameObjects = {
      scoreText: this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        color: '#1e40af',
        fontFamily: 'Arial'
      }),
      problemText: this.add.text(400, 200, '', {
        fontSize: '48px',
        color: '#1e40af',
        fontFamily: 'Arial'
      }).setOrigin(0.5),
      feedbackText: this.add.text(400, 300, '', {
        fontSize: '32px',
        fontFamily: 'Arial'
      }).setOrigin(0.5),
      buttons: buttonsContainer
    };
  }

  private createNewProblem(): void {
    if (!this.gameObjects) return;

    this.currentProblem = generateProblem();
    const choices = generateChoices(this.currentProblem.answer);
    
    this.gameObjects.problemText.setText(
      `${this.currentProblem.num1} ${this.currentProblem.operation} ${this.currentProblem.num2} = ?`
    );
    this.gameObjects.feedbackText.setText('');
    
    this.createAnswerButtons(choices);
  }

  private createAnswerButtons(choices: number[]): void {
    if (!this.gameObjects) return;

    // Clear existing buttons
    this.gameObjects.buttons.removeAll(true);

    const buttonWidth = 100;
    const spacing = 120;
    const startX = 400 - ((choices.length - 1) * spacing) / 2;
    const y = 400;

    choices.forEach((choice, index) => {
      const x = startX + index * spacing;
      
      new AnswerButton(this, {
        x,
        y,
        width: buttonWidth,
        value: choice,
        onClick: (value) => this.checkAnswer(value)
      });
    });
  }

  private checkAnswer(choice: number): void {
    if (!this.currentProblem || !this.gameObjects) return;

    if (choice === this.currentProblem.answer) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }

    // Create new problem after a delay
    this.time.delayedCall(1500, () => {
      this.createNewProblem();
    });
  }

  private handleCorrectAnswer(): void {
    if (!this.gameObjects) return;

    this.state.score += 10;
    this.gameObjects.scoreText.setText(`Score: ${this.state.score}`);
    this.gameObjects.feedbackText
      .setText('Correct! 🌟')
      .setColor('#047857');
  }

  private handleIncorrectAnswer(): void {
    if (!this.gameObjects) return;

    this.gameObjects.feedbackText
      .setText('Try again! 💪')
      .setColor('#dc2626');
  }
}