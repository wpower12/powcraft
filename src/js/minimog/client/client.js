import * as Phaser from 'phaser';
import { IsometricPlugin} from '@koreez/phaser3-isometric-plugin';

import { TestLevel } from './LevelGenerator.js';

var config = {
    type: Phaser.WEBGL,
    width:  800,
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

function preload () {
    this.load.image('sky',       '/assets/sky.png');
    this.load.image('grass',     '/assets/tile.png');
    this.load.image('dirt',      '/assets/dirt.png');
    this.load.image('stone',     '/assets/stone.png');
    this.load.image('water',     '/assets/water.png');
    this.load.image('towerbase', '/assets/towerbase.png');
    this.load.image('towertop',  '/assets/towertop.png');

    //Doodad Tiles.
    this.load.image('wall_ud', '/assets/wall_updown.png');
    this.load.image('wall_lr', '/assets/wall_leftright.png');
    this.load.image('trees_1', '/assets/trees_1.png');
    this.load.image('trees_2', '/assets/trees_2.png');
    this.load.image('trees_3', '/assets/trees_6.png');
    this.load.image('rocks_1', '/assets/rocks_4.png');
    this.load.image('rocks_2', '/assets/rocks_5.png');        

    this.load.spritesheet('knight',         '/assets/knightwalking.png',       {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('crystal-orange', '/assets/orange_crystal_anim.png', {frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('crystal-blue',   '/assets/blue_crystal_anim.png',   {frameWidth: 32, frameHeight: 32})
}   

function create () {
    this.SIDE_LENGTH = 11;
    this.MAX_H       = 3;
    this.NOISE_SCALE = 20;
    this.SEED        = "42";

    let size = {'depth': 38, 'width': 38, 'height': 8};
    let { width, height } = this.sys.game.canvas;
    let y_os = -(this.SIDE_LENGTH)*size.width/2.5;
    this.add.image(width/2, height/2, 'sky');

    // Initial Sprite Containers. 
    this.waterContainer  = this.add.container(0, y_os);
    this.levelContainer  = this.add.container(0, y_os);
    this.portalContainer = this.add.container(0, y_os);
    this.waterSprites    = []; 
    this.portalSprites   = [];

    this.anims.create({
        key: "spin-orange",
        frameRate: 7,
        frames: this.anims.generateFrameNumbers("crystal-orange", { start: 0, end: 7 }),
        repeat: -1
    });
    this.anims.create({
        key: "spin-blue",
        frameRate: 7,
        frames: this.anims.generateFrameNumbers("crystal-blue", { start: 0, end: 7 }),
        repeat: -1
    });

    this.anims.create({
        key: "walk_ne",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("knight", {start: 0, end: 7}),
        repeat: -1
    });
    this.anims.create({
        key: "walk_nw",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("knight", {start: 8, end: 15}),
        repeat: -1
    });
    this.anims.create({
        key: "walk_se",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("knight", {start: 16, end: 23}),
        repeat: -1
    });
    this.anims.create({
        key: "walk_sw",
        frameRate: 6,
        frames: this.anims.generateFrameNumbers("knight", {start: 24, end: 31}),
        repeat: -1
    });

    // Control which cell in the 'world grid' we are in. 
    this.cell_x = 50000;
    this.cell_y = 50000;
    let cellOffset  = {x: this.cell_x*this.SIDE_LENGTH, y: this.cell_y*this.SIDE_LENGTH}
    this.level_grid = TestLevel(cellOffset, this.SIDE_LENGTH, this.MAX_H, this.NOISE_SCALE, this.SEED);

    // Controls where on this map the unit is.
    this.player_x = Math.floor(this.SIDE_LENGTH/2);
    this.player_y = Math.floor(this.SIDE_LENGTH/2);
    this.player_h = this.level_grid[this.player_x][this.player_y]['height'];

    this.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.handleKeyDown = function(facing){
        switch(facing){
            case 'w':
                return function(){
                    // NE
                    if(this.player_y > 0){
                        this.player_y--;
                        this.player.play('walk_ne')
                        this.updatePlayerSprite()
                    }
                }.bind(this);
            case 'a':
                return function(){
                    // NW
                    if(this.player_x > 0){
                        this.player_x--;
                        this.player.play('walk_nw')
                        this.updatePlayerSprite()
                    }
                }.bind(this);
            case 's':
                return function(){
                    // SW
                    if(this.player_y < this.SIDE_LENGTH-1){
                        this.player_y++;
                        this.player.play('walk_sw')
                        this.updatePlayerSprite()
                    }
                }.bind(this);
            case 'd':
                return function(){
                    // SE
                    if(this.player_x < this.SIDE_LENGTH-1){
                        this.player_x++;
                        this.player.play('walk_se')
                        this.updatePlayerSprite()
                    }
                }.bind(this);
                
        }
    }

    this.key_w.onDown = this.handleKeyDown('w')
    this.key_a.onDown = this.handleKeyDown('a')
    this.key_s.onDown = this.handleKeyDown('s')
    this.key_d.onDown = this.handleKeyDown('d')

    this.generateLevelSprites = function() {
        // let cellOffset = {x: this.cell_x*this.SIDE_LENGTH, y: this.cell_y*this.SIDE_LENGTH}
        // let level_raw = TestLevel(cellOffset, this.SIDE_LENGTH, this.MAX_H, this.NOISE_SCALE, this.SEED);
        
        for (var i = 0; i < this.level_grid.length; i++) {
            for (var j = 0; j < this.level_grid[0].length; j++) {
                let cell = this.level_grid[i][j];

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

                    if(cell['top'] != '' && !cell['portal']){
                        let dd_sprite = this.add.isoSprite(i*size.width, 
                                                           j*size.width, 
                                                           (cell['height'])*size.height,
                                                           cell['top'])
                        this.levelContainer.add(dd_sprite);
                    }

                    if (cell['portal']) {
                        let portalSprite = this.add.isoSprite(i*size.width, 
                                                           j*size.width, 
                                                           (cell['height'])*size.height,
                                                           cell['crystal'])
                        portalSprite.baseZ = (cell['height']+0.75)*size.height;
                        this.portalContainer.add(portalSprite);
                        this.portalSprites.push(portalSprite);
                        portalSprite.play(cell['anim']);
                    }

                }

            }
        }
    }

    this.resetLevelContainers = function() {
        this.waterContainer.destroy();  
        this.levelContainer.destroy(); 
        this.portalContainer.destroy();
        this.waterContainer  = this.add.container(0, y_os);
        this.levelContainer  = this.add.container(0, y_os);
        this.portalContainer = this.add.container(0, y_os);
        this.waterSprites    = []; 
        this.portalSprites   = [];
    }

    this.resetPlayer = function(){
        this.playerContainer.destroy();
        let walk_anim;
        switch(this.playerFacing){
            case 'w':
                this.player_y = this.SIDE_LENGTH-2;
                walk_anim = 'walk_ne';
                break;
            case 'a':
                this.player_x = this.SIDE_LENGTH-2;
                walk_anim = 'walk_nw';
                break;
            case 's':
                this.player_y = 1;
                walk_anim = 'walk_sw';
                break;
            case 'd':
                this.player_x = 1;
                walk_anim = 'walk_se';
                break;
        }

        this.player_h = this.level_grid[this.player_x][this.player_y]['height'];
        this.player   = this.add.isoSprite(this.player_x*size.width-size.width/2,
                                           this.player_y*size.depth-size.depth/2,
                                           this.player_h*size.height-size.height/2,
                                        'knight');
        this.player.play(walk_anim);
        this.playerContainer = this.add.container(0, y_os);
        this.playerContainer.add(this.player);
    }

    this.updatePlayerSprite = function(){
        this.player.isoX = this.player_x*size.width-size.width/2;
        this.player.isoY = this.player_y*size.depth-size.depth/2;
        this.player_h    = this.level_grid[this.player_x][this.player_y]['height'];
        this.player.isoZ = (this.player_h)*size.height-size.height/2;

        console.log("hey!");
    }

    this.generateLevelSprites();
    this.player   = this.add.isoSprite(this.player_x*size.width-size.width/2,
                                         this.player_y*size.depth-size.depth/2,
                                        (this.player_h)*size.height-size.height/2,
                                        'knight');
    this.player.play('walk_se');
    this.playerFacing = 'se';
    this.playerContainer = this.add.container(0, y_os);
    this.playerContainer.add(this.player);

}

function update (time, delta) {
    // no clue where I got this deep magic. I think from one of the iso examples?
    // Makes the z level tween follow a trig surface. 
    this.waterSprites.forEach(function (w) {
        w.isoZ = (-2*Math.sin((this.time.now+(w.isoX*7))*0.004))+(-1*Math.sin((this.time.now+(w.isoY*8))*0.005));
    }.bind(this));

    this.portalSprites.forEach(function (w) {
        w.isoZ = (-2*Math.sin((this.time.now+(w.isoX*7))*0.004))+(-1*Math.sin((this.time.now+(w.isoY*8))*0.005))+w.baseZ;
    }.bind(this));

    // Check if a portal is being stood on. 
    if(this.level_grid[this.player_x][this.player_y]['portal']){
        this.playerFacing = this.level_grid[this.player_x][this.player_y]['facing'];
        switch(this.level_grid[this.player_x][this.player_y]['facing']){
            case 'w':
                this.cell_y--;
                break;
            case 'a':
                this.cell_x--;
                break;
            case 's':
                this.cell_y++;
                break;
            case 'd':
                this.cell_x++;
                break;
            default:
                console.log(this.cell_x, this.cell_y)
        }
        let cellOffset  = {x: this.cell_x*this.SIDE_LENGTH, y: this.cell_y*this.SIDE_LENGTH}
        this.level_grid = TestLevel(cellOffset, this.SIDE_LENGTH, this.MAX_H, this.NOISE_SCALE, this.SEED);

        this.resetLevelContainers();
        this.generateLevelSprites();
        this.resetPlayer();
        this.updatePlayerSprite();
    }

}

 


