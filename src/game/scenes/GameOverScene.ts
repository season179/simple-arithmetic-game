import { Scene } from "phaser";

export class GameOverScene extends Scene {
    constructor() {
        super({ key: "GameOverScene" });
    }

    create(data: { score: number; ageGroup: number }) {
        const { width, height } = this.scale;

        // Game Over Title
        this.add
            .text(width * 0.5, height * 0.15, "Game Over!", {
                fontSize: "64px",
                color: "#2563eb",
                fontFamily: "Arial Bold",
            })
            .setOrigin(0.5);

        // Final Score
        this.add
            .text(width * 0.5, height * 0.28, `Final Score: ${data.score}`, {
                fontSize: "48px",
                color: "#1e40af",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Scoring System Explanation
        const scoringText = this.createScoringExplanation(data.ageGroup);
        const scoringExplanation = this.add
            .text(width * 0.5, height * 0.45, scoringText, {
                fontSize: "24px",
                color: "#4b5563",
                fontFamily: "Arial",
                align: "center",
                lineSpacing: 10,
            })
            .setOrigin(0.5);

        // Center the scoring explanation text
        const lines = scoringText.split("\n");
        const maxWidth = Math.max(
            ...lines.map(
                (line) => this.add.text(0, 0, line, { fontSize: "24px" }).width
            )
        );
        scoringExplanation.setWordWrapWidth(maxWidth);

        // Create buttons
        this.createButton(
            width * 0.5,
            height * 0.7,
            "Play Again",
            "#047857",
            "#ecfdf5",
            "#d1fae5",
            () => this.scene.start("GameScene", { ageGroup: data.ageGroup })
        );

        this.createButton(
            width * 0.5,
            height * 0.8,
            "Main Menu",
            "#7c3aed",
            "#f5f3ff",
            "#ede9fe",
            () => this.scene.start("MainMenuScene")
        );

        // Add resize event listener
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
            ].join("\n");
        }
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        textColor: string,
        bgColor: string,
        hoverColor: string,
        onClick: () => void
    ): void {
        const padding = { x: 20, y: 10 };

        // Create text first to get its width for the background
        const buttonText = this.add
            .text(x, y, text, {
                fontSize: "32px",
                color: textColor,
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Create background rectangle
        const background = this.add
            .rectangle(
                x,
                y,
                buttonText.width + padding.x * 2,
                buttonText.height + padding.y * 2,
                this.hexStringToNumber(bgColor)
            )
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5);

        // Make sure text is above background
        buttonText.setDepth(1);

        // Add hover effects
        background
            .on("pointerover", () => {
                background.setFillStyle(this.hexStringToNumber(hoverColor));
            })
            .on("pointerout", () => {
                background.setFillStyle(this.hexStringToNumber(bgColor));
            })
            .on("pointerdown", onClick);
    }

    private handleResize(): void {
        const { width, height } = this.scale;

        // Update all text positions
        this.children.list.forEach((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Text) {
                const y = child.y / this.scale.height; // Get relative Y position
                child.setPosition(width * 0.5, height * y);
            } else if (child instanceof Phaser.GameObjects.Rectangle) {
                // Find the associated text and update rectangle position
                const associatedText = this.children.list.find(
                    (text: Phaser.GameObjects.GameObject) =>
                        text instanceof Phaser.GameObjects.Text &&
                        Math.abs(
                            (text as Phaser.GameObjects.Text).y -
                                (child as Phaser.GameObjects.Rectangle).y
                        ) < 1
                );
                if (associatedText) {
                    child.setPosition(
                        width * 0.5,
                        (associatedText as Phaser.GameObjects.Text).y
                    );
                }
            }
        });
    }

    private hexStringToNumber(hex: string): number {
        return parseInt(hex.replace("#", ""), 16);
    }
}
