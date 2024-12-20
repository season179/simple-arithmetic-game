import { Scene, GameObjects } from "phaser";
import { ButtonConfig } from "../types/scenes";
import { getResponsiveFontSize } from "../config";

export class AnswerButton {
    private container: GameObjects.Container;
    private background: GameObjects.Rectangle;
    private text: GameObjects.Text;

    constructor(scene: Scene, config: ButtonConfig) {
        const { x, y, width, value, onClick } = config;

        // Create background rectangle with responsive size
        const buttonWidth = Math.min(width, scene.scale.width * 0.25); // Increased from 0.2 to 0.25
        const buttonHeight = buttonWidth;

        this.background = scene.add
            .rectangle(0, 0, buttonWidth, buttonHeight, 0xecfdf5)
            .setInteractive({ useHandCursor: true });

        // Create text with responsive font size
        // Increased base font size from 36 to 42
        const fontSize = getResponsiveFontSize(42);
        this.text = scene.add
            .text(0, 0, value.toString(), {
                fontSize: `${fontSize}px`,
                color: "#047857",
                fontFamily: "Arial",
                fontWeight: "bold" // Added bold weight for better visibility
            })
            .setOrigin(0.5);

        // Create container and add components
        this.container = scene.add.container(x, y, [this.background, this.text]);

        // Add event listeners with touch support
        this.background
            .on("pointerdown", () => onClick(value))
            .on("pointerover", () => this.background.setFillStyle(0xd1fae5))
            .on("pointerout", () => this.background.setFillStyle(0xecfdf5));

        // Handle window resize
        scene.scale.on("resize", this.handleResize, this);
    }

    private handleResize(): void {
        // Increased base font size from 36 to 42
        const fontSize = getResponsiveFontSize(42);
        this.text.setFontSize(fontSize);
    }

    destroy(): void {
        this.container.destroy();
    }
}
