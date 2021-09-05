import vmath from './vmath.js';

var Disc = function (xi, yi, radius, xv, yv) {
    var center, radius, vel, x, y, w, h;
    this.center = vmath.newvector(xi, yi);
    this.radius = radius;
    this.vel = vmath.newvector(xv, yv);
    //To be used with the quad tree, need the following available fields
    this.x = this.center.i - radius; //Top Left
    this.y = this.center.j - radius;
    this.w = 2 * radius;
    this.h = 2 * radius;
};
Disc.prototype = {
    update: function (screenSize) {
        //Check if hitting walls
        //x
        if (this.center.i + this.vel.i <= this.radius || this.center.i + this.radius + this.vel.i >= screenSize.x) {
            this.vel.i = -1 * this.vel.i;
        } else {
            this.center.i += this.vel.i;
        }
        //y
        if (this.center.j + this.vel.j <= this.radius || this.center.j + this.radius + this.vel.j >= screenSize.y) {
            this.vel.j = -1 * this.vel.j;
        } else {
            this.center.j += this.vel.j;
        }
        //Update quad tree fields
        this.x = this.center.i - this.radius;
        this.y = this.center.j - this.radius;
    },
    setVel: function (a) {
        this.vel.i = a.i;
        this.vel.j = a.j;
    },
    setPos: function (a) {
        this.center.i = a.i;
        this.center.j = a.j;
        this.x = a.i - this.radius;
        this.y = a.j - this.radius;
    },
    energy: function () {
        return Math.pow(this.vel.i, 2) + Math.pow(this.vel.j, 2);
    },
    draw: function (screen) {
        screen.beginPath();
        screen.arc(this.center.i, this.center.j, this.radius, 0, 2 * Math.PI, false);
        screen.fillStyle = 'gray';
        screen.fill();
        screen.beginPath();
        screen.arc(this.center.i, this.center.j, this.radius, 0, 2 * Math.PI, false);
        screen.lineWidth = 2;
        screen.strokeStyle = 'black';
        screen.stroke();
    }
};

export default Disc;