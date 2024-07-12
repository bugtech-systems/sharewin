import * as PIXI from "pixi.js";
import spriteImg from './images/1c71b3e03.3ba8b.png';

// Create object to store sprite sheet data
const atlasData = {
    frames: {
        spin_button: {
            frame: { x: 650, y: 0,  w: 150, h: 150 },
            sourceSize: {  w: 1606, h: 389 },
            spriteSourceSize: { x: 0, y: 0,  w: 150, h: 150 }
        },
        spin_button_icon: {
            frame: { x: 800, y: 0,  w: 150, h: 150 },
            sourceSize: {  w: 1606, h: 389 },
            spriteSourceSize: { x: 0, y: 0,  w: 150, h: 150 }
        },
        "small_button_active": {
            "frame": {
              "x": 648,
              "y": 155,
              "w": 60,
              "h": 60
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 648,
              "y": 155,
              "w": 60,
              "h": 60
            },
            "sourceSize": {
              "w": 1606,
              "h": 389
            }
          },
          "small_button": {
            "frame": {
              "x": 712,
              "y": 155,
              "w": 60,
              "h": 60
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 712,
              "y": 155,
              "w": 60,
              "h": 60
            },
            "sourceSize": {
              "w": 1606,
              "h": 389
            }
          }
    },
    meta: {
        image: spriteImg,
        format: 'RGBA8888',
        size: { w: 1606, h: 389  },
        scale: 1
    },
    animations: {
        button: ['spin_button','spin_button_icon']  //array of frames by name
    }
}

export class Buttons {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.container = new PIXI.Container();

        this.container.width = window.innerWidth;
        this.container.y = window.innerHeight - 200;
        this.container.x = window.innerWidth / 2;

        this.spritesheet = new PIXI.Spritesheet(
            PIXI.Texture.from(atlasData.meta.image),
            atlasData
        );

        this.spritesheet.parse().then(() => {
            this.generateSprite();
        });
    }
    
    async generateSprite() {
        const texture = this.spritesheet.textures['spin_button'];
        const smallButton = new PIXI.Sprite(this.spritesheet.textures['small_button']);
        const smallButtonActive = new PIXI.Sprite(this.spritesheet.textures['small_button_active']);


        smallButton.anchor.set(0.5)
        
        const sprite = new PIXI.Sprite(texture);

        // sprite.anchor.set(0.5);  
        sprite.x = this.container.width / 2;
        sprite.y = this.container.height;
       
        this.container.addChild(sprite);
        this.container.addChild(smallButton);
        this.container.addChild(smallButtonActive);

        this.createGradientAnimation(sprite);

        // Ensuring the sprite is ready before setting interactive properties
        sprite.interactive = true;
        sprite.on("pointerdown", this.onSpriteClick.bind(this));
    }

    onSpriteClick() {
        console.log("Sprite clicked!");
    }

    createGradientAnimation(sprite) {
        const gradient = new PIXI.Graphics();
        const gradientTexture = PIXI.Texture.WHITE;

        gradient.beginTextureFill({
            texture: gradientTexture,
            color: 0xffffff,
            alpha: 0.5
        });
        
        gradient.drawRect(0, 0, sprite.width / 3, sprite.height * Math.sqrt(2)); // 1/3 of the width, height adjusted for 45-degree angle
        gradient.rotation = Math.PI / 4; // 45 degrees
        gradient.endFill();

        sprite.addChild(gradient);

        const ticker = new PIXI.Ticker();
        const speed = 2; // Adjust speed as needed

        ticker.add(() => {
            gradient.x += speed;
            gradient.y += speed;

            if (gradient.x > sprite.width || gradient.y > sprite.height) {
                gradient.x = -sprite.width / 3;
                gradient.y = -sprite.height / 3;
            }
        });

        ticker.start();
    }
}
