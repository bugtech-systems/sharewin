import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { App } from "../system/App";

const SYMBOL_SIZE = 100;
const REEL_WIDTH = SYMBOL_SIZE;

export class GameBoard {
    constructor(app, textures) {

        this.app = App.app;
        this.reelContainer = new PIXI.Container();
        this.reelContainer.width = REEL_WIDTH * 3
        this.textures = textures;
        this.reels = [];
        this.createReels();
        this.setupReelContainer();
        this.createBackground();
        this.createButton();
        
        const button = new PIXI.Graphics()
        .beginFill(0xcccccc)
        .drawRoundedRect(0, 0, 200, 60, 15)
        .endFill();
    button.x = (this.app.screen.width - button.width) / 2;
    button.y = this.app.screen.height - 100;

    const buttonText = new PIXI.Text('Spin IT', {
        fontSize: 36,
        fill: 0x0,
    });
    buttonText.x = button.width / 2 - buttonText.width / 2;
    // buttonText.y = -100;

    button.interactive = true;
    button.buttonMode = true;
    button.addChild(buttonText);
    button.on('pointerdown', () => this.spinReels.bind(this));
    this.app.stage.addChild(button)
   
    }

    createReels() {
        for (let i = 0; i < 4; i++) {
            const reel = {
                symbols: [],
                position: 0,
                previousPosition: 0,
            };

            for (let j = 0; j < 4; j++) {
                const symbol = new PIXI.Sprite(this.randomTexture());
                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.x = symbol.scale.y = SYMBOL_SIZE / symbol.texture.width;
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                reel.symbols.push(symbol);
            }

            this.reels.push(reel);
        }
    }

    setupReelContainer() {
        this.reels.forEach((reel, index) => {
            this.reelContainer.x = index * REEL_WIDTH;
            reel.symbols.forEach(symbol => this.reelContainer.addChild(symbol));
            this.reelContainer.addChild(this.reelContainer);
        });
        this.reelContainer.y = (this.app.screen.height - SYMBOL_SIZE * 3) / 2;
        this.reelContainer.x = (this.app.screen.width - REEL_WIDTH * 3) / 2;
            this.app.stage.addChild(this.reelContainer);


    }

    createBackground() {
        const background = new PIXI.Graphics()
            .beginFill(0x1099bb)
            .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
            .endFill();
        this.app.stage.addChild(background);
    }

    createButton() {
        const button = new PIXI.Graphics()
            .beginFill(0xcccccc)
            .drawRoundedRect(0, 0, 200, 60, 15)
            .endFill();
        button.x = (this.app.screen.width - button.width) / 2;
        button.y = this.app.screen.height - 100;

        const buttonText = new PIXI.Text('Spin IT', {
            fontSize: 36,
            fill: 0x0,
        });
        buttonText.x = button.width / 2 - buttonText.width / 2;
        buttonText.y = -100;

        button.interactive = true;
        button.buttonMode = true;
        button.addChild(buttonText);
        button.on('pointerdown', () => this.spinReels());
        this.reelContainer.addChild(button)
    }

    spinReels() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        const duration = 5; // Total duration for spinning

        this.reels.forEach((reel, index) => {
            const extra = Math.floor(Math.random() * 3); // Additional spins
            const target = reel.position + 10 + index * 5;
            const time = duration * 1000 + index * 600;

            gsap.to(reel, {
                position: target,
                ease: 'power4.out',
                duration: duration + extra,
                onComplete: () => this.onReelStop(index),
            });
        });
    }

    onReelStop(index) {
        // Handle reel stop logic here
        console.log(`Reel ${index} stopped`);
        if (index === this.reels.length - 1) {
            this.isSpinning = false;
        }
    }

    randomTexture() {
        return this.textures[Math.floor(Math.random() * this.textures.length)];
    }
}

(async () => {
    // Create PIXI Application
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resizeTo: window,
    });

    document.body.appendChild(app.view);

    // Load textures
    await PIXI.Loader.shared.add([
        'https://pixijs.com/assets/eggHead.png',
        'https://pixijs.com/assets/flowerTop.png',
        'https://pixijs.com/assets/helmlok.png',
        'https://pixijs.com/assets/skully.png',
    ]).load();

    const textures = [
        PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
        PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
        PIXI.Texture.from('https://pixijs.com/assets/helmlok.png'),
        PIXI.Texture.from('https://pixijs.com/assets/skully.png'),
    ];

    // Initialize and run the game board
    const gameBoard = new GameBoard(app, textures);

    // Function to bring a sprite to the front
    function bringSpriteToFront(sprite) {
        if (sprite.parent) {
            const parent = sprite.parent;
            parent.removeChild(sprite); // Remove from current parent
            parent.addChild(sprite); // Add back to top of parent
        }
    }

    // Example usage to bring a specific symbol to the front
    const reelIndex = 2; // Example: Bring symbol from reel 2 to front
    const symbolIndex = 1; // Example: Bring symbol at index 1 (second position) to front
    const symbolToBringToFront = gameBoard.reels[reelIndex].symbols[symbolIndex];
    bringSpriteToFront(symbolToBringToFront);
})();
