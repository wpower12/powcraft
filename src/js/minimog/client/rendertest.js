import * as Phaser from 'phaser';
import {IsometricPlugin} from '@koreez/phaser3-isometric-plugin';

import { io } from "socket.io-client";

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
    this.load.image('tiles',   'assets/iso-64x64-outside.png');
    this.load.image('tiles2',  'assets/iso-64x64-building.png');
    this.load.image('cube',    'assets/cube.png');
    this.load.atlas('soldier', 'assets/soldier.png', 'assets/soldier.json');
    this.load.atlas('knight',  'assets/knight.png', 'assets/knight.json');
    this.load.tilemapTiledJSON('map', 'assets/isorpg.json');
    this.load.bitmapFont('myFont', 'assets/myFont.png','assets/myFont.xml');

}

function create () {
    var map = this.add.tilemap('map');

    console.log(map);

    var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
    var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

    var layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
    var layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
    var layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
    var layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
    var layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);

    var cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setZoom(2);

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.03,
        drag: 0.0008,
        maxSpeed: 0.5
    };

    this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.knight = this.add.sprite(500, 500, 'knight');

    this.knight.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('knight', {prefix: 'idle/frame000', start: 0, end: 5}),
        frameRate: 12,
        repeat: -1
    });
    this.knight.anims.create({
        key: 'guard',
        frames: this.anims.generateFrameNames('knight', {prefix: 'guard/frame000', start: 0, end: 5}),
        frameRate: 12,
        repeat: -1
    })
    this.knight.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNames('knight', {prefix: 'run/frame000', start: 0, end: 7}),
        frameRate: 6,
        repeat: -1
    })

    this.knight.play('idle');


    this.isoCube = this.add.isoSprite(100, 0, 0, 'cube');
    this.isoBitmapText = this.add.isoBitmapText(0, 0, 0, 'myFont', 'Hello', 16);

    this.cubeImage = this.add.image(100, 0, 'cube');
    this.cubeImage.setScale(1.3);

    this.isoContainer = this.add.isoContainer(-200, 0, 0);
    this.isoContainer.add(this.isoCube);
    
    this.classicContainer = this.add.container(0, 0);
    this.classicContainer.add(this.isoCube);
}

function update (time, delta) {
    this.cameraControls.update(delta);
}

 


