import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Title
    this.add.text(centerX, centerY - 100, 'Math Adventure!', {
      fontSize: '48px',
      color: '#2563eb',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Play button
    const playButton = this.add.text(centerX, centerY + 50, 'Start Playing', {
      fontSize: '32px',
      color: '#047857',
      backgroundColor: '#ecfdf5',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}