import vmath from './vmath.js';
import QUAD  from './Quad.js';
import Disc  from './Disc.js';
import PointSource  from './PointSource.js';
import InputHandler from './InputHandler.js';

//Simulation Class
var Simulation = function () {

    this.canvas = document.getElementById('forcecanvas');
    this.screen = this.canvas.getContext('2d');
    this.screenSize = {x: this.canvas.width, y: this.canvas.height};
    //Setting up the container for all the discs and point sources
    this.discs = [];
    this.points = [];
    //Statistics Fields
    this.frames = [];
    this.frame = 0;
    this.fsum = 0;
    this.fave = 0;
    this.delta = 1;
    this.last = new Date().getTime();
    this.fps = 60;

    this.slowChecks = 0;
    this.checkCounter = 0;
    this.energy = 0;
    for (var i = 0; i < 100; i++) {
        this.frames.push(0);
    }
    this.drawInfo = false;
    //Starting elements
    this.points.push(new PointSource(197.5, 167.2, 72, 1.8));
    this.discs.push(new Disc(337.5, 93, 8, -1.09, 0.9));
    //Create a quadtree for quick collision detection 
    var args = {
        x: 0,
        y: 0,
        w: this.canvas.width,
        h: this.canvas.height,
        maxChildren: 3
    };
    this.tree = QUAD.init(args);
    this.showGrid = false;
    //GifMaker for saving clips
    // this.gif = new GifMaker(this.screen);
    // this.recording = false;
    //Holds all the event handlers and their functions
    //  -makes it easier to animate control events
    this.input = new InputHandler(this);
    //tick() is the main 'game loop', requestAnimationFrame calls tick 
    var self = this;
    var tick = function () {
        self.update();
        self.draw();
        self.input.draw(); //For fancy control animations! woot
        // self.gif.update();
        requestAnimationFrame(tick);
    };
    //First call to tick to start things off.
    tick();
};
Simulation.prototype = {
    update: function () {
        this.tree.clear();
        this.tree.insert(this.discs);
        this.checkCounter = 0;
        this.energy = 0;
        //For each disc
        for (var i = 0; i < this.discs.length; i++) {
            var b, nearby, collided = false;
            b = this.discs[i];
            //For all nearby discs
            nearby = this.tree.retrieve(b, function (item) {
                if (notSame(b, item)) {
                    this.checkCounter++;
                    collided = resolveCollision(b, item);
                }
            }, this);
            if (!collided) {
                //If resolveCollision doesnt detect a hit, normal update
                b.update(this.screenSize);
            }
            //Add energy to total.
            this.energy += b.energy();
        }

        this.tree.clear();
        this.tree.insert(this.discs);
        //For each Point, find nearby discs and act on them
        for (var i = 0; i < this.points.length; i++) {
            var p, nearby;
            p = this.points[i];
            //For all nearby discs
            nearby = this.tree.retrieve(p, function (item) {
                //console.log(item);
                if (p.inRange(item)) {
                    p.applyForce(item);
                }
            }, this);
        }
        if (this.drawInfo) {
            this.updateStats();
        }
    },
    updateStats: function () {
        this.delta = (new Date().getTime() - this.last) / 1000;
        this.last = new Date().getTime();
        this.fps = 1 / this.delta;
        this.slowChecks = this.discs.length * (this.discs.length - 1);
        //100 Frame Average - FPS
        if (!isNaN(this.frames[this.frame])) {
            this.fsum -= this.frames[this.frame];
        }
        if (!isNaN(this.fps)) {
            this.fsum += this.fps;
            this.frames[this.frame] = this.fps;
        } else {
            this.frames[this.frame] = 0;
        }
        this.fave = (this.fsum / 100).toFixed(2);
        this.frame = (this.frame + 1) % 100;
    },
    draw: function () {
        this.screen.clearRect(0, 0, this.screenSize.x, this.screenSize.y);
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].draw(this.screen);
        }
        for (var i = 0; i < this.discs.length; i++) {
            this.discs[i].draw(this.screen);
        }
        if (this.showGrid) {
            drawQuadtree(this.tree.root, this.screen);
        }
        if (this.drawInfo) {
            this.drawStats(this.screen);
        }
        this.input.draw();
    },
    drawStats: function (screen) {
        var d = 18;
        screen.fillStyle = "Grey";
        screen.font = "normal 14pt courier";
        screen.fillText("         N: " + this.discs.length, 10, d * 1);
        screen.fillText("       FPS: " + (this.fps).toFixed(1), 10, d * 2);
        screen.fillText("  100F Ave: " + this.fave, 10, d * 3);
        screen.fillText("N^2 Checks: " + this.slowChecks, 10, d * 4);
        screen.fillText(" QT Checks: " + this.checkCounter, 10, d * 5);
        screen.fillText("|E| of System: " + this.energy, 10, d * 6);
    }
};

var resolveCollision = function (b1, b2) {
//Setting up vectors
    var C = vmath.sub(b1.center, b2.center);
    var movement = vmath.sub(b2.vel, b1.vel);
    var long = vmath.length(movement);
    var dist = vmath.length(C) - b1.radius - b2.radius;
    var lenM = vmath.length(movement);
    //First Test - Radii vs Movement vector
    if (lenM < dist) {
        return false;
    }

    var movenorm = vmath.norm(movement);
    var D = vmath.dot(C, movenorm);
    //Move-towards test
    if (D <= 0) {
        return false;
    }

    var lenC = vmath.length(C);
    var F = lenC * lenC - D * D;
    var fsumRad2 = (b1.radius + b2.radius) * (b1.radius + b2.radius);
    //Second Move Test   
    if (F >= fsumRad2) {
        return false;
    }

    var T = fsumRad2 - F;
    if (T < 0) {
        return false;
    }
    var distance = D - Math.sqrt(T);
    //Movement length test
    if (vmath.length(movement) < distance) {
        return false;
    }

    var short = vmath.length(vmath.norm(movement), distance);
    var ratio = (short / long);
    //New positions
    b1.setPos(vmath.add(b1.center, vmath.times(b1.vel, ratio)));
    b2.setPos(vmath.add(b2.center, vmath.times(b2.vel, ratio)));
    // We use the new disc locations to calculate the new velocity vectors
    var n = vmath.norm(vmath.sub(b2.center, b1.center));
    var a1 = vmath.dot(b1.vel, n);
    var a2 = vmath.dot(b2.vel, n);
    var adif = a1 - a2;
    var rad = b1.radius + b2.radius;
    var p = 2 * (adif / rad);
    //Set new velocities
    b1.setVel(vmath.sub(b1.vel, vmath.times(n, p * b2.radius)));
    b2.setVel(vmath.add(b2.vel, vmath.times(n, p * b1.radius)));
    return true;
};

var notSame = function (b1, b2) {
    var dx, dy;
    dx = b1.center.i - b2.center.i;
    dy = b1.center.j - b2.center.j;
    return !((dx == 0) && (dy == 0));
};

var drawQuadtree = function (node, screen) {
    var nodes = node.getNodes(), i;
    if (nodes) {
        for (i = 0; i < nodes.length; i++) {
            drawQuadtree(nodes[i], screen);
        }
    }
    screen.beginPath();
    screen.rect(node.x, node.y, node.w, node.h);
    screen.strokeStyle = 'grey';
    screen.stroke();
    screen.closePath();
};

export default Simulation;