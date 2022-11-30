import Phaser from "phaser";



const musicConfig = {
    mute: false,
    volume: 0.2,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}
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
let staminatext;
let coin1;
let coin2;
let coin3;
let staminabar = 600;
let staminatimeout = false; 
let test = true
let backgroundMusic
let jumptimer = 0
let capybaraflip = 80
let capybaraStopper
let endcheck = false

//let levelHandler = new CreateLevels()


class Level1 extends Phaser.Scene {
    constructor() {
        super("firstLevel");
        
    }
    preload() {
        

        this.complete1 = false
        this.load.audio('background', './assets/background.mp3')
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
        this.load.image("base_tiles", "./assets/level1/tiles.png")
        this.load.tilemapTiledJSON("tilemap", "./assets/level1/Level1.json")
    }
    
    create() {
        
        backgroundMusic = this.sound.add('background')
        backgroundMusic.play(musicConfig)
        const map = this.make.tilemap({ key: "tilemap" })
        const tileset = map.addTilesetImage('base_tiles', 'base_tiles')
        const tilelayer = map.createLayer('Collide', tileset)
        const detailLayer= map.createLayer("Details", tileset)
        deathBlocks = map.createLayer('DeathBlocks', tileset)
        exit = map.createLayer('Exit', tileset)
        capybaraStopper = map.createLayer('CapybaraCharles', tileset)
        
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        blueDino = this.physics.add.sprite(1500, -50, "idle");
        capybara = this.physics.add.sprite(1139, 100, 'capybara')
        capybara.setVelocityX(capybaraflip)

        capybara.setSize(58, 45)
        capybara.setScale(0.3)
        score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })
        staminatext = this.add.text(0,0, `Stamina: 100`, { fontSize: '8px', fill: '#FFFFFF' })
        
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
        this.physics.add.collider(capybaraStopper, capybara, function()
        {
            if(capybaraflip === 80)
            {
                capybara.setVelocityX(capybaraflip)
                capybaraflip = -80
            }
            else
            {
                capybara.setVelocityX(capybaraflip)
                capybaraflip = 80
            }
        })
    
        this.physics.add.collider(blueDino, deathBlocks, function() {
            blueDino.setX(180);
            blueDino.setY(70)
        })
    
        this.physics.add.overlap(blueDino, coin1, function() {
            numberOfCoins++
            score.setText(`Coins: ${numberOfCoins}`)

            coin1.disableBody(true, true)
        })
        this.physics.add.overlap(blueDino, coin2, function() {
            numberOfCoins++
            score.setText(`Coins: ${numberOfCoins}`)

            coin2.disableBody(true, true)
        })
        this.physics.add.overlap(blueDino, coin3, function() {
            numberOfCoins++
            score.setText(`Coins: ${numberOfCoins}`)

            coin3.disableBody(true, true)
        })
        const endFunc =  () => {
            this.scene.start('secondLevel')
        }
        this.physics.add.collider(blueDino, exit, function() {
            
            if (numberOfCoins === 0) {
                endcheck = true
                endFunc()                  
            }
        })
    
        this.physics.add.overlap(blueDino, capybara, function() {
            
            console.log(blueDino.body.velocity.y)
            if (blueDino.body.velocity.y > 100 || blueDino.body.velocity.y < -100)
            {
                capybara.disableBody(true, true)
                blueDino.setVelocityY(-90)
            }
            else
            {
                blueDino.setX(90);
                blueDino.setY(70)
            }
        })
    
        capybaraStopper.setCollisionBetween(0,400)
        tilelayer.setCollisionBetween(0,400)
        deathBlocks.setCollisionBetween(0,400)
        exit.setCollisionBetween(0, 400)
    }
    
    update() {
        

        staminatext.setText(`Stamina: ${(staminabar/600 * 100).toFixed()}`)
        if(staminabar !== 600)
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
        jumptimer ++;
        score.x = blueDino.body.position.x - 100; 
        score.y = blueDino.body.position.y - 100;
        staminatext.x = blueDino.body.position.x - 100; 
        staminatext.y = blueDino.body.position.y - 90;
    
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
            blueDino.setX(90);
            blueDino.setY(70)
        }
    
        if (cursors.up.isDown && canJump && jumptimer > 30) {
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
}


export default Level1;
