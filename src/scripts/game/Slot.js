import * as PIXI from "pixi.js";
import { BlurFilter } from '@pixi/filter-blur'; // Correct import for BlurFilter

import {
    Application,
    Color,
    Container,
    Texture,
    Sprite,
    Graphics,
    Text,
    TextStyle,
    Spritesheet
    // BlurFilter,
    // FillGradient,
} from 'pixi.js';
import lineImg1 from '../../sprites/line-1.png';
import lineImg2 from '../../sprites/line-2.png';
import lineImg3 from '../../sprites/line-3.png';
import lineImg4 from '../../sprites/line-4.png';
import lineImg5 from '../../sprites/line-5.png';
import tilesImages from '../../sprites/tiles.png';
import wildSymbol from '../../sprites/gems_05.png';
import redGem from '../../sprites/sprites_60.png';
import blueGem from '../../sprites/sprites_04.png';
import greenGem from '../../sprites/sprites_03.png';
import aText from '../../sprites/gems_05.png';
import kText from '../../sprites/gems_05.png';
import qText from '../../sprites/gems_05.png';
import jText from '../../sprites/gems_05.png';
import gemImg from '../../sprites/gems.png';


const tileData = {
    "frames": {
        "aText": {
          "frame": {
            "x": 180,
            "y": 0,
            "w": 180,
            "h": 150
          },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": {
            "x": 180,
            "y": 0,
            "w": 180,
            "h": 145    
          },
          "sourceSize": {
            "w": 1024,
            "h": 1024
          }
        },
        "greenGem": {
            "frame": {
                "x": 360,
                "y": 0,
                "w": 180,
                "h": 150
              },
              "rotated": false,
              "trimmed": false,
              "spriteSourceSize": {
                "x": 360,
                "y": 0,
                "w": 180,
                "h": 145
              },
              "sourceSize": {
                "w": 1024,
                "h": 1024
              }
        },
        "blueGem": {
            "frame": {
                "x": 540,
                "y": 0,
                "w": 180,
                "h": 150
              },
              "rotated": false,
              "trimmed": false,
              "spriteSourceSize": {
                "x": 540,
                "y": 0,
                "w": 180,
                "h": 145
              },
              "sourceSize": {
                "w": 1024,
                "h": 1024
              }
        },
        "kText": {
            "frame": {
              "x": 0,
              "y": 425,
              "w": 180,
              "h": 150
            },
            "rotated": true,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 0,
              "y": 246,
              "w": 180,
              "h": 145
            },
            "sourceSize": {
              "w": 1024,
              "h": 1024
            }
          },
  
          "times1": {
            "frame": {
              "x": 150,
              "y": 300,
              "w": 140,
              "h": 140
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 150,
              "y": 300,
              "w": 140,
              "h": 140
            },
            "sourceSize": {
              "w": 1024,
              "h": 1024
            }
          },
          "times2": {
            "frame": {
              "x": 300,
              "y": 445,
              "w": 140,
              "h": 140
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
            "x": 300,
            "y": 445,
            "w": 130,
            "h": 140
            },
            "sourceSize": {
              "w": 1024,
              "h": 1024
            }
        }
      },
    
      "meta": {
        "app": "sprite-sheet-to-json",
        "version": "1.0.0",
        "image": tilesImages,
        "format": "RGBA8888",
        "size": {
          "w": 1024,
          "h": 1024
        },
        "scale": 1
      },
       animations: {
        button: ['greenGem', 'aText']  // array of frames by name
    }
};

const gemsData = {
    frames: {
        "goldframe": {
            "frame": {
              "x": 635,
              "y": 5,
              "h": 165,
              "w": 200
            },
            "rotated": true,
            "trimmed": false,
            "spriteSourceSize": {
              "x": 635,
              "y": 5,
              "w": 140,
              "h": 140
            },
            "sourceSize": {
              "w": 1024,
              "h": 1024
            }
          },
          "qText": {
            "frame": {
              "x": 475,
              "y": 615,
              "h": 150,
              "w": 180
            },
            "rotated": true,
            "trimmed": false,
            "spriteSourceSize": {
             "x": 475,
              "y": 615,
              "w": 140,
              "h": 140
            },
            "sourceSize": {
              "w": 1024,
              "h": 1024
            }
          },
          "wild": {
            "frame": {
              "x": 820,
              "y": 450,
              "w": 210,
              "h": 200
            },
            "rotated": true,
            "trimmed": false,
            "spriteSourceSize": {
             "x": 820,
             "y": 450,
              "w": 210,
              "h": 200
            },
            "sourceSize": {
              "w": 0,
              "h": 0
            }
          }
    },
    "meta": {
        "app": "sprite-sheet-to-json",
        "version": "1.0.0",
        "image": gemImg,
        "format": "RGBA8888",
        "size": {
          "w": 1024,
          "h": 1024
        },
        "scale": 1
      }
    
 };


