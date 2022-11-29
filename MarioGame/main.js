import Phaser from "phaser";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 650,
    height: 300,
    parent: "game",
    zoom: 4,
    pixelArt: true,
    backgroundColor: "#0E071B",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            //debug: true,
        },
    },
    scene: { preload, create, update },
});

let blueDino;

let cursors;
let isMoving;
let shiftKey;
let canJump;
let deathBlocks
let numberOfCoins = 0
let score;
let coin;


function preload() {
    
    //this.load.image("background", "./assets/back.png");
    
    this.load.spritesheet("idlecoin", "./assets/coin.png", {
        frameWidth: 16,
        frameHeight: 16 
    })
    this.load.spritesheet("idle", "./assets/Char.png", {
        frameWidth: 24,
        frameHeight: 24,
    });
    this.load.image("base_tiles", "./assets/adve/tiles.png")
    this.load.tilemapTiledJSON("tilemap", "./assets/adve/Level1.json")
}

function create() {
    const map = this.make.tilemap({ key: "tilemap" })
    const tileset = map.addTilesetImage('base_tiles', 'base_tiles')
    const tilelayer = map.createLayer('Collide', tileset)
    deathBlocks = map.createLayer('DeathBlocks', tileset)
    
    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    blueDino = this.physics.add.sprite(180, -50, "idle");

    score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })

    coin = this.physics.add.sprite(310, 70, 'idlecoin').setImmovable(true)
    coin.body.setAllowGravity(false);
    coin.setScale(0.7)

    blueDino.setSize(14, 16, true)
    blueDino.setScale(1);
    blueDino.setCollideWorldBounds(true);
    coin.setCollideWorldBounds(true)

    this.cameras.main.startFollow(blueDino, true, 0.05, 0.05)

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
    this.anims.create({
        key: "coinidle",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idlecoin", { start: 1, end: 8 }),
    });
    

    this.physics.add.collider(blueDino, tilelayer , function () {
        canJump = true;
    });

    //this.physics.add.collider(coin, tilelayer)

    this.physics.add.collider(blueDino, deathBlocks, function() {
        blueDino.setX(180);
        blueDino.setY(70)
    })

    this.physics.add.overlap(blueDino, coin, function() {
        numberOfCoins++
        score.setText(`Score: ${numberOfCoins}`)
        coin.disableBody(true, true)
    })

    tilelayer.setCollisionBetween(0,400)
    deathBlocks.setCollisionBetween(0,400)
}



function update() {

    score.x = blueDino.body.position.x - 290; 
    score.y = blueDino.body.position.y - 130;

    if (shiftKey.isDown && cursors.right.isDown) {
        blueDino.setVelocityX(200);
        blueDino.flipX = false;
        blueDino.anims.play("sprint", true);
    } else if (shiftKey.isDown && cursors.left.isDown) {
        blueDino.setVelocityX(-200);
        blueDino.flipX = true;
        blueDino.anims.play("sprint", true);
    } else if (cursors.right.isDown) {
        isMoving = true;
        blueDino.flipX = false;
        blueDino.setVelocityX(120);
        blueDino.anims.play("right", true);
    } else if (cursors.left.isDown) {
        isMoving = true;
        blueDino.flipX = true;
        blueDino.setVelocityX(-120);
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
        blueDino.setVelocityY(-140);
    }

    coin.anims.play("coinidle", true)

    canJump = false;
}
