import { Scene } from "phaser";
import { getResponsiveFontSize, getResponsiveSize } from "../config";

export class GameOverScene extends Scene {
    constructor() {
        super({ key: "GameOverScene" });
    }

    create(data: { score: number; ageGroup: number }): void {
        const { width, height } = this.scale;

        // Game Over Title with responsive font size
        this.add
            .text(width * 0.5, height * 0.15, "Game Over!", {
                fontSize: `${getResponsiveFontSize(64)}px`,
                color: "#2563eb",
                fontFamily: "Arial Bold",
            })
            .setOrigin(0.5);

        // Final Score
        this.add
            .text(width * 0.5, height * 0.28, `Final Score: ${data.score}`, {
                fontSize: `${getResponsiveFontSize(48)}px`,
                color: "#1e40af",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Scoring System Explanation
        const scoringText = this.createScoringExplanation(data.ageGroup);
        this.add
            .text(width * 0.5, height * 0.45, scoringText, {
                fontSize: `${getResponsiveFontSize(24)}px`,
                color: "#4b5563",
                fontFamily: "Arial",
                align: "center",
                lineSpacing: getResponsiveSize(10),
                wordWrap: { width: width * 0.8 }
            })
            .setOrigin(0.5);

        // Create responsive buttons
        this.createResponsiveButton(
            width * 0.5,
            height * 0.7,
            "Play Again",
            "#047857",
            "#ecfdf5",
            "#d1fae5",
            () => this.scene.start("GameScene", { ageGroup: data.ageGroup })
        );

        this.createResponsiveButton(
            width * 0.5,
            height * 0.8,
            "Main Menu",
            "#7c3aed",
            "#f5f3ff",
            "#ede9fe",
            () => this.scene.start("MainMenuScene")
        );

        // Add resize handler
        this.scale.on("resize", this.handleResize, this);
    }

    private createScoringExplanation(ageGroup: number): string {
        if (ageGroup === 5) {
            return [
                "Scoring System:",
                "Math Challenges:",
                " Addition: 1 point",
                " Subtraction: 2 points",
                " Missing Number Problems: 3 points",
                "",
                "Sequence Challenges:",
                " Number Sequences: 1 point",
                " Alphabet Sequences: 2 points",
            ].join("\n");
        } else {
            return [
                "Scoring System:",
                "Math Problems:",
                " Numbers up to 10: 1 point",
                " Numbers over 10: 2 points",
                " Missing Number Problems: 3 points",
                " Multiplication: 4 points",
                "",
                "Sequence Challenges:",
                " Number Sequences: 3 points",
            ].join("\n");
        }
    }

    private createResponsiveButton(
        x: number,
        y: number,
        text: string,
        textColor: string,
        bgColor: string,
        hoverColor: string,
        onClick: () => void
    ): { text: Phaser.GameObjects.Text; background: Phaser.GameObjects.Rectangle } {
        const fontSize = getResponsiveFontSize(32);
        const padding = {
            x: getResponsiveSize(20),
            y: getResponsiveSize(10)
        };

        const buttonText = this.add
            .text(x, y, text, {
                fontSize: `${fontSize}px`,
                color: textColor,
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        const background = this.add
            .rectangle(
                x,
                y,
                buttonText.width + padding.x * 2,
                buttonText.height + padding.y * 2,
                this.hexStringToNumber(bgColor)
            )
            .setInteractive({ useHandCursor: true });

        buttonText.setDepth(1);

        background
            .on("pointerover", () => background.setFillStyle(this.hexStringToNumber(hoverColor)))
            .on("pointerout", () => background.setFillStyle(this.hexStringToNumber(bgColor)))
            .on("pointerdown", onClick);

        return { text: buttonText, background };
    }

    private handleResize(): void {
        // Recreate the scene with new dimensions
        this.scene.restart(this.scene.settings.data);
    }

    private hexStringToNumber(hex: string): number {
        return parseInt(hex.replace("#", ""), 16);
    }
}
