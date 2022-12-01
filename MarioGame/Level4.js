import Phaser from "phaser";

const musicConfig = {
    mute: false,
    volume: 0.2,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
};
//music
let backgroundMusic;
//sprites
let blueDino;
let snake;
let coin1, coin2, coin3, coin4;
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks;
let exit;
let enemyStopper;

//counter
let staminabar = 600;
let jumptimer = 0;
let penguinFlip = 80;
let tick = 0;

let numberOfCoins = 0;
let numberOfDeaths = localStorage.getItem("Deaths");
//text
let score;
let staminatext;
let levelText;
let deathText;
//checkers
let staminatimeout = false;
let timeout = false;
let canJump;

class Level4 extends Phaser.Scene {
    constructor() {
        super("fourthLevel");
    }
    preload() {
        //load sprites

        this.load.spritesheet("snake", "./assets/level4/Snake_attack.png", {
            frameWidth: 48,
            frameHeight: 24,
        });
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level4/tiles4.png");
        this.load.tilemapTiledJSON("tilemap4", "./assets/level4/Level4.json");
    }

    create() {
        //tileset
        const map4 = this.make.tilemap({ key: "tilemap4" });
        const tileset = map4.addTilesetImage("base_tiles", "base_tiles");
        const tilelayer = map4.createLayer("Collide", tileset);
        const detailLayer = map4.createLayer("Details", tileset);
        deathBlocks = map4.createLayer("DeathBlocks", tileset);
        exit = map4.createLayer("Exit", tileset);
        enemyStopper = map4.createLayer("enemyStopper", tileset);
        // 1, 2, 2, 2, 1, 2, 1

        //ATTACK DIMENSIONS
        // snake.body.setOffset(0, 5)
        // snake.body.setSize(snake.width, snake.height - 5)

        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );

        //sprite physics
        blueDino = this.physics.add.sprite(80, -50, "idle");
        snake = this.physics.add.sprite(220, 192, "snake");
        snake.body.setSize(snake.width - 20, snake.height - 5);
        snake.body.setOffset(20, 5);

        blueDino.setSize(14, 16);
        blueDino.setScale(1);

        coin1 = this.physics.add
            .sprite(725, 210, "idlecoin")
            .setImmovable(true);
        coin1.body.setAllowGravity(false);
        coin1.setScale(0.6);

        coin2 = this.physics.add
            .sprite(1615, 120, "idlecoin")
            .setImmovable(true);
        coin2.body.setAllowGravity(false);
        coin2.setScale(0.6);

        coin3 = this.physics.add
            .sprite(1250, 155, "idlecoin")
            .setImmovable(true);
        coin3.body.setAllowGravity(false);
        coin3.setScale(0.6);

