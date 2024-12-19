import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Title
    this.add.text(centerX, centerY - 150, 'Math Adventure!', {
      fontSize: '48px',
      color: '#2563eb',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 80, 'Choose Your Level:', {
      fontSize: '32px',
      color: '#4b5563',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // 5-year-old button
    const youngButton = this.add.text(centerX, centerY, '5 Years Old', {
      fontSize: '32px',
      color: '#047857',
      backgroundColor: '#ecfdf5',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // 8-year-old button
    const olderButton = this.add.text(centerX, centerY + 80, '8 Years Old', {
      fontSize: '32px',
      color: '#7c3aed',
      backgroundColor: '#f5f3ff',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Add click handlers
    youngButton.on('pointerdown', () => {
      this.scene.start('GameScene', { ageGroup: 5 });
    });

    olderButton.on('pointerdown', () => {
      this.scene.start('GameScene', { ageGroup: 8 });
    });

    // Add hover effects
    [youngButton, olderButton].forEach(button => {
      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: button === youngButton ? '#d1fae5' : '#ede9fe' });
      });

      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: button === youngButton ? '#ecfdf5' : '#f5f3ff' });
      });
    });
  }
}