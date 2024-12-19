import { useEffect } from "react";
import Phaser from "phaser";
import { gameConfig } from "./game/config";
import { MainMenuScene } from "./game/scenes/MainMenuScene";
import { GameScene } from "./game/scenes/GameScene";
import { GameOverScene } from "./game/scenes/GameOverScene";

function App() {
    useEffect(() => {
        const config = {
            ...gameConfig,
            scene: [MainMenuScene, GameScene, GameOverScene],
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
}

export default App;