const REEL_WIDTH = 115;
const SYMBOL_SIZE = 115;
const NUM_REELS = 4;
const NUM_ROWS = 5;


const PAYTABLE = {
    'wild': 25,
    'redGem': 20,
    'blueGem': 15,
    'greenGem': 12,
    'aText': 10,
    'kText': 8,
    'qText': 5,
    'jText': 2
};

const MULTIPLIERS = [1, 2, 3, 5, 10, 15];


export class Slot {
    constructor(app) {
        this.app = app;
        this.reelContainer = new Container();
        this.reels = [];
        // this.REEL_WIDTH = 100;
        // SYMBOL_SIZE = 120;
        this.running = false;
        this.tweening = [];
        this.winLines = [];
       
        this.spritesheet = new Spritesheet(
            Texture.from(tileData.meta.image),
            tileData
        ); 
        
        this.spritesheet2 = new Spritesheet(
            Texture.from(gemsData.meta.image),
            gemsData
        ); 
        
        
        this.slotTextures = [ 'greenGem', 'blueGem', 'aText', 'kText', 'qText'];

        // this.slotTextures[1].rotate = Math.PI / 4;
        
        

        this.lineMultiplier = ['times1', 'times2'];
        
        this.linesTextures = [
            Texture.from(lineImg1),
            Texture.from(lineImg2),
            Texture.from(lineImg3),
            Texture.from(lineImg4),
            Texture.from(lineImg5)
        ];

        this.winningLines = [
            [2, 2, 2], // bottom row
            [1, 1, 1], // middle row
            [3, 3, 3], // top row
            [1, 2, 3], // diagonal top-left to bottom-right
            [3, 2, 1]  // diagonal bottom-left to top-right
        ];
    
    
        this.spritesheet2.parse()
    
        this.spritesheet.parse(() => {
            this.spritesheet.textures = {...this.spritesheet.textures, ...this.spritesheet2.textures}
            this.init();
            
        })
    
    
        this.app.ticker.add(this.updateTweens.bind(this));

        // app.ticker.add(() => {
        //     this.update();
        // });  
        
        // this.startPlay.bind(this)
    }

    async init() {
        // Load the textures
 /*        const textures = await Assets.load([
            'https://pixijs.com/assets/eggHead.png',
            'https://pixijs.com/assets/flowerTop.png',
            'https://pixijs.com/assets/helmlok.png',
            'https://pixijs.com/assets/skully.png',
        ]); */

 
     /*    this.app.stage.addChild(this.reelContainer);
        this.app.stage.x = window.innerWidth / 3
        this.app.stage.y = window.innerHeight - this.app.stage.height */
        /* this.createReels();
        this.createSpinButton(); */
        this.buildReels();

        
        this.buildUI();
      
    }


    buildReels() {

        for (let i = 0; i < NUM_REELS; i++) {
            const rc = new PIXI.Container();
            rc.x = (i * REEL_WIDTH);
            // const rc = new Container();
            // rc.x = i * REEL_WIDTH;
            this.reelContainer.addChild(rc);

            const reel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter(),
            };

            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            // Build the symbols
       /*      for (let j = 0; j < 5; j++) {
                const symbol = new Sprite(this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]);
                // Scale the symbol to fit symbol area
                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            } */
            const symbols = [];
            for (let j = 0; j < 5; j++) {
                const symbol = new Sprite(this.spritesheet.textures[i < 3 ? this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)] : this.lineMultiplier[Math.floor(Math.random() * this.lineMultiplier.length)]]);
                // Scale the symbol to fit symbol area
                // symbol.width = 100;
                
