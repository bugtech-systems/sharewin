import * as PIXI from "pixi.js";
import { Application, Assets, AnimatedSprite, Texture, Spritesheet } from 'pixi.js';
import { App } from "../system/App";
import { Board } from "./Board";
import { Buttons } from "./Buttons";
import { CombinationManager } from "./CombinationManager";
import { Slot } from "./Slot"; // Import Slot class
import spriteImg from './images/1c71b3e03.3ba8b.png';

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

export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.buttons = new Buttons();
        this.board = new Board();
   /*      
        const textures = [
            PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
            PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
            PIXI.Texture.from('https://pixijs.com/assets/helmlok.png'),
            PIXI.Texture.from('https://pixijs.com/assets/skully.png'),
        ]; */

        
        // this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        // this.combinationManager = new CombinationManager(this.board);
        
        // this.removeStartMatches();

        this.spritesheet = new Spritesheet(
            Texture.from(atlasData.meta.image),
            atlasData
        );
        
        

        this.slotMachine = new Slot(App.app);  // Initialize the Slot machine

        this.buttons.container.on('pointerdown', () => {
            this.slotMachine.startPlay();     
            App.app.ticker.add(() =>
                {
                    this.stageHeader.rotation += 0.02;
                });
    }) 
    
            this.spritesheet.parse(() => {
        
            
            this.createBackground();
        
        });
        
        
        this.slotMachine.reelContainer.x = this.bg.x + 40;
        this.slotMachine.reelContainer.height = this.gameStage.height + 20;
        this.slotMachine.reelContainer.y = this.gameStage.y + 55;
        this.container.addChild(this.slotMachine.reelContainer); 

  
        // Spin the slots when the button is clicked

        // this.createBackground();

    /*     this.spritesheet.parse(() => {
            this.createBackground();
        });
         */
        // this.slotMachine.reelContainer.y = 200
        // this.container.y = -100;
    }


    createBackground() {
    
        this.bg = App.sprite("jilibackground");
        this.gameStage = App.sprite("platform");
        this.stageFooter = App.sprite("platform_footer");
        
        this.stageHeader = App.sprite("platform_header");
        this.stageHeaderMultiplier = App.sprite("win_multiplier");
        
        
        // this.bg.height = 1000;
        this.bg.width = window.innerWidth < 1000 ? window.innerWidth : 500;
        this.bg.height = window.innerHeight;
        this.bg.x = window.innerWidth < 1000 ? 0 : (window.innerWidth - this.bg.width) / 2;
        this.bg.y = -(window.innerHeight / 2);
   
        this.stageFooter.width = this.bg.width;
        this.stageFooter.height = window.innerHeight < 1000 ? window.innerHeight : 500;;
        this.stageFooter.y = window.innerHeight - this.stageFooter.height / 2;
        this.stageFooter.x = (window.innerWidth - this.stageFooter.width) / 2;
        
        
        
        
        this.gameStage.width = this.bg.width * 1.2;
        this.gameStage.height =  350;
        this.gameStage.y = (window.innerHeight) / 2.5;
        this.gameStage.x = (window.innerWidth - this.gameStage.width) / 2;

        // this.board.container.x = this.gameStage.x
     
     
        
        this.stageHeader.width = this.gameStage.width * 0.8;
        this.stageHeader.height = this.gameStage.height * 0.15 ;
        this.stageHeader.y =  this.gameStage.y;
        this.stageHeader.x = (window.innerWidth - this.bg.width) / 2;
        
        
 
 



            // this.slotMachine.reelContainer.x = this.gameStage.x * 1.1
            // this.slotMachine.reelContainer.y = this.gameStage.y

        
        ////   Create a mask to hide overflow
          const mask = new PIXI.Graphics();
          mask.beginFill(0x000000);
          mask.drawRect(this.bg.x , 0, this.bg.width, this.bg.height);
          mask.endFill();
  
          this.container.addChild(mask);
          this.container.mask = mask;
          // this.slotMachine.reelContainer.width = this.bg.width
        // this.container.height = window.innerHeight;
        this.container.addChild(this.stageFooter);
        this.container.addChild(this.bg);

        this.container.addChild(this.gameStage);
        
        this.container.addChild(this.stageHeader);
        this.container.addChild(this.buttons.container);

        
    }

    spinHeader(){
            
      
    }

    createSpinButton() {
        const button = new PIXI.Text('Spin', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center',
            stroke: 0x000000,
            strokeThickness: 4
        });

          this.buttons.interactive = true;
          this.buttons.buttonMode = true;
        
        button.x = window.innerWidth / 2;
        button.y = window.innerHeight / 2;
        // this.container.addChild(this.buttons);


    }
}
