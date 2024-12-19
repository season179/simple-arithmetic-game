/**
 * Main application component that initializes and manages the Phaser game instance.
 * This component serves as the bridge between React and Phaser, handling game lifecycle.
 */

import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { GameScene } from './game/scenes/GameScene';

function App() {
  useEffect(() => {
    // Initialize Phaser game with our scenes and configuration
    // The order of scenes in the array determines their loading sequence
    const config = {
      ...gameConfig,
      scene: [MainMenuScene, GameScene]
    };

    const game = new Phaser.Game(config);

    // Cleanup function to properly destroy the game instance
    // when the component unmounts, preventing memory leaks
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    // Container with full viewport height and light blue background
    <div className="min-h-screen bg-blue-50">
      {/* Game container that Phaser will attach to */}
      <div id="game-container" className="w-full h-screen" />
    </div>
  );
}

export default App;