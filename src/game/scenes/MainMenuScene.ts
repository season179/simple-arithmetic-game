import { Scene, GameObjects } from "phaser";
import posthog from 'posthog-js';
import { getResponsiveFontSize, getResponsiveSize } from "../config";

export class MainMenuScene extends Scene {
    private logo?: GameObjects.Image;
    private title?: GameObjects.Text;
    private subtitle?: GameObjects.Text;
    private buttons: { text: GameObjects.Text; background: GameObjects.Rectangle }[] = [];

    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload(): void {
        this.load.image("logo", "/math-adventure.webp");
    }

    create(): void {
        posthog.capture('menu_viewed');

        const { width, height } = this.scale;

        // Create logo with responsive scaling
        this.logo = this.add.image(width * 0.5, height * 0.15, "logo");
        this.updateLogoScale();

        // Title with increased font size
        this.title = this.add
            .text(width * 0.5, height * 0.35, "Math Adventure!", {
                fontSize: `${getResponsiveFontSize(56)}px`,
                color: "#2563eb",
                fontFamily: "Arial Bold",
            })
            .setOrigin(0.5);

        // Subtitle with increased font size
        this.subtitle = this.add
            .text(width * 0.5, height * 0.45, "Choose Your Level:", {
                fontSize: `${getResponsiveFontSize(38)}px`,
                color: "#4b5563",
                fontFamily: "Arial Bold",
            })
            .setOrigin(0.5);

        // Create level selection buttons
        this.createLevelButtons();

        // Add resize handler
        this.scale.on("resize", this.handleResize, this);
    }

    private createLevelButtons(): void {
        const { width, height } = this.scale;

        // Clear existing buttons
        this.buttons.forEach(button => {
            button.text.destroy();
            button.background.destroy();
        });
        this.buttons = [];

        // Create new buttons
        const button5Years = this.createResponsiveButton(
            width * 0.5,
            height * 0.6,
            "5 Years Old",
            "#047857",
            "#ecfdf5",
            "#d1fae5",
            () => {
                posthog.capture('level_selected', { age_group: 5 });
                this.scene.start("GameScene", { ageGroup: 5 });
            }
        );

        const button8Years = this.createResponsiveButton(
            width * 0.5,
            height * 0.75,
            "8 Years Old",
            "#7c3aed",
            "#f5f3ff",
            "#ede9fe",
            () => {
                posthog.capture('level_selected', { age_group: 8 });
                this.scene.start("GameScene", { ageGroup: 8 });
            }
        );

        this.buttons.push(button5Years, button8Years);
    }

    private createResponsiveButton(
        x: number,
        y: number,
        text: string,
        textColor: string,
        bgColor: string,
        hoverColor: string,
        onClick: () => void
    ): { text: GameObjects.Text; background: GameObjects.Rectangle } {
        const fontSize = getResponsiveFontSize(38);
        const padding = {
            x: getResponsiveSize(30), // Increased horizontal padding
            y: getResponsiveSize(15)  // Increased vertical padding
        };

        const buttonText = this.add
            .text(x, y, text, {
                fontSize: `${fontSize}px`,
                color: textColor,
                fontFamily: "Arial Bold",
            })
            .setOrigin(0.5);

        // Make button background wider for better touch targets
        const minWidth = Math.max(buttonText.width + padding.x * 2, getResponsiveSize(200));
        const background = this.add
            .rectangle(
                x,
                y,
                minWidth,
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

    private updateLogoScale(): void {
        if (!this.logo) return;

        const { width, height } = this.scale;
        
        // Calculate maximum dimensions based on screen size
        const maxLogoWidth = Math.min(
            width * 0.4,  // 40% of screen width
            400          // Maximum width in pixels
        );
        const maxLogoHeight = Math.min(
            height * 0.2, // 20% of screen height
            200          // Maximum height in pixels
        );

        // Calculate scale while maintaining aspect ratio
        const scaleX = maxLogoWidth / this.logo.width;
        const scaleY = maxLogoHeight / this.logo.height;
        const scale = Math.min(scaleX, scaleY);
        
        this.logo.setScale(scale);
    }

    private handleResize(): void {
        const { width, height } = this.scale;

        // Update logo
        if (this.logo) {
            this.logo.setPosition(width * 0.5, height * 0.15);
            this.updateLogoScale();
        }

        // Update title
        if (this.title) {
            this.title
                .setPosition(width * 0.5, height * 0.35)
                .setFontSize(getResponsiveFontSize(56));
        }

        // Update subtitle
        if (this.subtitle) {
            this.subtitle
                .setPosition(width * 0.5, height * 0.45)
                .setFontSize(getResponsiveFontSize(38));
        }

        // Recreate buttons with new positions
        this.createLevelButtons();
    }

    private hexStringToNumber(hex: string): number {
        return parseInt(hex.replace("#", ""), 16);
    }
}
