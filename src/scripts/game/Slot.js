import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { CombinationManager } from "./CombinationManager";

const REEL_WIDTH = 150;
const SYMBOL_SIZE = 150;

const slotTextures = [
    PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
    PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
    PIXI.Texture.from('https://pixijs.com/assets/helmlok.png')
];


export class Slot {
    constructor(container) {
        this.container = new PIXI.Container();
        this.createBackground();
        this.reels = [];
        this.initializeReels();
        this.addInteractivity();
        this.setupReelAnimation();
    }

    createBackground() {
        this.bg = App.sprite("jilibackground");
        this.gameStage = App.sprite("platform");
        this.stageFooter = App.sprite("platform_footer");
        this.stageHeader = App.sprite("platform_header");
        this.stageHeaderMultiplier = App.sprite("win_multiplier");

        this.bg.width = window.innerWidth < 1000 ? window.innerWidth : 500;
        this.bg.height = window.innerHeight;
        this.bg.x = window.innerWidth < 1000 ? 0 : (window.innerWidth - this.bg.width) / 2;
        this.bg.y = -(window.innerHeight / 2);

        this.stageFooter.width = window.innerWidth < 1000 ? window.innerWidth : 500;
        this.stageFooter.height = window.innerHeight / 4;
        this.stageFooter.y = window.innerHeight - this.stageFooter.height;
        this.stageFooter.x = (window.innerWidth - this.stageFooter.width) / 2;

        this.gameStage.width = this.bg.width * 1.2;
        this.gameStage.height = this.bg.height / 2.5;
        this.gameStage.y = (this.bg.height - this.stageFooter.height) / 2;
        this.gameStage.x = (window.innerWidth - this.gameStage.width) / 2;

        this.stageHeader.width = this.gameStage.width * 0.8;
        this.stageHeader.height = this.gameStage.height * 0.15;
        this.stageHeader.y = (this.bg.height - this.stageFooter.height) / 2;
        this.stageHeader.x = (window.innerWidth - this.bg.width) / 2;

 /*            const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(this.bg.x, 0, this.bg.width, this.bg.height);
        mask.endFill(); */

        // this.container.addChild(mask);
        // this.container.mask = mask;
        this.container.addChild(this.bg);
        this.container.addChild(this.stageFooter);
        this.container.addChild(this.gameStage);
        this.container.addChild(this.stageHeader);
    }

    initializeReels() {




        for (let i = 0; i < 4; i++) {
            const reelContainer = new PIXI.Container();
            reelContainer.x = i * REEL_WIDTH;
            this.reels.push({ blur: {}, container: reelContainer, symbols: [], position: 0, previousPosition: 0 });

            for (let j = 0; j < 4; j++) {
                const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                this.reels[i].symbols.push(symbol);
                reelContainer.addChild(symbol);
            }

            this.container.addChild(reelContainer);
        }
    }

    addInteractivity() {
        const bottom = new PIXI.Graphics().beginFill(0x0).drawRect(0, this.gameStage.height + 10, this.gameStage.width, this.stageFooter.height - 10);
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff'],
            stroke: { color: 0x4a1850, width: 5 },
            dropShadow: {
                color: 0x000000,
                angle: Math.PI / 6,
                blur: {blurY: 4},
                distance: 6,
            },
            wordWrap: true,
            wordWrapWidth: 440,
        });
        const playText = new PIXI.Text('Spin the wheels!', style);
        playText.x = Math.round((bottom.width - playText.width) / 2);
        playText.y = this.gameStage.height + 10 + Math.round((this.stageFooter.height - 10 - playText.height) / 2);
        bottom.addChild(playText);

        bottom.interactive = true;
        bottom.cursor = 'pointer';
        bottom.on('pointerdown', () => {
            this.startPlay();
        });

        this.container.addChild(bottom);
    }

    setupReelAnimation() {
        this.tweening = [];
        App.app.ticker.add(() => {
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
        });
        App.app.ticker.add(() => {
            for (let i = 0; i < this.reels.length; i++) {
                const r = this.reels[i];
                r.blur.blurY = (r.position - r.previousPosition) * 8;
                r.previousPosition = r.position;

                for (let j = 0; j < r.symbols.length; j++) {
                    const s = r.symbols[j];
                    const prevy = s.y;
                    s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                    if (s.y < 0 && prevy > SYMBOL_SIZE) {
                        s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                        s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                        s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                    }
                }
            }
        });
    }

    startPlay() {
        if (this.running) return;
        this.running = true;

        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            this.tweenTo(r, 'position', target, time, this.backout(0.5), null, i === this.reels.length - 1 ? this.reelsComplete.bind(this) : null);
        }
    }

    reelsComplete() {
        this.running = false;
        // Check win conditions or perform any other actions here
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
            start: Date.now(),
        };

        this.tweening.push(tween);
        return tween;
    }

    lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }

    backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }
}
