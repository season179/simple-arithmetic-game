import { Scene, GameObjects } from 'phaser';
import { ButtonConfig } from '../types/scenes';

export class AnswerButton {
  private container: GameObjects.Container;

  constructor(scene: Scene, config: ButtonConfig) {
    const { x, y, width, value, onClick } = config;

    const button = scene.add.rectangle(0, 0, width, width, 0xecfdf5);
    const text = scene.add.text(0, 0, value.toString(), {
      fontSize: '36px',
      color: '#047857',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.container = scene.add.container(x, y, [button, text]);
    
    button.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => onClick(value))
      .on('pointerover', () => button.setFillStyle(0xd1fae5))
      .on('pointerout', () => button.setFillStyle(0xecfdf5));
  }

  destroy(): void {
    this.container.destroy();
  }
}