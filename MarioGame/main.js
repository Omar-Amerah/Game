import Phaser from "phaser";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 800,
    backgroundColor: "#0000FF",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: { preload, create, update },
});

let blueDino;
let cursors;
let isMoving;
let shiftKey;
let canJump;

function preload() {
    this.load.image("background", "./assets/back.png");
    this.load.image("platform", "./assets/plat.png");
    this.load.spritesheet("idle", "./assets/Char.png", {
        frameWidth: 24,
        frameHeight: 24,
    });
}

function create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);

    let platforms = this.physics.add.staticGroup();
    platforms.create(700, 750, "platform");

    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    blueDino = this.physics.add.sprite(300, 300, "idle");
    blueDino.setScale(3);
    blueDino.setCollideWorldBounds(true);

    this.anims.create({
        key: "idle",
        frameRate: 5,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 1, end: 3 }),
    });
    this.anims.create({
        key: "right",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 6, end: 9 }),
    });

    this.anims.create({
        key: "left",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 6, end: 9 }),
    });

    this.anims.create({
        key: "jump",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 4, end: 5 }),
    });

    this.anims.create({
        key: "sprint",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 18, end: 23 }),
    });

    this.physics.add.collider(blueDino, platforms, function () {
        canJump = true;
    });
}



function update() {
    if (shiftKey.isDown && cursors.right.isDown) {
        blueDino.setVelocityX(380);
        blueDino.flipX = false;
        blueDino.anims.play("sprint", true);
    } else if (shiftKey.isDown && cursors.left.isDown) {
        blueDino.setVelocityX(-380);
        blueDino.flipX = true;
        blueDino.anims.play("sprint", true);
    } else if (cursors.right.isDown) {
        isMoving = true;
        blueDino.flipX = false;
        blueDino.setVelocityX(290);
        blueDino.anims.play("right", true);
    } else if (cursors.left.isDown) {
        isMoving = true;
        blueDino.flipX = true;
        blueDino.setVelocityX(-290);
        blueDino.anims.play("left", true);
    } else {
        isMoving = false;
        blueDino.anims.play("idle", true);
        blueDino.setVelocityX(0);
    }

    if (cursors.up.isDown && canJump) {
        //jumptime = 0;
        isMoving = true;
        blueDino.anims.play("jump", true);
        blueDino.setVelocityY(-250);
    }

    canJump = false;
}
