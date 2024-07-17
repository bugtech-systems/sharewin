import * as PIXI from "pixi.js";
import { Application, Assets, AnimatedSprite, Texture, Spritesheet } from 'pixi.js';

import { App } from "../system/App";
import spriteImg from './images/1c71b3e03.3ba8b.png';
import iconImg from '../../assets/images/footer_icons.png';

// Create object to store sprite sheet data
const atlasData = {
    frames: {
        spin_button: {
            frame: { x: 650, y: 0, w: 150, h: 150 },
            sourceSize: { w: 150, h: 150 },
            spriteSourceSize: { x: 0, y: 0, w: 150, h: 150 }
        },
        spin_button_icon: {
            frame: { x: 800, y: 0, w: 100, h: 100 },
            sourceSize: { w: 0, h: 0 },
            spriteSourceSize: { x: 0, y: 0, w: 0, h: 0 }
        },
        "footer_gradient": {
            "frame": {
              "x": 0,
              "y": 1,
              "w": 645,
              "h": 220
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 0,
              "y": 1,
              "w": 645,
              "h": 220
            },
            "sourceSize": {
              "w": 1606,
              "h": 389
            }
          },
    },
    meta: {
        image: spriteImg,
        format: 'RGBA8888',
        size: { w: 1606, h: 389 },
        scale: 1.1
    },
    animations: {
        button: ['spin_button', 'spin_button_icon']  // array of frames by name
    }
};


const iconData = {
    "frames": {
      "bet_icon-0": {
        "frame": {
          "x": 257,
          "y": 956,
          "w": 40,
          "h": 40
        },
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {
          "x": 257,
          "y": 956,
          "w": 40,
          "h": 40
        },
        "sourceSize": {
          "w": 372,
          "h": 1024
        }
      },
      "flash_icon-0": {
        "frame": {
          "x": 200,
          "y": 855,
          "w": 40,
          "h": 50
        },
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {
          "x": 200,
          "y": 855,
          "w": 40,
          "h": 50
        },
        "sourceSize": {
          "w": 372,
          "h": 1024
        }
      },
      "autoplay_icon-0": {
        "frame": {
          "x": 320,
          "y": 650,
          "w": 45,
          "h": 40
        },
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {
          "x": 320,
          "y": 650,
          "w": 45,
          "h": 40
        },
        "sourceSize": {
          "w": 372,
          "h": 1024
        }
      }
    },
    "meta": {
      "app": "sprite-sheet-to-json",
      "version": "1.0.0",
      "image": iconImg,
      "format": "RGBA8888",
      "size": {
        "w": 372,
        "h": 1024
      },
      "scale": "1"
    }
  }

export class Buttons {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.container = new PIXI.Container();

        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight - 150 / 2;
        // this.container.width = window.innerWidth;
        // this.container.y = window.innerHeight;

        this.spritesheet = new Spritesheet(
            Texture.from(atlasData.meta.image),
            atlasData
        );

        this.spritesheet.parse(() => {
            this.generateSprite();
        });
    }

    generateSprite() {
    
    console.log(this.spritesheet, 'this sprite')
        const spinButton = new PIXI.Sprite(this.spritesheet.textures['spin_button']);
        const footerGradient = new PIXI.Sprite(this.spritesheet.textures['footer_gradient']);
        const spinButtonIcon = new PIXI.Sprite(this.spritesheet.textures['spin_button_icon']);

        // Set initial properties
        footerGradient.anchor.set(0.5);
        spinButton.anchor.set(0.5);
        spinButtonIcon.anchor.set(0.5);
        // spinButtonIcon.y = this.container.height / 2 ;
        // spinButtonIcon.x = this.container.width / 2 ;
        
        // spinButton.anchor.set(0.5);
        footerGradient.height = 500
        footerGradient.width = window.innerWidth
        // spinButton.height = 150;
        // spinButton.width = 150;



        spinButton.x = 0;
        spinButton.y = -20;
        // spinButton.height = 300;
        spinButtonIcon.x = -27;
        spinButtonIcon.y = 35;
        spinButtonIcon.rotation -= 2;
        // Create shader
        const shaderCode = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float uTime;

        void main() {
            vec2 uv = vTextureCoord;

            // Rotate coordinates by 45 degrees
            float angle = 45.0 * 1.14159265 / 180.0;
            uv = vec2(
                uv.x * cos(angle) - uv.y * sin(angle),
                uv.x * sin(angle) + uv.y * cos(angle)
            );

            // Define the gradient effect width (1/3 of the texture width)
            float gradientWidth = 0.1;

            // Create a gradient effect moving from left to right once
            float gradient = smoothstep(uTime, uTime + gradientWidth, uv.x);

            // Define gold colors
            vec3 goldStart = vec3(1.0, 0.843, 0.0);
            vec3 goldEnd = vec3(1.0, 0.9, 0.5);

            // Mix colors based on gradient
            vec3 goldColor = mix(goldStart, goldEnd, gradient);

            // Get the base texture color
            vec4 color = texture2D(uSampler, vTextureCoord);

            // Combine the texture color with the gold reflection
            vec4 reflectionColor = vec4(mix(color.rgb, goldColor, gradient), color.a);

            // Apply reflection only inside the sprite image
            gl_FragColor = reflectionColor * color.a;
        }
        `;

        const goldGradientShader = new PIXI.Filter(null, shaderCode, { uTime: 0.5 });

        // Apply the shader to the sprite
        // sprite.filters = [goldGradientShader];

        // this.createBreathingAnimation(sprite);

        // Create animated sprite (optional)
        this.animatedSprite = new AnimatedSprite(this.spritesheet.animations.button);
        this.animatedSprite.y = -100

        this.animatedSprite.animationSpeed = 0.1666;
        // this.container.addChild(this.animatedSprite);


        // Add the sprite to the container
        this.container.addChild(footerGradient);
        this.container.addChild(spinButton);
        this.container.addChild(spinButtonIcon);
        

        
        // Create an animation loop to update the shader uniform
        PIXI.Ticker.shared.add((delta) => {
            goldGradientShader.uniforms.uTime += delta * 0.001; // slower motion
            if (goldGradientShader.uniforms.uTime > 0.5) {
                goldGradientShader.uniforms.uTime = -0.09; // reset to start position after passing through
            }
        });
    }


    createBreathingAnimation(sprite) {
        const ticker = new PIXI.Ticker();
        let scaleDirection = 1; // 1 for scaling up, -1 for scaling down
        let scaleSpeed = 0.01;

        ticker.add(() => {
            sprite.scale.x += scaleSpeed * scaleDirection;
            sprite.scale.y += scaleSpeed * scaleDirection;

            if (sprite.scale.x >= 1.1 || sprite.scale.x <= 0.9) {
                scaleDirection *= -1; // Reverse the scale direction
            }
        });

        ticker.start();
    }

    unselect() {
        this.selected.visible = false;
    }

    select() {
        this.selected.visible = true;
    }

    get position() {
        return {
            x: this.col * this.sprite.width,
            y: this.row * this.sprite.height
        };
    }

    setTile(tile) {
        this.tile = tile;
        tile.field = this;
        tile.setPosition(this.position);
    }
}
