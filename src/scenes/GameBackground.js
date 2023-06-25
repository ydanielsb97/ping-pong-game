import Phaser from "phaser"

const WHITE_COLOR = 0xFFFFFF

export default class GameBackground extends Phaser.Scene {
    preload(){

    }

    create(){
        this.add.line(400, 250, 0, 0, 0, 500, WHITE_COLOR, 1).setStrokeStyle(5, WHITE_COLOR, 1)
        this.add.circle(400, 250, 50).setStrokeStyle(2, WHITE_COLOR, 1)
    }
}