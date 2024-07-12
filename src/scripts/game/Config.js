import { Game } from "./Game";
import { Tools } from "../system/Tools";

export const Config = {
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    startScene: Game,
    tilesColors: ['blue', 'green', 'orange', 'red', 'pink', 'yellow'],
    board: {
        rows: 3,
        cols: 4
    },
    combinationRules: [[
        {col: 1, row: 0}, {col: 2, row: 0},
    ], [
        {col: 0, row: 1}, {col: 0, row: 2},
    ]]
};