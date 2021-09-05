import vmath from './vmath.js';

//'Gravity' Point Source 
var PointSource = function (xi, yi, radius, power) {
    var center, radius, power, x, y, w, h;
    //Basic Fields
    this.center = vmath.newvector(xi, yi);
    this.radius = radius;
    this.G = 0.15;
    //for drawing
    this.power = power;
    this.powerscale = 3;
    this.n = this.power * this.powerscale;
    this.b = 2;
    this.a = 6 * (this.radius - this.n) / (this.n * (this.n + 1) * (2 * this.n + 1));
    //QT Fields
    this.x = this.center.x - radius; //Top Left
    this.y = this.center.y - radius;
    this.w = 2 * radius;
    this.h = 2 * radius;
};

PointSource.prototype = {
    inRange: function (disc) {
        return (Math.abs(vmath.length(vmath.sub(disc.center, this.center))) < this.radius + disc.radius);
    },
    applyForce: function (disc) {
        /* The point source applies a force on the line from the point to
         * the center of the disc.  this force changes the velocity by a 
         * set amount each frame.
         * 
         * The amount of velocity subtracted from each component is a function of
         * distance and the 'mass' of the point source
         * 
         * V' = V - c1*f(r)*C 
         * 
         * Gonna go with linear, not quadratic,  over d^2 is boring.
         */
        var dist = vmath.length(vmath.sub(disc.center, this.center));
        var factor = this.G * this.power * disc.radius / (dist); //c1*f(r)
        var vprime = vmath.sub(disc.vel, vmath.times(vmath.sub(disc.center, this.center), factor)); //V - factor*C
        disc.setVel(vprime);
    },
    draw: function (screen) {
        var s = function (x, a, b) {
            return a * x * x + b;
        };
        var sums = function (x, a, b, i, j) {
            //Series a*i^2+b, a and b defined in pointsource.
            //sum_(x=n)^i x^2 = -1/6 (i-(1+j)) (2 i^2-(1-2 j) i-(2-j)) = S
            var S = (-1 / 6) * (i - 1 - j) * (2 * i * i - i + 2 * j * i - 2 + j);
            var ret = Math.abs((i - j) * b + a * S);
            return ret > 0 ? ret : 0;
        };
        var dist = function (p, i) {
            //Should return the loction of the ith circle of point p
            //higher power = more circles, closer together
            //lower power = less circles, spaced further apart
            return s(i, p.a, p.b) + sums(i, p.a, p.b, 0, i - 1);
        };
        for (var i = 1; i < this.n + 1; i++) {
            var c = Math.floor(255 - 255 * 0.75 * (1 - (dist(this, i) / this.radius)));
            if (c > 220)
                c = 220;
            screen.strokeStyle = "rgb(" + c + "," + c + "," + c + ")";
            screen.beginPath();
            screen.arc(this.center.i, this.center.j, dist(this, i), 0, 2 * Math.PI, true);
            screen.stroke();
        }
    }
};

export default PointSource;