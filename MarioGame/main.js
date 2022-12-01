import Phaser from "phaser";
import CreateLevels from "./gameHandler"
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3"
import Level4 from "./Level4"
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
            debug: true,
        },
    },
    scene: [CreateLevels, Level1, Level2, Level3, Level4],
    
});

export default game




