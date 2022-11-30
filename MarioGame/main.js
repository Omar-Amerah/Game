import { header } from "express-validator";
import Phaser from "phaser";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: "game",
    zoom: 4,
    pixelArt: true,
    backgroundColor: "#0E071B",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            //ßdebug: true,
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
let coin1;
let coin2;
let coin3;
let staminabar = 300;
let staminatimeout = false; 
let test = true


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
    const detailLayer= map.createLayer("Details", tileset)
    deathBlocks = map.createLayer('DeathBlocks', tileset)
    exit = map.createLayer('Exit', tileset)
    
    cursors = this.input.keyboard.createCursorKeys();
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    blueDino = this.physics.add.sprite(90, -50, "idle");
    capybara = this.physics.add.sprite(1139, -50, 'capybara')
    capybara.setSize(58, 45)
    capybara.setScale(0.3)
    score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })
    
    coin1 = this.physics.add.sprite(150, 65, 'idlecoin').setImmovable(true)
    coin1.body.setAllowGravity(false);
    coin1.setScale(0.6)

    coin2 = this.physics.add.sprite(880, 35, 'idlecoin').setImmovable(true)
    coin2.body.setAllowGravity(false);
    coin2.setScale(0.6)

    coin3 = this.physics.add.sprite(1369, -10, 'idlecoin').setImmovable(true)
    coin3.body.setAllowGravity(false);
    coin3.setScale(0.6)

    blueDino.setSize(14, 16)
    blueDino.setScale(1);
    //capybara.setCollideWorldBounds(true);
    //blueDino.setCollideWorldBounds(true);
    //coin.setCollideWorldBounds(true)


    window.scene = this;
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
        key: "tired",
        frameRate: 0.1,
        repeat: -1,
        frames: this.anims.generateFrameNumbers("idle", { start: 14, end: 16 }),
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

    this.physics.add.overlap(blueDino, coin1, function() {
        numberOfCoins++
        score.setText(`Score: ${numberOfCoins}`)
        console.log(numberOfCoins)
        coin1.disableBody(true, true)
    })
    this.physics.add.overlap(blueDino, coin2, function() {
        numberOfCoins++
        score.setText(`Score: ${numberOfCoins}`)
        console.log(numberOfCoins)
        coin2.disableBody(true, true)
    })
    this.physics.add.overlap(blueDino, coin3, function() {
        numberOfCoins++
        score.setText(`Score: ${numberOfCoins}`)
        console.log(numberOfCoins)
        coin3.disableBody(true, true)
    })

    this.physics.add.collider(blueDino, exit, function() {
        if (numberOfCoins === 3) {
            alert('You Win!!')
        }
    })

    this.physics.add.collider(blueDino, capybara, function() {
        blueDino.setX(90);
        blueDino.setY(70)
    })

    tilelayer.setCollisionBetween(0,400)
    deathBlocks.setCollisionBetween(0,400)
    exit.setCollisionBetween(0, 400)
}


let enemytimer = 0
let jumptimer = 0
function update() {
    if(staminabar !== 300)
    {
        staminabar ++;
    }
    if(staminabar === 0){
        isMoving = false
        blueDino.setVelocityX(0)
        blueDino.setVelocityY(0)
        test = false
        blueDino.anims.play("tired", true);
        staminatimeout = true
    }
    if(staminatimeout === true)
    {
        if(staminabar === 60)
        {
            test = true
        }
        if(staminabar === 120)
        {
            staminatimeout = false
        }
    }
    
    enemytimer ++;
    jumptimer ++;

    if (enemytimer < 95) {
        capybara.setVelocityX(80)
        capybara.flipX = false;
    } else if (enemytimer < 189) {
        
        capybara.setVelocityX(-80)
        capybara.flipX = true;
    } else if (enemytimer === 190) {
        enemytimer = 0
    }


    score.x = blueDino.body.position.x - 290; 
    score.y = blueDino.body.position.y - 130;

    if (shiftKey.isDown && cursors.right.isDown && staminabar > 0 && staminatimeout === false && test ===true) {
        staminabar = staminabar - 3
        blueDino.setVelocityX(160);
        blueDino.flipX = false;
        blueDino.anims.play("sprint", true);
    } else if (shiftKey.isDown && cursors.left.isDown && staminabar > 0 && staminatimeout === false && test ===true) {
        staminabar = staminabar - 3
        blueDino.setVelocityX(-160);
        blueDino.flipX = true;
        blueDino.anims.play("sprint", true);
    } else if (cursors.right.isDown&& test ===true) {
        isMoving = true;
        blueDino.flipX = false;
        blueDino.setVelocityX(90);
        blueDino.anims.play("right", true);
    } else if (cursors.left.isDown&& test ===true) {
        isMoving = true;
        blueDino.flipX = true;
        blueDino.setVelocityX(-90);
        blueDino.anims.play("left", true);
    } else if(test === true){
        isMoving = false;
        blueDino.anims.play("idle", true);
        blueDino.setVelocityX(0);
    }


    if(blueDino.y > 180)
    {
        console.log(blueDino.y)
        blueDino.setX(90);
        blueDino.setY(70)
    }

    if (cursors.up.isDown && canJump && jumptimer > 90) {
        isMoving = true;
        blueDino.anims.play("jump", true);
        blueDino.setVelocityY(-145);
        jumptimer = 0
    }

    coin1.anims.play("coinidle", true)
    coin2.anims.play("coinidle", true)
    coin3.anims.play("coinidle", true)
    capybara.anims.play("capybara", true)

    canJump = false;
}
