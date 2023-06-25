import Phaser from "phaser";
import WebFontFile from "./WebFontLoader";

class Game extends Phaser.Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
  }

  preload() {
    this.load.audio("hitBall", "assets/ball-hit.wav");
    this.load.audio("scoreCpu", "assets/score-cpu.wav");
    this.load.audio("scorePlayer", "assets/score-player.wav");

    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
    this.load.start();
  }

  create() {
    this.hitBall = this.sound.add("hitBall");
    this.scoreCpu = this.sound.add("scoreCpu");
    this.scorePlayer = this.sound.add("scorePlayer");
    // this.background = this.sound.add("background");

    this.scene.run("gameBackground");
    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, 0xffffff, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setBounce(1, 1);

    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.resetBall();

    this.paddleLeft = this.add.rectangle(50, 250, 20, 150, 0xffffff, 1);
    this.paddleRight = this.add.rectangle(750, 250, 20, 150, 0xffffff, 1);

    this.paddleRightVelocity.y = this.paddleRight.y;

    this.physics.add.existing(this.paddleLeft, true);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(this.paddleLeft, this.ball, this.collisionCallback(this.paddleLeft));
    this.physics.add.collider(this.paddleRight, this.ball, this.collisionCallback(this.paddleRight));

    this.cursors = this.input.keyboard.createCursorKeys();

    // this.background.play(undefined, { volume: 0.15 })
    const scoreStyle = {
      fontSize: 48,
      fontFamily: '"Press Start 2P"',
    };

    this.leftScore = this.add.text(350, 50, "0", scoreStyle).setOrigin(0.5, 0.5);
    this.rightScore = this.add.text(450, 50, "0", scoreStyle).setOrigin(0.5, 0.5);

  }

  update() {
    if (this.cursors.up.isDown) {
      if (this.moving != "up") this.moving = "up";
      if (this.paddleLeft.y >= 90) this.paddleLeft.setY(this.paddleLeft.y - 15).body.updateFromGameObject();
    }

    if (this.cursors.down.isDown) {
      if (this.moving != "down") this.moving = "down";
      if (this.paddleLeft.y <= 410) this.paddleLeft.setY(this.paddleLeft.y + 15).body.updateFromGameObject();
    }

    if (this.cursors.up.isUp || this.cursors.down.isUp) {
        
      this.moving = undefined;
    }

    if (this.ball.x < 0) {
      // Scored on the left side
      this.increaseScore("right");
      this.resetBall();
    } else if (this.ball.x > 810) {
      this.increaseScore("left");
      this.resetBall();
      // Scored on the right side
    }

    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 50) return;

    const aiSpeed = 3;

    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (diff > 70) {
        this.paddleRightVelocity.y = 10;
      }
      // if()
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (diff < -70) {
        this.paddleRightVelocity.y = -10;
      }
    }
    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  resetBall() {
    this.ball.setPosition(400, 250);
    const angle = Phaser.Math.Between(0, 180);
    const vec = this.physics.velocityFromAngle(angle, 200);
    const randomNumber = Math.round(Math.random() * 5) - 1;

    this.ball.body.setVelocity(-500, vec.y * randomNumber);
  }

  increaseScore(side = "left") {
    if (side === "left") {
        this.scorePlayer.play(undefined, { volume: 0.05})
        this.leftScore.setText(`${Number(this.leftScore.text) + 1}`);
    } else {
        this.scoreCpu.play(undefined, { volume: 0.05})
        this.rightScore.setText(`${Number(this.rightScore.text) + 1}`);
    }
  }

  collisionCallback(object, moving) {
    const colorConfig = {
      targets: object,
      duration: 100,
      yoyo: true,
      fillColor: {
        from: 0xffffff,
        to: 0xffff00,
      },
    };

    let lastPosition = Number(object.body.position.y);
    return (obj) => {
        if(lastPosition !== obj.body.position.y){
            if(obj.body.position.y < lastPosition){
                this.ball.body.setVelocityY(this.ball.body.velocity.y - 200)
            } else {
                this.ball.body.setVelocityY(this.ball.body.velocity.y + 200)
            }
    
        }

        lastPosition = obj.body.position.y

      this.hitBall.play(undefined, { volume: 0.05 });
    
      this.tweens.add(colorConfig);
    };
  }
}

export default Game;
