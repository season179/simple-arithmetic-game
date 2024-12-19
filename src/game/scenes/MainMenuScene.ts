import { Scene } from "phaser";

export class MainMenuScene extends Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.image("logo", "images/math-adventure.webp");
    }

    create() {
        const { width, height } = this.scale;

        // Logo
        const logo = this.add.image(width * 0.5, height * 0.15, "logo");
        const scale = Math.min(
            (width * 0.4) / logo.width,
            (height * 0.15) / logo.height
        );
        logo.setScale(scale);

        // Title
        this.add
            .text(width * 0.5, height * 0.35, "Math Adventure!", {
                fontSize: "48px",
                color: "#2563eb",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Subtitle
        this.add
            .text(width * 0.5, height * 0.45, "Choose Your Level:", {
                fontSize: "32px",
                color: "#4b5563",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Create buttons with rectangles for better click areas
        this.createButton(
            width * 0.5,
            height * 0.6,
            "5 Years Old",
            "#047857",
            "#ecfdf5",
            "#d1fae5",
            () => this.scene.start("GameScene", { ageGroup: 5 })
        );

        this.createButton(
            width * 0.5,
            height * 0.75,
            "8 Years Old",
            "#7c3aed",
            "#f5f3ff",
            "#ede9fe",
            () => this.scene.start("GameScene", { ageGroup: 8 })
        );
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        textColor: string,
        bgColor: string,
        hoverColor: string,
        onClick: () => void
    ) {
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
            .setInteractive({ useHandCursor: true });

        // Make sure text is above background
        buttonText.setDepth(1);

        // Add hover effects
        background.on("pointerover", () => {
            background.setFillStyle(this.hexStringToNumber(hoverColor));
        });

        background.on("pointerout", () => {
            background.setFillStyle(this.hexStringToNumber(bgColor));
        });

        // Add click handler
        background.on("pointerdown", onClick);
    }

    private hexStringToNumber(hex: string): number {
        return parseInt(hex.replace("#", ""), 16);
    }
}