                symbol.y = (j * SYMBOL_SIZE);
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                symbol.height = 120;

                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            // this.reels.push({ container: rc, symbols: symbols, position: 0, previousPosition: 0 });
            this.reels.push({container: rc, symbols: symbols, position: 0, previousPosition: 0, ...reel});
        }
        
        
        

        
        
        
        
        const margin = (this.app.screen.height - SYMBOL_SIZE * 4) / 2;

        // this.reelContainer.y = margin + 200;

        // this.reelContainer.x = Math.round((this.app.screen.width - REEL_WIDTH * NUM_REELS) / 2);

        // Build top & bottom covers and position reelContainer
        const top = new Graphics().beginFill(0x000000).drawRect(100, 600, this.app.screen.width, 400).endFill();
        const bottom = new Graphics().beginFill(0x000000).drawRect(100, 400, this.app.screen.width, 260).endFill();
    
        
        this.app.stage.addChild(top);
        this.reelContainer.mask = top
        this.reelContainer.mask = bottom
        
        this.app.stage.addChild(this.reelContainer);
        this.app.stage.addChild(bottom);
       

    }

    buildUI() {
        // Create gradient fill
        // Add play text
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 4,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const margin = (this.app.screen.height - SYMBOL_SIZE * 4) / 2;
        const playText = new Text('Spin the wheels!', style);

        playText.x = Math.round((this.app.screen.width - playText.width) / 2);
        playText.y = this.app.screen.height - margin + Math.round((margin - playText.height) / 2);
        this.app.stage.addChild(playText);

        // Add header text
        const headerText = new Text('PIXI MONSTER SLOTS!', style);

        headerText.x = Math.round((this.app.screen.width - headerText.width) / 2);
        headerText.y = Math.round((margin - headerText.height) / 2);
        // this.app.stage.addChild(headerText);

        // Set the interactivity.
        playText.interactive = true;
        playText.buttonMode = true;
       
        playText.on('pointerdown', () => {
            this.startPlay();
        }); 
    }

    startPlay() {
    
    console.log(this.running, 'RUNNING')
        if (this.running) return;
        this.running = true;

        this.clearPreviousAnimations();


        for (let i = 0; i < 4; i++) {
        /*     const r = this.reels[i];
            const extra = Math.floor(Math.random() * 10);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 500; */
            this.reels[i].index = i;
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 5);
            const target = r.position + 10 * r.symbols.length;
            const time =  (i != 3 ? 2500 : 3000) + i + extra;
            this.tweenTo(r, 'position', target, time, this.backout(0.0), this.updateReelSymbols.bind(this, r), i === this.reels.length - 1 ? this.reelsComplete.bind(this) : null);

        }
    }


    clearPreviousAnimations() {
        for (let i = 0; i < this.reels.length; i++) {
            const symbols = this.reels[i].symbols;
            for (let j = 0; j < symbols.length; j++) {
                /* symbols[j].scale.set(Math.min(SYMBOL_SIZE / symbols[j].texture.width, SYMBOL_SIZE / symbols[j].texture.height));
                symbols[j].position.set(symbols[j].x, symbols[j].y);
                symbols[j].rotation = 0; */

                // Remove "HA" sprite if it exists
                if (this.winLines.length !== 0) {
                for(let int = 0; int < this.winLines.length; int++){
                    this.reelContainer.removeChild(this.winLines[int]);
                }
                this.winLines = [];
                }
            }
        }
    }

    updateReelSymbols(reel) {
        const newPosition = reel.position % reel.symbols.length;
        for (let i = 0; i < reel.symbols.length; i++) {
            const symbol = reel.symbols[i];
            const prevY = symbol.y;
            symbol.y = ((newPosition + i) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            console.log(symbol, newPosition, reel)
            if (symbol.y < 0 && prevY > SYMBOL_SIZE * 2) {
                let ind = reel.index;
                symbol.texture = this.spritesheet.textures[ind != 3 ? this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)] : this.lineMultiplier[Math.floor(Math.random() * this.lineMultiplier.length)]];
                symbol.height = 120;
            }
        }
    }

    reelsComplete() {
        this.running = false;
        this.checkWinningLines();
    }

    checkWinningLines() {
        let totalWinnings = 0;
        let multiplier = MULTIPLIERS[Math.floor(Math.random() * MULTIPLIERS.length)]; // Assume the multiplier is randomly chosen for now.

    
        for (let i = 0; i < this.winningLines.length; i++) {
            const line = this.winningLines[i];
            const symbols = [];
            for (let j = 0; j < line.length; j++) {
                symbols.push(this.reels[j].symbols[line[j]]);
            }
            

            
            
            if (symbols[0].texture === symbols[1].texture && symbols[1].texture === symbols[2].texture) {
                
                const payout = PAYTABLE.wild;
                if (payout) {

                    totalWinnings += payout * multiplier;

                let newLines = [...this.winLines];
                
                const haSprite = new PIXI.Sprite(this.linesTextures[i]);
                // haSprite.x = symbol.x;
                // alert(i)
                haSprite.height = 330;
                haSprite.width = 395;   
                haSprite.y = 10;
                haSprite.x = -22; 
        
                // haSprite.scale.set(Math.min(120 / haSprite.width, 120 / haSprite.height));
                
                this.reelContainer.addChild(haSprite);
                newLines.push(haSprite);
                this.winLines = newLines;
                // symbol.haSprite = haSprite;
                
                
                for (let k = 0; k < symbols.length; k++) {
                    const symbol = symbols[k];
                    // symbol.scale.set(symbol.scale.x * 1.5, symbol.scale.y * 1.5);
                    this.applyShakingAnimation(symbol);

                    
                }

                    // Add "HA" sprite
            

                }
            }
        }
        
        if (totalWinnings > 0) {
            console.log(`Total Winnings: ${totalWinnings}`);
            // You can display the total winnings on the UI here.
        }
        
    }
    
    
    applyShakingAnimation(symbol) {
        const shakeAmplitude = 5;
        const shakeTime = 0.05;
        const shakeSteps = 5;
        const originalX = symbol.x;
        const originalY = symbol.y;

        for (let i = 0; i < shakeSteps; i++) {
            const sign = i % 2 === 0 ? 1 : -1;
            const dx = Math.random() * shakeAmplitude * sign;
            const dy = Math.random() * shakeAmplitude * sign;
            const delay = shakeTime * i;
            this.tweenTo(symbol, 'x', originalX + dx, shakeTime * 1000, this.linear, null, () => {
                if (i === shakeSteps - 1) {
                    this.tweenTo(symbol, 'x', originalX, shakeTime * 1000, this.linear);
                }
            });
            this.tweenTo(symbol, 'y', originalY + dy, shakeTime * 1000, this.linear, null, () => {
                if (i === shakeSteps - 1) {
                    this.tweenTo(symbol, 'y', originalY, shakeTime * 1000, this.linear);
                }
            });
        }
    }

    tweenTo(object, property, target, time, easing, onchange, oncomplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now()
        };

        this.tweening.push(tween);
        return tween;
    }

    updateTweens() {
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < this.tweening.length; i++) {
            const t = this.tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
        }
    }

    // reelsComplete() {
    //     this.running = false;
    // }

    // tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    //     const tween = {
    //         object,
    //         property,
    //         propertyBeginValue: object[property],
    //         target,
    //         easing,
    //         time,
    //         change: onchange,
    //         complete: oncomplete,
    //         start: Date.now(),
    //     };

    //     this.tweening.push(tween);

    //     return tween;
    // }

    backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }

    // update() {
    //     const now = Date.now();
    //     const remove = [];

    //     for (let i = 0; i < this.tweening.length; i++) {
    //         const t = this.tweening[i];
    //         const phase = Math.min(1, (now - t.start) / t.time);

    //         t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
    //         if (t.change) t.change(t);
    //         if (phase === 1) {
    //             t.object[t.property] = t.target;
    //             if (t.complete) t.complete(t);
    //             remove.push(t);
    //         }
    //     }

    //     for (let i = 0; i < remove.length; i++) {
    //         this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
    //     }

    //     // Update the slots
    //     for (let i = 0; i < this.reels.length; i++) {
    //         const r = this.reels[i];
    //         // Update blur filter y amount based on speed
    //         r.blur.blurY = (r.position - r.previousPosition) * 8;
    //         r.previousPosition = r.position;

    //         // Update symbol positions on reel
    //         for (let j = 0; j < r.symbols.length; j++) {
    //             const s = r.symbols[j];
    //             const prevy = s.y;

    //             s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
    //             if (s.y < 0 && prevy > SYMBOL_SIZE) {
    //                 // Detect going over and swap a texture
    //                 s.texture = this.spritesheet.textures[this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]];
    //                 s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
    //                 s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
    //             }
    //         }
    //     }
    // }

    lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }
    
    linear(t) {
        return t;
    }
}
