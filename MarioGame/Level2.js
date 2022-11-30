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

class Level2 extends Phaser.Scene{

    constructor() {
        super('secondLevel')
    }

    preload() {

    }

    create() {
        console.log('Second Level')
    }

    update() {

    }

}

export default Level2