/**
 * Phaser game configuration that defines the core setup of the game engine.
 * This includes canvas size, scaling behavior, and physics system settings.
 */

import { Types } from 'phaser';

export const gameConfig: Types.Core.GameConfig = {
  // Use WebGL if available, fallback to Canvas if not
  type: Phaser.AUTO,
  // ID of the DOM element where the game canvas will be injected
  parent: 'game-container',
  // Base canvas dimensions - will be scaled according to screen size
  width: 800,
  height: 600,
  // Light blue background matching the React container
  backgroundColor: '#f0f9ff',
  scale: {
    // Automatically scale the game to fit the parent container
    mode: Phaser.Scale.FIT,
    // Center the game canvas both horizontally and vertically
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    // Using arcade physics for simple collision detection
    default: 'arcade',
    arcade: {
      // No gravity needed for this 2D arithmetic game
      gravity: { y: 0 },
      // Set to true during development to visualize physics bodies
      debug: false
    }
  }
};