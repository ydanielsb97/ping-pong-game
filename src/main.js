import Phaser from "phaser"
import Game from "./scenes/Game"
import GameBackground from "./scenes/GameBackground"
import HomeScreen from "./scenes/HomeScreen"

const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    // backgroundcolor,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
    }
}

const game = new Phaser.Game(config)

game.scene.add('game', Game)
game.scene.add('gameBackground', GameBackground)
game.scene.add('homeScreen', HomeScreen)

// game.scene.start('game')
game.scene.start('homeScreen')