        //text
        score = this.add.text(0, 0, `Coins: 0`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        staminatext = this.add.text(0, 0, `Stamina: 100`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        levelText = this.add.text(0, 0, "Level: 2", {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        deathText = this.add.text(0, 0, `Deaths: ${numberOfDeaths}`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });

        this.cameras.main.startFollow(blueDino, true, 0.05, 0.05);

        this.anims.create({
            key: "idle",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 1,
                end: 3,
            }),
        });
        this.anims.create({
            key: "run",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 6,
                end: 9,
            }),
        });

        this.anims.create({
            key: "sprint",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 18,
                end: 23,
            }),
        });

        this.anims.create({
            key: "jump",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 4,
                end: 5,
            }),
        });

        this.anims.create({
            key: "tired",
            frameRate: 0.1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 14,
                end: 16,
            }),
        });

        this.anims.create({
            key: "coinidle",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idlecoin", {
                start: 1,
                end: 8,
            }),
        });

        this.anims.create({
            key: "snakeIdle",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("snake", {
                start: 6,
                end: 8,
            }),
        });

        this.anims.create({
            key: "snakeAttack",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("snake", {
                start: 9,
                end: 12,
            }),
        });

        this.physics.add.collider(blueDino, tilelayer, function () {
            canJump = true;
        });

        //this.physics.add.collider(penguin, tilelayer)
        // this.physics.add.collider(penguin, penguinStopper, function () {
        //     if (penguinFlip === 80) {
        //         penguin.flipX = false
        //         penguin.setVelocityX(penguinFlip)
        //         penguinFlip = -80
        //     } else {
        //         penguin.flipX = true
        //         penguin.setVelocityX(penguinFlip)
        //         penguinFlip = 80
        //     }
        // })

        this.physics.add.collider(snake, tilelayer);
        this.physics.add.overlap(snake, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            blueDino.body.position.x = 80;
            blueDino.body.position.y = -50;
        });

        this.physics.add.collider(blueDino, deathBlocks, function () {
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(80);
            blueDino.setY(-50);
        });

        this.physics.add.overlap(blueDino, coin1, function () {
            numberOfCoins++;
            score.setText(`Coins: ${numberOfCoins}`);
            coin1.disableBody(true, true);
        });
        this.physics.add.overlap(blueDino, coin2, function () {
            numberOfCoins++;
            score.setText(`Coins: ${numberOfCoins}`);
            coin2.disableBody(true, true);
        });
        this.physics.add.overlap(blueDino, coin3, function () {
            numberOfCoins++;
            score.setText(`Coins: ${numberOfCoins}`);
            coin3.disableBody(true, true);
        });

        const endFunc = () => {
            this.scene.start("fourthLevel");
        };
        this.physics.add.collider(blueDino, exit, function () {
            if (numberOfCoins === 0) {
                endFunc();
            }
        });

        //ENEMY NAME.setCollisionBetween(0,4000)
        enemyStopper.setCollisionBetween(0, 4000);
        tilelayer.setCollisionBetween(0, 4000);
        deathBlocks.setCollisionBetween(0, 4000);
        exit.setCollisionBetween(0, 4000);
    }

    update() {
        tick++;

        if (tick < 200) {
            snake.anims.play("snakeIdle", true);
            snake.body.setSize(snake.width - 20, snake.height - 5);
            snake.body.setOffset(20, 5);
        } else if (tick < 349) {
            snake.anims.play("snakeAttack", true);
            snake.body.setOffset(0, 5);
            snake.body.setSize(snake.width, snake.height - 5);
        } else if (tick === 350) {
            tick = 0;
        }

        staminatext.setText(`Stamina: ${((staminabar / 600) * 100).toFixed()}`);
        if (staminabar !== 600) {
            staminabar++;
        }
        if (staminabar === 0) {
            //isMoving = false
            blueDino.setVelocityX(0);
            blueDino.setVelocityY(0);
            timeout = true;
            blueDino.anims.play("tired", true);
            staminatimeout = true;
        }
        if (staminatimeout === true) {
            if (staminabar === 60) {
                timeout = false;
            }
            if (staminabar === 120) {
                staminatimeout = false;
            }
        }
        jumptimer++;
        score.x = blueDino.body.position.x - 100;
        score.y = blueDino.body.position.y - 100;
        staminatext.x = blueDino.body.position.x - 100;
        staminatext.y = blueDino.body.position.y - 90;
        levelText.x = blueDino.body.position.x - 100;
        levelText.y = blueDino.body.position.y - 80;
        deathText.x = blueDino.body.position.x - 100;
        deathText.y = blueDino.body.position.y - 70;

        if (
            shiftKey.isDown &&
            cursors.right.isDown &&
            staminabar > 0 &&
            staminatimeout === false &&
            timeout === false
        ) {
            console.log(blueDino.body.position.x, blueDino.body.position.y);
            staminabar = staminabar - 4;
            blueDino.setVelocityX(160);
            blueDino.flipX = false;
            blueDino.anims.play("sprint", true);
        } else if (
            shiftKey.isDown &&
            cursors.left.isDown &&
            staminabar > 0 &&
            staminatimeout === false &&
            timeout === false
        ) {
            staminabar = staminabar - 4;
            blueDino.setVelocityX(-160);
            blueDino.flipX = true;
            blueDino.anims.play("sprint", true);
        } else if (cursors.right.isDown && timeout === false) {
            blueDino.flipX = false;
            blueDino.setVelocityX(90);
            blueDino.anims.play("run", true);
        } else if (cursors.left.isDown && timeout === false) {
            blueDino.flipX = true;
            blueDino.setVelocityX(-90);
            blueDino.anims.play("run", true);
        } else if (timeout === false) {
            blueDino.anims.play("idle", true);
            blueDino.setVelocityX(0);
        }
        //&& canJump && jumptimer > 30
        if (cursors.up.isDown && canJump && jumptimer > 30) {
            blueDino.anims.play("jump", true);
            blueDino.setVelocityY(-145);
            jumptimer = 0;
        }
        if (blueDino.y > 300) {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(70);
        }

        coin1.anims.play("coinidle", true);
        coin2.anims.play("coinidle", true);
        coin3.anims.play("coinidle", true);

        canJump = false;
    }
}

export default Level4;
