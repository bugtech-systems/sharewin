// Tile.js

import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

// Tile.js

// import * as PIXI from 'pixi.js';

// export class Tile {
//     constructor(texture, x, y, size) {
//         this.sprite = new PIXI.Sprite(texture);
//         this.sprite.x = x;
//         this.sprite.y = y;
//         this.sprite.anchor.set(0.5);
//         this.size = size; // Store size of the tile
//     }

//     addToContainer(container) {
//         container.addChild(this.sprite);
//     }

//     setTexture(texture) {
//         this.sprite.texture = texture;
//     }
// }

export class Tile {
    constructor(texture, x, y, size) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.set(0.5);
        this.size = size; // Store size of the tile

    }

    addToContainer(container) {
        container.addChild(this.sprite);
    }

    shake() {
        gsap.fromTo(this.sprite, { x: this.sprite.x - 5 }, { x: this.sprite.x + 5, duration: 0.1, yoyo: true, repeat: 5 });
    }

    breathe() {
        gsap.to(this.sprite.scale, { x: 1.1, y: 1.1, duration: 1, yoyo: true, repeat: -1 });
    }

    bounce() {
        gsap.fromTo(this.sprite, { y: this.sprite.y - 10 }, { y: this.sprite.y + 10, duration: 0.5, yoyo: true, repeat: -1 });
    }
    
    setTexture(texture) {
        this.sprite.texture = texture;
    }
    
}
