import Phaser from "phaser";
import WebFontFile from "./WebFontLoader";

const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 1.3,
  HARD: 1.7,
  INSANE: 2,
  IMPOSSIBLE: 4,
}

const DIFFICULTY_LABELS = {
  [DIFFICULTY.EASY]: "EASY",
  [DIFFICULTY.MEDIUM]: "MEDIUM",
  [DIFFICULTY.HARD]: "HARD",
  [DIFFICULTY.INSANE]: "INSANE",
  [DIFFICULTY.IMPOSSIBLE]: "IMPOSSIBLE",
}

const CPU_ACCELERATION = 4

class Game extends Phaser.Scene {
  init() {
    this.difficulty = DIFFICULTY.MEDIUM
    this.ballVelocity = 500
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.lastScore = 'player'
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

    this.leftScore = this.add.text(300, 50, "0", scoreStyle).setOrigin(0.5, 0.5);
    this.rightScore = this.add.text(500, 50, "0", scoreStyle).setOrigin(0.5, 0.5);

    this.difficultyLabel = this.add.text(600, 10, `CPU: ${DIFFICULTY_LABELS[this.difficulty]}`, {
      ...scoreStyle,
      fontSize: 16
    })

    // this.levelGoal = this.add.text(200, 10, `Goal: ${DIFFICULTY_LABELS[this.difficulty]}`, {
    //   ...scoreStyle,
    //   fontSize: 16
    // })

  //   this.input.keyboard.on(`keydown-SPACE`, () => {
  //     console.log({isPaused: this.scene.isPaused('game')})
  //     if(this.scene.isPaused('game')) this.scene.resume('game')
  //     else this.scene.pause('game')
  // })
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

    const aiSpeed = 2

    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (diff > 70) {
        this.paddleRightVelocity.y = CPU_ACCELERATION;
      }
      // if()
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (diff < -70) {
        this.paddleRightVelocity.y = -CPU_ACCELERATION
      }
    }
    this.paddleRight.y += (this.paddleRightVelocity.y * this.difficulty);
    this.paddleRight.body.updateFromGameObject();
  }

  resetBall() {
    this.ball.setPosition(400, 250);
    const angle = Phaser.Math.Between(0, 180);
    const vec = this.physics.velocityFromAngle(angle, 200);
    const randomNumber = Math.round(Math.random() * 5) - 1;

    this.ball.body.setVelocity((this.lastScore === 'player' ? this.ballVelocity : -this.ballVelocity ) * this.difficulty, vec.y * randomNumber);
  }

  increaseScore(side = "left") {
    if (side === "left") {
        this.scorePlayer.play(undefined, { volume: 0.05})
        this.leftScore.setText(`${Number(this.leftScore.text) + 1}`);
        this.lastScore = 'player'
    } else {
        this.scoreCpu.play(undefined, { volume: 0.05})
        this.rightScore.setText(`${Number(this.rightScore.text) + 1}`);
        this.lastScore = 'cpu'
    }
    const diffScore = Number(this.leftScore.text) - Number(this.rightScore.text)

    if(diffScore >= 9) this.difficulty = DIFFICULTY.IMPOSSIBLE
    if(diffScore >= 6) this.difficulty = DIFFICULTY.INSANE
    else if(diffScore >= 3) this.difficulty = DIFFICULTY.HARD
    else if(diffScore >= 1) this.difficulty = DIFFICULTY.MEDIUM
    else if(diffScore <= 0) this.difficulty = DIFFICULTY.EASY

    this.difficultyLabel.setText(`CPU: ${DIFFICULTY_LABELS[this.difficulty]}`)
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
