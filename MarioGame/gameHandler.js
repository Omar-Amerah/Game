import Phaser from "phaser";
import Level1 from "./Level1";

class CreateLevels extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    create() {
    //Load the first level
      this.scene.start("firstLevel");
      console.log(Level1.complete1)
    }

    update() {
        if (Level1.complete1) {
            this.scene.start("secondLevel")
            console.log('hello')
        }
    }
  }
  export default CreateLevels
  