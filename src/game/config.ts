import { Types } from 'phaser';

export const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#f0f9ff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};