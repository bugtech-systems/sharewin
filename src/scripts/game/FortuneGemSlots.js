import * as PIXI from 'pixi.js';

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
const NUM_REELS = 3;
const NUM_ROWS = 3;

export class FortuneGemSlots {
    constructor(app) {
        this.app = app;
        this.reelContainer = new PIXI.Container();
        this.reels = [];
        this.running = false;
        this.symbolTextures = [
            PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
            PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
            PIXI.Texture.from('https://pixijs.com/assets/helmlok.png'),
        ];
        this.multiplierTextures = [
            PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
            PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
            PIXI.Texture.from('https://pixijs.com/assets/helmlok.png')
        ];
        this.winningLines = [
            [0, 0, 0], // top row
            [1, 1, 1], // middle row
            [2, 2, 2], // bottom row
            [0, 1, 2], // diagonal top-left to bottom-right
            [2, 1, 0]  // diagonal bottom-left to top-right
        ];
        this.tweening = [];
        this.setup();
    }

    setup() {
        this.app.stage.addChild(this.reelContainer);
        this.app.stage.x = window.innerWidth / 3
        this.app.stage.y = window.innerHeight - this.app.stage.height
        this.createReels();
        this.createSpinButton();
        this.app.ticker.add(this.updateTweens.bind(this));
    }

    createReels() {


        for (let i = 0; i < NUM_REELS; i++) {
            const reel = new PIXI.Container();
            reel.x = i * REEL_WIDTH;
            this.reelContainer.addChild(reel);

            const symbols = [];
            for (let j = 0; j < 5; j++) {
                const symbol = new PIXI.Sprite(this.symbolTextures[Math.floor(Math.random() * this.symbolTextures.length)]);
                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.set(Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height));
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                symbols.push(symbol);
                reel.addChild(symbol);
            }
            this.reels.push({ container: reel, symbols: symbols, position: 0, previousPosition: 0 });
        }

        const multiplierReel = new PIXI.Container();
        multiplierReel.x = NUM_REELS * REEL_WIDTH;
        // this.reelContainer.addChild(multiplierReel);

        this.multiplierSymbol = new PIXI.Sprite(this.symbolTextures[Math.floor(Math.random() * this.symbolTextures.length)]);
        this.multiplierSymbol.y = Math.round((this.app.screen.height - SYMBOL_SIZE) / 2);
        this.multiplierSymbol.scale.set(Math.min(SYMBOL_SIZE / this.multiplierSymbol.width, SYMBOL_SIZE / this.multiplierSymbol.height));
        this.multiplierSymbol.x = Math.round((REEL_WIDTH - this.multiplierSymbol.width) / 2);
        multiplierReel.addChild(this.multiplierSymbol);
    }

    createSpinButton() {
        const spinButton = new PIXI.Text('Spin', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });
        spinButton.interactive = true;
        spinButton.buttonMode = true;
        spinButton.x = this.app.screen.width / 2 - spinButton.width / 2;
        spinButton.y = this.app.screen.height / 2;
        spinButton.on('pointerdown', this.spinReels.bind(this));
        this.app.stage.addChild(spinButton);
    }

    spinReels() {
        if (this.running) return;
        this.running = true;

        // Clear previous animations
        this.clearPreviousAnimations();

        for (let i = 0; i < this.reels.length; i++) {
           /*  const reel = this.reels[i];
            const extra = Math.floor(Math.random() * 3) + 4;
            const target = reel.position + extra * reel.symbols.length;
            const time = 2500 + i * 1000 + extra;
             */
            // r.position + 10 + i * 5 + extra
            
            const reel = this.reels[i];
            const extra = Math.floor(Math.random() * 5);
            const target = reel.position + 2 * reel.symbols.length;
            const time =  2500 + i + extra;
            
            this.tweenTo(reel, 'position', target, time, this.backout(0.5), this.updateReelSymbols.bind(this, reel), i === this.reels.length - 1 ? this.reelsComplete.bind(this) : null);
        }

        const multiplierTarget = Math.floor(Math.random() * this.multiplierTextures.length);
        this.multiplierSymbol.texture = this.multiplierTextures[multiplierTarget];
    }

    clearPreviousAnimations() {
        for (let i = 0; i < this.reels.length; i++) {
            const symbols = this.reels[i].symbols;
            for (let j = 0; j < symbols.length; j++) {
                symbols[j].scale.set(Math.min(150 / symbols[j].texture.width, 150 / symbols[j].texture.height));
            }
        }
    }

    updateReelSymbols(reel) {
        const SYMBOL_SIZE = 150;
        const newPosition = reel.position % reel.symbols.length;
        for (let i = 0; i < reel.symbols.length; i++) {
            const symbol = reel.symbols[i];
            const prevY = symbol.y;
            symbol.y = ((newPosition + i) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (symbol.y < 0 && prevY > SYMBOL_SIZE * 2) {
                symbol.texture = this.symbolTextures[Math.floor(Math.random() * this.symbolTextures.length)];
            }
        }
    }

    reelsComplete() {
        this.running = false;
        this.checkWinningLines();
    }

    checkWinningLines() {
        for (let i = 0; i < this.winningLines.length; i++) {
            const line = this.winningLines[i];
            const symbols = [];
            for (let j = 0; j < line.length; j++) {
                symbols.push(this.reels[j].symbols[line[j]]);
            }
            if (symbols[0].texture === symbols[1].texture && symbols[1].texture === symbols[2].texture) {
                for (let k = 0; k < symbols.length; k++) {
                    const symbol = symbols[k];
                    symbol.scale.set(symbol.scale.x * 1.5, symbol.scale.y * 1.5);
                    // Apply additional animations like shaking, bouncing, or scaling here
                }
            }
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

    lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }

    backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }
}

// // Initialize PixiJS application
// const app = new PIXI.Application({ width: 800, height: 600 });
// document.body.appendChild(app.view);

// // Create Fortune Gem Slots game instance
// const fortuneGemSlots = new FortuneGemSlots(app);
