import { header } from "express-validator";
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
            debug: true,
        },
    },
    scene: { preload, create, update },
});

let blueDino;
let capybara;
let cursors;
let isMoving;
let shiftKey;
let canJump;
let deathBlocks
let exit
let numberOfCoins = 0
let score;
let coin;



function preload() {
    
    //this.load.image("background", "./assets/back.png");
    this.load.spritesheet("capybara", "./assets/Capybara.png", {
        frameWidth: 64,
        frameHeight: 64 
    })
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
    exit = map.createLayer('Exit', tileset)
    
    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    blueDino = this.physics.add.sprite(180, -50, "idle");
    capybara = this.physics.add.sprite(380, -50, 'capybara')
    capybara.setSize(58, 45)
    capybara.setScale(0.3)
    score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })
    
    coin = this.physics.add.sprite(310, 70, 'idlecoin').setImmovable(true)
    coin.body.setAllowGravity(false);
    coin.setScale(0.6)

    blueDino.setSize(14, 16)
    blueDino.setScale(1);
    capybara.setCollideWorldBounds(true);
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
    this.anims.create({
        key: "capybara",
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("capybara", { start: 72, end: 79 }),
    });
    

    this.physics.add.collider(blueDino, tilelayer , function () {
        canJump = true;
    });

    this.physics.add.collider(capybara, tilelayer)

    this.physics.add.collider(blueDino, deathBlocks, function() {
        blueDino.setX(180);
        blueDino.setY(70)
    })

    this.physics.add.overlap(blueDino, coin, function() {
        numberOfCoins++
        score.setText(`Score: ${numberOfCoins}`)
        coin.disableBody(true, true)
    })

    this.physics.add.collider(blueDino, exit, function() {
        if (numberOfCoins === 1) {
            alert('You Win!!')
        }
    })

    this.physics.add.collider(blueDino, capybara, function() {
        blueDino.setX(180);
        blueDino.setY(70)
    })

    tilelayer.setCollisionBetween(0,400)
    deathBlocks.setCollisionBetween(0,400)
    exit.setCollisionBetween(0, 400)
}


let enemytimer = 0
function update() {
    enemytimer ++;

    if (enemytimer < 180) {
        capybara.setVelocityX(80)
        capybara.flipX = false;
    } else if (enemytimer < 359) {
        capybara.setVelocityX(-80)
        capybara.flipX = true;
    } else if (enemytimer === 360) {
        enemytimer = 0
    }


    score.x = blueDino.body.position.x - 290; 
    score.y = blueDino.body.position.y - 130;

    if (shiftKey.isDown && cursors.right.isDown) {
        blueDino.setVelocityX(160);
        blueDino.flipX = false;
        blueDino.anims.play("sprint", true);
    } else if (shiftKey.isDown && cursors.left.isDown) {
        blueDino.setVelocityX(-160);
        blueDino.flipX = true;
        blueDino.anims.play("sprint", true);
    } else if (cursors.right.isDown) {
        isMoving = true;
        blueDino.flipX = false;
        blueDino.setVelocityX(90);
        blueDino.anims.play("right", true);
    } else if (cursors.left.isDown) {
        isMoving = true;
        blueDino.flipX = true;
        blueDino.setVelocityX(-90);
        blueDino.anims.play("left", true);
    } else {
        isMoving = false;
        blueDino.anims.play("idle", true);
        blueDino.setVelocityX(0);
    }

    if (cursors.up.isDown && canJump) {
        
        isMoving = true;
        blueDino.anims.play("jump", true);
        blueDino.setVelocityY(-140);
    }

    coin.anims.play("coinidle", true)
    capybara.anims.play("capybara", true)

    canJump = false;
}
