import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Board } from "./Board";
import { Buttons } from "./Buttons";
import { CombinationManager } from "./CombinationManager";
    
export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.buttons = new Buttons();
        this.board = new Board();
        
        
        
        
        
        
        this.createBackground();
        
        
        this.container.addChild(this.board.container);
        this.container.addChild(this.buttons.container);
        
      

        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        this.combinationManager = new CombinationManager(this.board);
        
        this.removeStartMatches();
        // this.ajustPosition();



    }

    removeStartMatches() {
        let matches = this.combinationManager.getMatches();

        while(matches.length) {
            this.removeMatches(matches);

            const fields = this.board.fields.filter(field => field.tile === null);

            fields.forEach(field => {
                this.board.createTile(field);
            });

            matches = this.combinationManager.getMatches();
        }
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
   
        this.stageFooter.width = window.innerWidth < 1000 ? window.innerWidth : 500;
        this.stageFooter.height = window.innerHeight / 4    ;
        this.stageFooter.y = window.innerHeight - this.stageFooter.height ;
        this.stageFooter.x = (window.innerWidth - this.stageFooter.width) / 2;
        
        
        
        console.log(window.width, window.innerWidth, 'width')
        
        this.gameStage.width = this.bg.width * 1.2;
        this.gameStage.height =  this.bg.height / 2.5;
        this.gameStage.y = ((this.bg.height - this.stageFooter.height)/ 2);
        this.gameStage.x = (window.innerWidth - this.gameStage.width) / 2;

        this.board.container.x = this.gameStage.x
     
     
        
        this.stageHeader.width = this.gameStage.width * .8;
        this.stageHeader.height = this.gameStage.height * 0.15 ;
        this.stageHeader.y =  ((this.bg.height - this.stageFooter.height) / 2);
        this.stageHeader.x = (window.innerWidth - this.bg.width) / 2;
        
   /*      
            App.app.ticker.add(() =>
            {
                this.stageHeader.rotation += 0.02;
            });

 */




        
          // Create a mask to hide overflow
        //   const mask = new PIXI.Graphics();
        //   mask.beginFill(0x000000);
        //   mask.drawRect(this.bg.x , 0, this.bg.width, this.bg.height);
        //   mask.endFill();
  
        //   this.container.addChild(mask);
        //   this.container.mask = mask;
  
   
        
        this.container.addChild(this.bg);
        this.container.addChild(this.stageFooter);
        this.container.addChild(this.gameStage);
        this.container.addChild(this.stageHeader);
    
    }

    onTileClick(tile) {
        if (this.disabled) {
            return;
        }
        if (this.selectedTile) {
            // select new tile or make swap
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection(tile);
                this.selectTile(tile);
            } else {
                this.swap(this.selectedTile, tile);
            }


        } else {
            this.selectTile(tile);
        }
    }

    swap(selectedTile, tile, reverse) {
        this.disabled = true;
        selectedTile.sprite.zIndex = 2;

        selectedTile.moveTo(tile.field.position, 0.2);

        this.clearSelection();

        tile.moveTo(selectedTile.field.position, 0.2).then(() => {
            this.board.swap(selectedTile, tile);

            if (!reverse) {
                const matches = this.combinationManager.getMatches();
                if (matches.length) {
                    this.processMatches(matches);
                } else {
                    this.swap(tile, selectedTile, true);
                }
            } else {
                this.disabled = false;
            }
        });
    }

    removeMatches(matches) {
        matches.forEach(match => {
            match.forEach(tile => {
                tile.remove();
            });
        });
    }

    processMatches(matches) {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }

    onFallDownOver() {
        const matches = this.combinationManager.getMatches();

        if (matches.length) {
            this.processMatches(matches)
        } else {
            this.disabled = false;
        }
    }

    addTiles() {
        return new Promise(resolve => {
            const fields = this.board.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach(field => {
                const tile = this.board.createTile(field);
                tile.sprite.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) {
                        resolve();
                    }
                });
            });
        });``
    }

    processFallDown() {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);
    
                    if (!field.tile) {
                        ++started;
                        this.fallDownTo(field).then(() => {
                            ++completed;
                            if (completed >= started) {
                                resolve();
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField) {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);

            if (fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                return fallingTile.fallDownTo(emptyField.position);
            }
        }

        return Promise.resolve();
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedTile.field.select();
    }
    
    
    ajustPosition() {
        this.fieldSize = this.fields[0].sprite.width;
        this.height = this.rows * this.fieldSize;
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (400 + window.innerHeight - this.height) / 2 + this.fieldSize / 2;
    }

}