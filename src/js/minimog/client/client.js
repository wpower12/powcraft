import * as Phaser from 'phaser';
import { IsometricPlugin} from '@koreez/phaser3-isometric-plugin';

import { io } from "socket.io-client";
import { TestLevel } from './LevelGenerator.js';


var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    parent: document.getElementById('canvas-container'),
    plugins: {
        global: [
          { key: 'IsometricPlugin', plugin: IsometricPlugin, start: true },
        ],
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var socket = io();

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('grass',  'assets/tile.png');
    this.load.image('dirt',   'assets/dirt.png');
    this.load.image('stone',  'assets/stone.png');
    this.load.image('water',  'assets/water.png');
    this.load.image('towerbase', 'assets/towerbase.png');
    this.load.image('towertop',  'assets/towertop.png');

    //Doodad Tiles.
    this.load.image('wall_ud', 'assets/wall_updown.png');
    this.load.image('wall_lr', 'assets/wall_leftright.png');
    this.load.image('trees_1', 'assets/trees_1.png');
    this.load.image('trees_2', 'assets/trees_2.png');
    this.load.image('trees_3', 'assets/trees_6.png');
    this.load.image('rocks_1', 'assets/rocks_4.png');
    this.load.image('rocks_2', 'assets/rocks_5.png');
    this.load.spritesheet('player_ne', 'assets/knight_ne.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('player_nw', 'assets/knight_nw.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('player_se', 'assets/knight_se.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('player_sw', 'assets/knight_sw.png', {frameWidth: 64, frameHeight: 64});

    // this.load.atlas( 'knight',  'assets/knightwalking.png', 'assets/knightwalking.json');
    this.load.spritesheet('knight', 'assets/knightwalking.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('crystal', 'assets/orange_crystal_anim.jpg', {frameWidth: 32, frameHeight: 32})
}   

function create () {
    const SIDE_LENGTH = 10;
    const MAX_H = 4;
    let size = {'depth': 38, 'width': 38, 'height': 8};
    let { width, height } = this.sys.game.canvas;
    let y_os = -(SIDE_LENGTH)*size.width/2.5;
    let level_raw = TestLevel(SIDE_LENGTH, MAX_H);

    this.add.image(width/2, height/2, 'sky');


    // Generating Sprites from level data.
    this.waterContainer = this.add.container(0, y_os);
    this.waterSprites = [];
    this.levelContainer = this.add.container(0, y_os);

    for (var i = 0; i < level_raw.length; i++) {
        for (var j = 0; j < level_raw[0].length; j++) {
            let cell = level_raw[i][j];

            if(cell['height'] == 0){
                let new_water = this.add.isoSprite(i*size.width, 
                                                   j*size.depth, 
                                                   0, 
                                                   'water');
                this.waterContainer.add(new_water);
                this.waterSprites.push(new_water);
            } else {
                for (var h = 0; h < cell['height']; h++) {
                    let new_sprite = this.add.isoSprite(i*size.width, 
                                                        j*size.depth, 
                                                        h*size.height, 
                                                        cell['tile']);
                    this.levelContainer.add(new_sprite);
                }
                if(cell['top'] != ''){
                    let dd_sprite = this.add.isoSprite(i*size.width, 
                                                       j*size.width, 
                                                       (cell['height'])*size.height,
                                                       cell['top'])
                    this.levelContainer.add(dd_sprite);
                }

            }

        }
    }


}

function update (time, delta) {

    // no clue where I got this deep magic. I think from one of the examples?
    this.waterSprites.forEach(function (w) {
        w.isoZ = (-2*Math.sin((this.time.now+(w.isoX*7))*0.004))+(-1*Math.sin((this.time.now+(w.isoY*8))*0.005));
    }.bind(this));
}

 


