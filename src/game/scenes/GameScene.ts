/**
 * Main gameplay scene where arithmetic problems are presented and solved.
 * Manages the game state, problem generation, scoring, and user feedback.
 */

import { Scene } from 'phaser';
import { generateProblem, generateChoices } from '../utils/mathUtils';
import { Problem } from '../types';
import { GameSceneObjects, GameState } from '../types/scenes';
import { AnswerButton } from '../components/AnswerButton';

export class GameScene extends Scene {
  // Current arithmetic problem being displayed
  private currentProblem?: Problem;
  // Collection of UI game objects for easy access
  private gameObjects?: GameSceneObjects;
  // Game state tracking (score, etc.)
  private state: GameState = {
    score: 0
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  /**
   * Called by Phaser when the scene starts.
   * Sets up the game UI and creates the first problem.
   */
  create(): void {
    this.initializeGameObjects();
    this.createNewProblem();
  }

  /**
   * Initializes all UI elements needed for the game.
   * Creates and positions score display, problem text, and feedback text.
   */
  private initializeGameObjects(): void {
    const buttonsContainer = this.add.container(0, 0);

    this.gameObjects = {
      // Score display in top-left corner
      scoreText: this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        color: '#1e40af',
        fontFamily: 'Arial'
      }),
      // Problem text centered horizontally, upper portion of screen
      problemText: this.add.text(400, 200, '', {
        fontSize: '48px',
        color: '#1e40af',
        fontFamily: 'Arial'
      }).setOrigin(0.5),
      // Feedback text below problem (correct/incorrect messages)
      feedbackText: this.add.text(400, 300, '', {
        fontSize: '32px',
        fontFamily: 'Arial'
      }).setOrigin(0.5),
      // Container for answer buttons
      buttons: buttonsContainer
    };
  }

  /**
   * Creates a new arithmetic problem and its multiple choice answers.
   * Updates the UI to display the new problem and answer choices.
   */
  private createNewProblem(): void {
    if (!this.gameObjects) return;

    // Generate new problem and answer choices
    this.currentProblem = generateProblem();
    const choices = generateChoices(this.currentProblem.answer);
    
    // Update problem text
    this.gameObjects.problemText.setText(
      `${this.currentProblem.num1} ${this.currentProblem.operation} ${this.currentProblem.num2} = ?`
    );
    // Clear feedback text
    this.gameObjects.feedbackText.setText('');
    
    // Create answer buttons
    this.createAnswerButtons(choices);
  }

  /**
   * Creates answer buttons for the current problem.
   * Positions buttons horizontally across the screen.
   */
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

  /**
   * Checks if the user's answer is correct.
   * Updates the game state and UI accordingly.
   */
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

  /**
   * Handles the case where the user answers correctly.
   * Increments the score and displays a success message.
   */
  private handleCorrectAnswer(): void {
    if (!this.gameObjects) return;

    this.state.score += 10;
    this.gameObjects.scoreText.setText(`Score: ${this.state.score}`);
    this.gameObjects.feedbackText
      .setText('Correct! 🌟')
      .setColor('#047857');
  }

  /**
   * Handles the case where the user answers incorrectly.
   * Displays an error message.
   */
  private handleIncorrectAnswer(): void {
    if (!this.gameObjects) return;

    this.gameObjects.feedbackText
      .setText('Try again! 💪')
      .setColor('#dc2626');
  }
}