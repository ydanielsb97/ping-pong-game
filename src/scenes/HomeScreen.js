import Phaser from 'phaser'

export default class HomeScreen extends Phaser.Scene {
    init() {

        const loader = document.getElementById("loader")
        if(loader) loader.style.display = "none"
        
    }
    preload() {

        this.load.audio("gameStarts", "assets/game-starts.wav");
        this.load.start();
    }

    create() {

        this.gameStarts = this.sound.add("gameStarts");

        const title = this.add.text(400, 200, 'Retro Ping Pong', {
            fontSize: 48,
            fontFamily: '"Press Start 2P"'
        })

        title.setOrigin(0.5, 0.5)

        const subTitle = this.add.text(400, 300, 'Press SPACE to start', {
            fontSize: 27,
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5, 0.6)

        var colorConfig = {
            targets: subTitle,
            duration: 1000,
            // delay: 2000,
            repeat: -1,
            yoyo: true,
            tint: { from: 0xFFFFFF, to: 0xFFFF00 }
        }

        this.tweens.add(colorConfig) 

        this.input.keyboard.once(`keydown-SPACE`, () => {
            this.gameStarts.play(undefined, { volume: 0.1 })

            this.scene.run('instructionsScreen')
            this.scene.stop('homeScreen')
        })

    }

}