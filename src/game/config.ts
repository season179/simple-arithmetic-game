import { Types } from "phaser";

export const gameConfig: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#f0f9ff",
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: "100%",
        height: "100%",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    input: {
        activePointers: 4
    }
};

// Utility functions for responsive design
export const getResponsiveSize = (size: number, baseWidth: number = 1920): number => {
    const width = window.innerWidth;
    return Math.floor((width / baseWidth) * size);
};

export const getResponsiveFontSize = (baseSize: number): number => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    // Base scale factor calculation
    let scaleFactor = Math.min(width / 1920, 1);
    
    // Adjust scale factor for mobile devices
    if (width < 768) { // Mobile breakpoint
        scaleFactor = Math.max(scaleFactor * 1.4, 0.6); // Increase mobile fonts by 40%
    } else if (width < 1024) { // Tablet breakpoint
        scaleFactor = Math.max(scaleFactor * 1.2, 0.5); // Increase tablet fonts by 20%
    }

    // Additional boost for portrait mode on mobile
    if (isPortrait && width < 768) {
        scaleFactor *= 1.2; // Additional 20% increase for portrait mobile
    }

    // Calculate final font size with minimum and maximum constraints
    const fontSize = Math.floor(baseSize * scaleFactor);
    const minSize = isPortrait ? 16 : 14; // Larger minimum size for portrait mode
    const maxSize = baseSize * 1.5; // Maximum size cap

    return Math.min(Math.max(fontSize, minSize), maxSize);
};
