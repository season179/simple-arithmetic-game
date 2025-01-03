import { useEffect } from "react";
import Phaser from "phaser";
import { gameConfig } from "./game/config";

function App() {
    useEffect(() => {
        const initGame = async () => {
            const [{ MainMenuScene }, { GameScene }, { GameOverScene }] =
                await Promise.all([
                    import("./game/scenes/MainMenuScene"),
                    import("./game/scenes/GameScene"),
                    import("./game/scenes/GameOverScene"),
                ]);

            const config = {
                ...gameConfig,
                scene: [MainMenuScene, GameScene, GameOverScene],
            };

            const game = new Phaser.Game(config);

            // Handle resize events
            const handleResize = () => {
                game.scale.resize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                game.destroy(true);
            };
        };

        initGame();
    }, []);

    return (
        <div id="game-container" className="w-screen h-screen overflow-hidden touch-none" />
    );
}

export default App;
