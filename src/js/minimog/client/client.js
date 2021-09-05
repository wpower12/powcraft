import * as Phaser from 'phaser';
import { io } from "socket.io-client";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.getElementById('canvas-container'),
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var socket = io();

function preload () {
	this.load.image('sky', 'images/sky.png');
}

function create () {
	this.add.image(400, 300, 'sky');
}

function update () {

}

 


