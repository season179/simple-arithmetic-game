import { Scene, GameObjects } from "phaser";
import { ButtonConfig } from "../types/scenes";

export class AnswerButton {
    private container: GameObjects.Container;
    private background: GameObjects.Rectangle;

    constructor(scene: Scene, config: ButtonConfig) {
        const { x, y, width, value, onClick } = config;

        // Create background rectangle
        this.background = scene.add
            .rectangle(0, 0, width, width, 0xecfdf5)
            .setInteractive({ useHandCursor: true });

        // Create text
        const text = scene.add
            .text(0, 0, value.toString(), {
                fontSize: "36px",
                color: "#047857",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Create container and add components
        this.container = scene.add.container(x, y, [this.background, text]);

        // Add event listeners
        this.background
            .on("pointerdown", () => onClick(value))
            .on("pointerover", () => this.background.setFillStyle(0xd1fae5))
            .on("pointerout", () => this.background.setFillStyle(0xecfdf5));
    }

    destroy(): void {
        this.container.destroy();
    }
}
