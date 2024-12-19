import { Scene } from "phaser";
import { generateProblem, generateChoices } from "../utils/mathUtils";
import {
    generateSequenceProblem,
    generateSequenceChoices,
} from "../utils/sequenceUtils";
import { Problem, SequenceProblem } from "../types";
import { GameSceneObjects, GameState } from "../types/scenes";
import { AnswerButton } from "../components/AnswerButton";

export class GameScene extends Scene {
    private currentProblem?: Problem | SequenceProblem;
    private gameObjects?: GameSceneObjects;
    private state: GameState = {
        score: 0,
        ageGroup: 5,
    };

    constructor() {
        super({ key: "GameScene" });
    }

    create(data: { ageGroup: number }): void {
        // Reset score and set age group when starting a new game
        this.state = {
            score: 0,
            ageGroup: data.ageGroup || 5,
        };

        this.createGameObjects();
        this.createNewProblem();
    }

    private createGameObjects(): void {
        const { width, height } = this.scale;
        const buttonsContainer = this.add.container(0, 0);

        // End Game button with background
        const endGameButton = this.add
            .text(width - 16, 16, "End Game", {
                fontSize: "24px",
                color: "#dc2626",
                backgroundColor: "#fee2e2",
                padding: { x: 12, y: 8 },
                fontFamily: "Arial",
            })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.endGame());

        this.gameObjects = {
            scoreText: this.add.text(16, 16, "Score: 0", {
                fontSize: "32px",
                color: "#1e40af",
                fontFamily: "Arial",
            }),
            problemText: this.add
                .text(width * 0.5, height * 0.3, "", {
                    fontSize: "48px",
                    color: "#1e40af",
                    fontFamily: "Arial",
                })
                .setOrigin(0.5),
            feedbackText: this.add
                .text(width * 0.5, height * 0.45, "", {
                    fontSize: "32px",
                    fontFamily: "Arial",
                })
                .setOrigin(0.5),
            buttons: buttonsContainer,
            endGameButton,
        };
    }

    private createNewProblem(): void {
        if (!this.gameObjects) return;

        // For 5-year-olds, 40% chance of sequence problems
        if (this.state.ageGroup === 5 && Math.random() < 0.4) {
            const sequenceProblem = generateSequenceProblem();
            this.currentProblem = sequenceProblem;

            // Display the sequence problem
            const sequenceText = sequenceProblem.sequence.join(" ");
            const directionArrow =
                sequenceProblem.direction === "ascending" ? "→" : "←";

            this.gameObjects.problemText.setText(
                `Complete the sequence ${directionArrow}\n${sequenceText}`
            );

            // Generate and display choices for the sequence
            const choices = generateSequenceChoices(
                sequenceProblem.answer,
                sequenceProblem.format
            );
            this.createAnswerButtons(choices);
        } else {
            // Create math problem
            const mathProblem = generateProblem(this.state.ageGroup);
            this.currentProblem = mathProblem;

            this.gameObjects.problemText.setText(
                this.formatMathProblem(mathProblem)
            );

            const choices = generateChoices(
                mathProblem.answer,
                this.state.ageGroup
            );
            this.createAnswerButtons(choices.map(String));
        }

        this.gameObjects.feedbackText.setText("");
    }

    private formatMathProblem(problem: Problem): string {
        const { num1, num2, operation, format, result } = problem;

        switch (format) {
            case "missingEnd":
                return `${num1} ${operation} ${num2} = ?`;
            case "missingMiddle":
                return `${num1} ${operation} ? = ${result}`;
            case "missingStart":
                return `? ${operation} ${num2} = ${result}`;
            default:
                return `${num1} ${operation} ${num2} = ?`;
        }
    }

    private createAnswerButtons(choices: string[]): void {
        if (!this.gameObjects) return;

        // Clear existing buttons
        this.gameObjects.buttons.removeAll(true);

        const { width, height } = this.scale;
        const buttonWidth = Math.min(width * 0.15, 120);
        const spacing = Math.min(width * 0.2, 150);
        const startX = width * 0.5 - ((choices.length - 1) * spacing) / 2;
        const y = height * 0.7;

        choices.forEach((choice, index) => {
            const x = startX + index * spacing;
            new AnswerButton(this, {
                x,
                y,
                width: buttonWidth,
                value: choice,
                onClick: (value) => this.checkAnswer(value),
            });
        });
    }

    private checkAnswer(choice: string | number): void {
        if (!this.currentProblem || !this.gameObjects) return;

        const isSequenceProblem = "sequence" in this.currentProblem;
        const isCorrect = isSequenceProblem
            ? choice === this.currentProblem.answer
            : (typeof choice === "string" ? parseInt(choice) : choice) ===
              this.currentProblem.answer;

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }

        // Create new problem after a delay
        this.time.delayedCall(1500, () => {
            this.createNewProblem();
        });
    }

    private calculatePoints(): number {
        if (!this.currentProblem) return 0;

        if ("sequence" in this.currentProblem) {
            // Points for sequence problems
            return this.currentProblem.format === "numberSequence" ? 1 : 2;
        } else {
            // Points for math problems
            if (this.state.ageGroup === 5) {
                let points = this.currentProblem.operation === "+" ? 1 : 2;
                if (this.currentProblem.format !== "missingEnd") {
                    points += 1;
                }
                return points;
            } else {
                let points = this.currentProblem.result <= 10 ? 1 : 2;
                if (this.currentProblem.format !== "missingEnd") {
                    points += 1;
                }
                return points;
            }
        }
    }

    private handleCorrectAnswer(): void {
        if (!this.gameObjects || !this.currentProblem) return;

        const points = this.calculatePoints();
        this.state.score += points;

        // Update score display
        this.gameObjects.scoreText.setText(`Score: ${this.state.score}`);

        // Show feedback with points earned
        const stars = "🌟".repeat(points);
        this.gameObjects.feedbackText
            .setText(`${stars} Correct! +${points} points`)
            .setColor("#047857");
    }

    private handleIncorrectAnswer(): void {
        if (!this.gameObjects) return;

        // Show encouraging message for wrong answer
        const message =
            this.state.ageGroup === 5
                ? "Try again! 💪"
                : "Not quite! Try again! 💪";

        this.gameObjects.feedbackText.setText(message).setColor("#dc2626");
    }

    private endGame(): void {
        if (!this.gameObjects) return;

        // Transition to GameOverScene with final score and age group
        this.scene.start("GameOverScene", {
            score: this.state.score,
            ageGroup: this.state.ageGroup,
        });
    }
}
