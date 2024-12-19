import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { GameScene } from './game/scenes/GameScene';

function App() {
  useEffect(() => {
    const config = {
      ...gameConfig,
      scene: [MainMenuScene, GameScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <div id="game-container" className="w-full h-screen" />
    </div>
  );
}

export default App;