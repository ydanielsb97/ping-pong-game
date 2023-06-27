import Phaser from "phaser"

export default class InstructionsScreen extends Phaser.Scene {
    preload() {
        this.load.audio("gameStarts", "../assets/game-starts.wav");
        this.load.start();

    }

    create() {
        this.gameStarts = this.sound.add("gameStarts");

        const text = this.add.text(400, 150, 'How to play?', { fontSize: 32 })
        text.setOrigin(0.5, 0.5)
        const textInstructions = isMobileDevice() ? "Touch the screen to move the paddle." : "Use the arrow keys up and down."

        const instruction = this.add.text(200, 200, textInstructions, { fontSize: 22 }).setOrigin(0.5, 0.5)
        instruction.setAlign("center")


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

            this.scene.run('game')
            this.scene.stop('instructionsScreen')
        })
    }
}