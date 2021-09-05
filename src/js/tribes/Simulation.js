import Unit          from './Unit.js';
import {ColorPicker} from './Utils.js';
 

class Simulation {

    constructor  (canvas){
        this.canvas = canvas;
        this.scale = 8;
        this.size = this.getSize();
        this.ctx = this.canvas.getContext('2d');
        this.units = [];
        this.fps = 10;
        this.fillfactor = 50;
        this.look = 2;

        // Setup input handler
        // this.input = new InputHandler(this);
        // this.input.setFieldsFPS($('#fpsfield'), $('#fps'))
        //         .setFieldsFill($('#fillfield'), $('#fill'))
        //         .setFieldsScale($('#scalefield'), $('#scale'))
        //         .setFieldsLookR($('#lookfield'), $('#look'));
        // this.input.attachInputs();

        this.reset();

        //Main loop
        self = this;
        var tick = function () {
            self.update();
            self.draw();
            setTimeout(function () {
                requestAnimationFrame(tick);
            }, 1000 / self.fps);
            //console.log(1);
        };
        tick(); //Start the show
    }

    update () {
        //Update Nearest Neighbors
        this.clearWorld();
        var u;
        for (var i = 0; i < this.units.length; i++) {
            u = this.units[i];
            this.world[u.loc.x][u.loc.y] = u;
        }

        //Update each unit
        for (var unit = 0; unit < this.units.length; unit++) {
            var u = this.units[unit];

            var friends = true;
            var alpha = true;
            var target;
            var targets = [];

            //Get nearest neighbors
             for (var i = -1 * this.look; i < this.look + 1; i++) {
                for (var j = -1 * this.look; j < this.look + 1; j++) {
                    if (!(i == 0 && j == 0)) {
                        var xc = u.loc.x + i;
                        var yc = u.loc.y + j;
                        if (xc >= 0 && yc >= 0 && xc < this.size.x && yc < this.size.y) {
                            var c = this.world[xc][yc];
                            if (c instanceof Unit) {
                                if (c.tribe != u.tribe) {
                                    friends = false;
                                    //If really close, make them the target
                                    if ((i > -2) && (i < 2) && (j > -2) && (j < 2)) {
                                        target = c;
                                        targets.push(c);
                                    }
                                } else if (c.str > u.str) {
                                    alpha = false;
                                }
                            }
                        }
                    }
                }
            }

            //If everyone is on your team and everyone is less str than you, revolt
            if (friends && alpha) {
                //Revolt
                u.tribe = u.id;
            } else if (target != 0) {
                var tar;
                for (var t = 0; t < targets.length; t++) {
                    tar = targets[t];
                    //Attack target - Bigger strength transfers tribeID
                    if (tar.str > u.str) {
                        u.tribe = tar.tribe;
                    } else if (tar.str < u.str) {
                        tar.tribe = u.tribe;
                    } else {
                        //Equal case is random
                        var r = Math.floor(Math.random() * 2);
                        if (r == 0) {
                            tar.tribe = u.tribe;
                        } else {
                            u.tribe = tar.tribe;
                        }
                    }
                }
            }
            //Everyone walks each loop.
            var s = Math.floor(Math.random() * 2);
            var t = (Math.floor(Math.random() * 2) * 2) - 1;
            var deltax = 0;
            var deltay = 0;
            if (s == 0) {
                deltax = t;
            } else {
                deltay = t;
            }
            //u.attemptMove(deltax, deltay, world);
            var nx = u.loc.x + deltax;
            var ny = u.loc.y + deltay;
            //if (inside(nx, ny, world) && empty(nx, ny, world)) {
            if ((nx >= 0) && (nx < this.size.x) && (ny >= 0) && (ny < this.size.y) && (this.world[nx][ny] === 0)) {
                this.world[u.loc.x][u.loc.y] = 0;
                this.world[nx][ny] = u;
                u.loc.x = nx;
                u.loc.y = ny;
            }
        }
    }

    draw () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        //Draw each unit
        for (var i = 0; i < this.units.length; i++) {
            var val = this.units[i];
            var c = this.colors.get(val.tribe);
            this.ctx.beginPath();
            this.ctx.fillStyle = c;
            this.ctx.rect(this.size.x0 + this.scale * val.loc.x + 2, this.size.y0 + this.scale * val.loc.y + 2, this.scale - 3, this.scale - 3);
            this.ctx.fill();
        }
    }

    drawGrid () {
        // this.ctx.fillStyle("grey");
        this.ctx.strokeStyle = "darkgrey";
        this.ctx.lineWidth = 1;
        for (var i = 0; i < this.size.x + 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.scale + this.size.x0 + 0.5, this.size.y0 + 0.5);
            this.ctx.lineTo(i * this.scale + this.size.x0 + 0.5, this.size.y0 + this.size.h + 0.5);
            this.ctx.stroke();
        }
        for (var j = 0; j < this.size.y + 1; j++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.size.x0 + 0.5, j * this.scale + this.size.y0 + 0.5);
            this.ctx.lineTo(this.size.x0 + this.size.w + 0.5, j * this.scale + this.size.y0 + 0.5);
            this.ctx.stroke();
        }
    }

    getSize () {
        //Return 0 point of drawing grid, width of grid in pixels/cells
        var width = this.canvas.width;
        var height = this.canvas.height;
        var xn = Math.floor((width-this.scale) / this.scale);
        var yn = Math.floor((height-this.scale) / this.scale);
        return {
            x: xn,
            y: yn,
            w: xn * this.scale,
            h: yn * this.scale,
            x0: (width - xn * this.scale) / 2,
            y0: (height - yn * this.scale) / 2
        };
    }

    clearWorld () {
        this.world = [];
        for (var i = 0; i < this.size.x; i++) {
            this.world[i] = [];
            for (var j = 0; j < this.size.y; j++) {
                this.world[i][j] = 0;
            }
        }
    }

    reset () {
        //Update Size
        this.size = this.getSize();
        this.clearWorld();
        this.units = [];

        //Fill new units
        var n = this.size.x * this.size.y * this.fillfactor * 0.01;
        this.colors = new ColorPicker(n);   //Used later when drawing units

        for (var i = 1; i < n + 1; i++) {
            var collision = true;
            while (collision) {
                var xr = Math.floor(Math.random() * this.size.x);
                var yr = Math.floor(Math.random() * this.size.y);
                var str = Math.floor(Math.random() * 5);
                if (!(this.world[xr][yr] instanceof Unit)) {
                    this.units.push(new Unit(i, str, i, xr, yr));
                    this.world[xr][yr] = this.units[i - 1];
                    collision = false;
                }
            }
        }
    }
}

export default Simulation;