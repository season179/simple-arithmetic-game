import { Scene } from "phaser";
import posthog from 'posthog-js';
import { generateProblem, generateChoices } from "../utils/mathUtils";
import {
    generateSequenceProblem,
    generateSequenceChoices,
} from "../utils/sequenceUtils";
import { Problem, SequenceProblem } from "../types";
import { GameSceneObjects, GameState } from "../types/scenes";
import { AnswerButton } from "../components/AnswerButton";
import { getResponsiveFontSize, getResponsiveSize } from "../config";

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
        this.state = {
            score: 0,
            ageGroup: data.ageGroup || 5,
        };

        posthog.capture('game_started', {
            age_group: this.state.ageGroup
        });

        this.createGameObjects();
        this.createNewProblem();
    }

    private createGameObjects(): void {
        const { width, height } = this.scale;
        const buttonsContainer = this.add.container(0, 0);

        // Calculate responsive sizes with increased base sizes
        const endGameFontSize = getResponsiveFontSize(28);
        const scoreFontSize = getResponsiveFontSize(36);
        const problemFontSize = getResponsiveFontSize(52);
        const feedbackFontSize = getResponsiveFontSize(36);

        // End Game button with responsive positioning
        const endGameButton = this.add
            .text(width - getResponsiveSize(16), getResponsiveSize(16), "End Game", {
                fontSize: `${endGameFontSize}px`,
                color: "#dc2626",
                backgroundColor: "#fee2e2",
                padding: { 
                    x: getResponsiveSize(12), 
                    y: getResponsiveSize(8) 
                },
                fontFamily: "Arial",
                fontWeight: "bold"
            })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.endGame());

        this.gameObjects = {
            scoreText: this.add.text(getResponsiveSize(16), getResponsiveSize(16), "Score: 0", {
                fontSize: `${scoreFontSize}px`,
                color: "#1e40af",
                fontFamily: "Arial",
                fontWeight: "bold"
            }),
            problemText: this.add
                .text(width * 0.5, height * 0.3, "", {
                    fontSize: `${problemFontSize}px`,
                    color: "#1e40af",
                    fontFamily: "Arial",
                    align: "center",
                    wordWrap: { width: width * 0.8 },
                    fontWeight: "bold"
                })
                .setOrigin(0.5),
            feedbackText: this.add
                .text(width * 0.5, height * 0.45, "", {
                    fontSize: `${feedbackFontSize}px`,
                    fontFamily: "Arial",
                    fontWeight: "bold"
                })
                .setOrigin(0.5),
            buttons: buttonsContainer,
            endGameButton,
        };

        // Add resize handler
        this.scale.on("resize", this.handleResize, this);
    }

    private createNewProblem(): void {
        if (!this.gameObjects) return;

        // 40% chance of sequence problems for both age groups
        if (Math.random() < 0.4) {
            const sequenceProblem = generateSequenceProblem(this.state.ageGroup);
            this.currentProblem = sequenceProblem;

            // Display the sequence problem
            const sequenceText = sequenceProblem.sequence.join(" ");
            const directionArrow = sequenceProblem.direction === "ascending" ? "→" : "←";

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
        const buttonWidth = Math.min(width * 0.2, 150); // Increased max width
        const spacing = Math.min(width * 0.25, 180); // Increased spacing
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
            : (typeof choice === "string" ? parseInt(choice) : choice) === this.currentProblem.answer;

        // Track answer attempt
        posthog.capture('answer_submitted', {
            age_group: this.state.ageGroup,
            problem_type: isSequenceProblem ? 'sequence' : 'math',
            is_correct: isCorrect,
            score: this.state.score
        });

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
            if (this.state.ageGroup === 8) {
                return 3; // Higher points for 8-year-olds
            }
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
                // For 8-year-olds
                if (this.currentProblem.operation === "×") {
                    return 4; // 4 points for multiplication
                }
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
        const message = this.state.ageGroup === 5
            ? "Try again! 💪"
            : "Not quite! Try again! 💪";

        this.gameObjects.feedbackText.setText(message).setColor("#dc2626");
    }

    private endGame(): void {
        // Track game end
        posthog.capture('game_ended', {
            age_group: this.state.ageGroup,
            final_score: this.state.score
        });

        // Transition to GameOverScene with final score and age group
        this.scene.start("GameOverScene", {
            score: this.state.score,
            ageGroup: this.state.ageGroup,
        });
    }

    private handleResize(): void {
        if (!this.gameObjects) return;

        const { width, height } = this.scale;

        // Update positions and sizes
        this.gameObjects.endGameButton
            .setPosition(width - getResponsiveSize(16), getResponsiveSize(16))
            .setFontSize(getResponsiveFontSize(28));

        this.gameObjects.scoreText
            .setPosition(getResponsiveSize(16), getResponsiveSize(16))
            .setFontSize(getResponsiveFontSize(36));

        this.gameObjects.problemText
            .setPosition(width * 0.5, height * 0.3)
            .setFontSize(getResponsiveFontSize(52))
            .setWordWrapWidth(width * 0.8);

        this.gameObjects.feedbackText
            .setPosition(width * 0.5, height * 0.45)
            .setFontSize(getResponsiveFontSize(36));

        // Recreate answer buttons with new positions
        if (this.currentProblem) {
            const choices = "sequence" in this.currentProblem
                ? this.currentProblem.sequence
                : generateChoices(this.currentProblem.answer, this.state.ageGroup).map(String);
            this.createAnswerButtons(choices);
        }
    }
}
