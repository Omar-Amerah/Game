import Phaser from "phaser";
let load = 0

class CreateLevels extends Phaser.Scene {
    constructor() {
      super("bootGame");
      
    }
    create() {

        this.scene.start("firstLevel")

    }

  }
  export default CreateLevels
  