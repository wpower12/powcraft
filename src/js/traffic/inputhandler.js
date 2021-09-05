import Road from './road.js';
import Car from './car.js';
import Intersection from './intersection.js';

var DRIVERS = ["Normal", "Slow", "Crazy"];

class InputHandler {
	constructor(sim){
	    this.sim = sim;
	    
        this.btn_car   = document.getElementById('btn-car');
        this.btn_road  = document.getElementById('btn-road');
        this.btn_inter = document.getElementById('btn-inter');
        this.btn_sim   = document.getElementById('btn-sim');

        this.btn_connect = document.getElementById('btn-connect');
        this.btn_delete  = document.getElementById('btn-delete');

        this.el_ctrl_car   = document.getElementById('car-toolbar');
        this.el_ctrl_road  = document.getElementById('road-toolbar');
        this.el_ctrl_inter = document.getElementById('inter-toolbar');
        this.el_ctrl_sim   = document.getElementById('sim-toolbar');

        this.$speed     = document.getElementById('car-in-speed');
        this.$color     = document.getElementById('car-in-color');
        this.$roadlanes = document.getElementById('road-in-lanes');
        this.$roador    = document.getElementById('road-in-orient');    
        this.$length    = document.getElementById('road-in-length');
        this.$intlanes  = document.getElementById('inter-in-lanes');
	       
	    //Drawing/Adding fields
	    this.selected = 0; //0 - Car, 1 - Road, 2 - Intersection, 3 - Connection, 4 - Delete
	    this.mousecell = {x: 0, y: 0};
	    this.mousecell = {x: 0, y: 0};
	    this.timer = 0;
	    this.drawing = true;

        // Not sure wht i did it this way. 
        this.r = new Road({x: 0, y: 0}, 0, 0, 0);

	    this.roadfits = true;
	    this.connclicked = false;
	    this.openroad = "";
	    this.openroadside = 0;

	    this.updateValues();
        this.attachButtonListeners();
	    this.attachInputs();
	}

    attachButtonListeners(){
        this.btn_car.addEventListener('click', function(e){
            this.el_ctrl_road.classList.add("hidden");
            this.el_ctrl_inter.classList.add("hidden");
            this.el_ctrl_sim.classList.add("hidden");
            this.el_ctrl_car.classList.remove("hidden");
            this.selected = 0; 
        }.bind(this));

        this.btn_road.addEventListener('click', function(e){
            this.el_ctrl_car.classList.add("hidden");
            this.el_ctrl_inter.classList.add("hidden");
            this.el_ctrl_sim.classList.add("hidden");
            this.el_ctrl_road.classList.remove("hidden");
            this.selected = 1;
        }.bind(this));

        this.btn_inter.addEventListener('click', function(e){
            this.el_ctrl_car.classList.add("hidden");
            this.el_ctrl_road.classList.add("hidden");
            this.el_ctrl_sim.classList.add("hidden");
            this.el_ctrl_inter.classList.remove("hidden");
            this.selected = 2;
        }.bind(this));

        this.btn_sim.addEventListener('click', function(e){
            this.el_ctrl_road.classList.add("hidden");
            this.el_ctrl_inter.classList.add("hidden");
            this.el_ctrl_car.classList.add("hidden");
            this.el_ctrl_sim.classList.remove("hidden");
            this.selected = 3; // start on connect.
        }.bind(this));

        this.btn_connect.addEventListener('click', function(e){
            this.selected = 3;
        }.bind(this));

        this.btn_delete.addEventListener('click', function(e){
            this.selected = 4;
        }.bind(this));
    }

    attachInputs () {
        //On mouse move to update data for drawing
        this.sim.canvas.addEventListener('mousemove', function (e) {
            this.mousepos = this.calculateMousePos(e);
            this.mousecell = this.calculateMouseCell();
            this.checkInsertionFit();   //This updates fields used by the click callbacks
            //Reset Drawing timer
            this.timer = 0;
            this.drawing = true;
        }.bind(this));

        //On mouse click to add things
        this.sim.canvas.addEventListener('click', function (e) {
        	this.updateValues();
            switch (this.selected) {
                case 0: //Car
                    this.carClickCallback();
                    break;
                case 1: //Road
                    this.roadClickCallback();
                    break;
                case 2: //Intersection
                    this.interClickCallback();
                    break;
                case 3: //Connection
                    this.connClickCallback();
                    break;
                case 4: //Delete
                    this.deleteClickCallback();
                default:
            }
        }.bind(this));
    }

    updateValues(){
        this._speed     = this.$speed.value;
        this._color     = this.$color.value;
        this._roadlanes = this.$roadlanes.value;
        this._length    = this.$length.value;
        this._intlanes  = this.$intlanes.value;
        this._roador    = this.$roador.value;
    }

    draw () {
        this.updateValues();
        var ctx = this.sim.ctx;
        if (this.mousecell.y >= 0
                && this.mousecell.x >= 0
                && this.mousecell.y < this.sim.size.y
                && this.mousecell.x < this.sim.size.x) {
            switch (this.selected) {
                case 0: //Car
                    this.drawCar(ctx);
                    break;
                case 1: //Road
                    this.drawRoad(ctx);
                    break;
                case 2: //Intersections
                    this.drawInt(ctx);
                    break;
                case 3: //Connections
                    this.drawConn(ctx);
                    break;
                default:
                    break;
            }
        }
    }

    drawCar (ctx) {
        if (++this.timer > 20) {
            this.drawing = !this.drawing;
            this.timer = 0;
        }
        if (this.drawing) {
            ctx.beginPath();
            ctx.fillStyle = "grey";
            ctx.fillRect(this.mousecell.x * this.sim.scale + this.sim.size.x0 + 2,
                    this.mousecell.y * this.sim.scale + this.sim.size.y0 + 2,
                    this.sim.scale - 3, this.sim.scale - 3);
        }
    }

    drawRoad (ctx) {
        if (this.drawing) {
            //Draw the rectangle
            var rx, ry, dx, dy, o, or;
            o = this._roador;
            or = this.r.getO(o * 1);
            rx = (this.mousecell.x + or.xd) * this.sim.scale + this.sim.size.x0;
            ry = (this.mousecell.y + or.yd) * this.sim.scale + this.sim.size.y0;
            dx = (this._roadlanes * or.lx + this._length * or.px) * this.sim.scale - 1 * or.lx - 1 * or.px;
            dy = (this._roadlanes * or.ly + this._length * or.py) * this.sim.scale - 1 * or.ly - 1 * or.py;
            ctx.strokeStyle = "grey";
            ctx.beginPath();
            ctx.setLineDash([5]);
            ctx.lineWidth = 3;
            ctx.rect(rx, ry, dx, dy);
            ctx.stroke();
            ctx.setLineDash([0]);

            //Draw direction arrow
            var mx, my, ax, ay, tx, ty;
            mx = rx + 0.5 * this._roadlanes * this.sim.scale * or.lx;
            my = ry + 0.5 * this._roadlanes * this.sim.scale * or.ly;
            ax = mx + this._length * this.sim.scale * or.px;
            ay = my + this._length * this.sim.scale * or.py;
            ctx.strokeStyle = "grey";
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(ax, ay);
            ctx.stroke();

            ctx.beginPath();
            tx = ax - this.sim.scale * or.px - 0.5 * this.sim.scale * or.lx;
            ty = ay - this.sim.scale * or.py - 0.5 * this.sim.scale * or.ly;
            ctx.moveTo(ax, ay);
            ctx.lineTo(tx, ty);
            ctx.moveTo(ax, ay);
            tx = ax - this.sim.scale * or.px + 0.5 * this.sim.scale * or.lx;
            ty = ay - this.sim.scale * or.py + 0.5 * this.sim.scale * or.ly;
            ctx.lineTo(tx, ty);
            ctx.stroke();
        }
    }

    drawInt (ctx) {
        //Draw an outline of the square representing the intersection.
        var rx, ry, d;
        rx = (this.mousecell.x + 1) * this.sim.scale + this.sim.size.x0;
        ry = (this.mousecell.y + 1) * this.sim.scale + this.sim.size.y0;
        d = -1 * this._intlanes * this.sim.scale;
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.setLineDash([5]);
        ctx.lineWidth = 3;
        ctx.rect(rx, ry, d * 2, d * 2);
        ctx.stroke();
        ctx.setLineDash([0]);
    }

    drawConn (ctx) {
        //Road Output Connections
        var road;
        for (var i = 0; i < this.sim.roads.length; i++) {
            road = this.sim.roads[i];
            if (!(road.out === "none")) {
                this.drawConnLineRoad(ctx, road);
            }
            this.drawDirectionArrow(ctx, road);
        }
        //Intersection Output Connections
        var int, outx0, outy0, inx0, iny0, dx, dy;
        for (var i = 0; i < this.sim.intersections.length; i++) {
            this.drawConnLineInt(ctx, this.sim.intersections[i]);
        }
        //If an open output is clicked, draw a line from output to cursor
        if (this.connclicked === true) {
            this.drawMouseLine(ctx);
        }
    }

    drawConnLineRoad (ctx, road) {
        var from, to;
        from = {
            x: (road.dim.xd0 + road.o.px * (road.length - 0.5) + 0.5 * road.o.lx * road.lanes) * this.sim.scale + this.sim.size.x0,
            y: (road.dim.yd0 + road.o.py * (road.length - 0.5) + 0.5 * road.o.ly * road.lanes) * this.sim.scale + this.sim.size.y0
        };
        to = road.out.getTo(this.sim.size, this.sim.scale, road.outside);
        ctx.beginPath();
        ctx.strokeStyle = "#B33D3D";
        ctx.lineWidth = 2;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    drawConnLineInt (ctx, int) {
        for (var side = 0; side < 4; side++) {
            if (!(int.outs[side] === "none")) {
                this.drawOutLineInt(ctx, int, side);
            } else {
                this.drawOutputsInt(ctx, int, side);
            }
        }
    }

    drawDirectionArrow (ctx, road) {
        //Draw direction arrow
        var mx, my, ax, ay, tx, ty;

        ax = road.dim.xd0 + (0.5 * road.length * road.o.px) + (0.5 * road.o.lx * road.lanes);
        ay = road.dim.yd0 + (0.5 * road.length * road.o.py) + (0.5 * road.o.ly * road.lanes);

        ctx.strokeStyle = "#B33D3D";

        ctx.beginPath();
        tx = (ax - 0.5 * road.o.lx - 0.5 * road.o.px) * this.sim.scale;
        ty = (ay - 0.5 * road.o.ly - 0.5 * road.o.py) * this.sim.scale;
        ctx.moveTo(ax * this.sim.scale + this.sim.size.x0, ay * this.sim.scale + this.sim.size.y0);
        ctx.lineTo(tx + this.sim.size.x0, ty + this.sim.size.y0);
        ctx.moveTo(ax * this.sim.scale + this.sim.size.x0, ay * this.sim.scale + this.sim.size.y0);
        tx = (ax + 0.5 * road.o.lx - 0.5 * road.o.px) * this.sim.scale;
        ty = (ay + 0.5 * road.o.ly - 0.5 * road.o.py) * this.sim.scale;
        ctx.lineTo(tx + this.sim.size.x0, ty + this.sim.size.y0);
        ctx.stroke();
    }

    drawMouseLine (ctx, road) {
        var from = this.openroad.getFrom(this.sim.size, this.sim.scale, this.openroadside);
        ctx.beginPath();
        ctx.strokeStyle = "#B33D3D";
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(this.mousepos.x, this.mousepos.y);
        ctx.stroke();
    }

    drawOutputsInt (ctx, int, side) {
        //Draw Rectangles
        var outx0, outy0, inx0, iny0, dx, dy;
        switch (side) {
            case 0:
                outx0 = int.base.x;
                outy0 = int.base.y - 2 * int.lanes + 1;
                inx0 = int.base.x - int.lanes + 1;
                iny0 = int.base.y - 2 * int.lanes + 1;
                dx = -1 * (int.lanes - 1);
                dy = 1;
                break;
            case 1:
                outx0 = int.base.x - 2 * int.lanes + 1;
                outy0 = int.base.y - 2 * int.lanes + 2;
                inx0 = outx0;
                iny0 = int.base.y - int.lanes + 1;
                ;
                dx = 1;
                dy = int.lanes - 1;
                break;
            case 2:
                outx0 = int.base.x - 2 * int.lanes + 2;
                outy0 = int.base.y;
                inx0 = int.base.x - int.lanes + 1;
                iny0 = outy0;
                dx = int.lanes - 1;
                dy = 1;
                break;
            case 3:
                outx0 = int.base.x;
                outy0 = int.base.y;
                inx0 = outx0;
                iny0 = int.base.y - int.lanes + 1;
                dx = 1;
                dy = -1 * (int.lanes - 1);
                break;
        }
        ctx.beginPath();
        ctx.strokeStyle = "#B33D3D";
        ctx.rect(outx0 * this.sim.scale + this.sim.size.x0,
                outy0 * this.sim.scale + this.sim.size.y0,
                dx * this.sim.scale,
                dy * this.sim.scale);
        ctx.rect(inx0 * this.sim.scale + this.sim.size.x0,
                iny0 * this.sim.scale + this.sim.size.y0,
                dx * this.sim.scale,
                dy * this.sim.scale);
        ctx.stroke();
    }

    drawOutLineInt (ctx, int, side) {
        var from, to;
        from = int.getFrom(this.sim.size, this.sim.scale, side);
        to = int.outs[side].getTo(this.sim.size, this.sim.scale, side);
        ctx.beginPath();
        ctx.strokeStyle = "#B33D3D";
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    carClickCallback () {
        var mx, my;
        mx = this.mousecell.x;
        my = this.mousecell.y;
        if (mx >= 0 && my >= 0 && mx < this.sim.size.x && my < this.sim.size.y) {
            //Find which road or intersection the car goes in
            for (var i = 0; i < this.sim.roads.length; i++) {
                if (this.insideRoad(mx, my, this.sim.roads[i])) {
                    var target = this.sim.roads[i];
                    var pos = this.getPos(mx, my, target);

                    //Check that it doesnt hit another car.
                    if (target.road[pos.l][pos.p] === 0) {
                        target.addCar(new Car(this._color, {lane: pos.l, pos: pos.p, speed: this._speed}, Driver().NORMAL));
                    }
                    break;
                }
            }
        }
    }

    roadClickCallback () {
        var mx, my;
        mx = this.mousecell.x;
        my = this.mousecell.y;
        if (this.roadfits) {
            // console.log(this._roador)
            this.sim.addRoad(new Road({x: mx, y: my}, 1*this._roador, this._length, this._roadlanes));
        }
    }

    interClickCallback () {
        var mx, my;
        mx = this.mousecell.x;
        my = this.mousecell.y;
        if (this.roadfits) {
            this.sim.addIntersection(new Intersection({x: mx, y: my}, this._intlanes, 0));
        }
    }

    connClickCallback () {
        var mx, my;
        mx = this.mousecell.x;
        my = this.mousecell.y;
        if (this.connclicked) {
            //Check if click is on a road
            for (var i = 0; i < this.sim.roads.length; i++) {
                if (this.insideRoad(mx, my, this.sim.roads[i])) {
                    var target = this.sim.roads[i];
                    this.openroad.setOutput(target, this.openroadside);
                    break;
                }
            }
            //Check if click is on an intersection
            for (var i = 0; i < this.sim.intersections.length; i++) {
                if (this.insideInt(mx, my, this.sim.intersections[i])) {
                    var target = this.sim.intersections[i];
                    this.openroad.setOutput(target, target.getSide(mx, my));
                    break;
                }
            }
            this.connclicked = false;
        } else {
            //Check if click is on a connection
            for (var i = 0; i < this.sim.roads.length; i++) {
                if (this.insideRoad(mx, my, this.sim.roads[i])) {
                    this.sim.roads[i].out = "none";
                    this.openroad = this.sim.roads[i];
                    this.openroadside = 0; //Hack for road/intersection 'polymorphism'
                    break;
                }
            }
            //Check if click is on an intersection
            var inter;
            for (var i = 0; i < this.sim.intersections.length; i++) {
                inter = this.sim.intersections[i];
                if (this.insideInt(mx, my, inter)) {
                    inter.outs[inter.getOut(mx, my)] = "none";
                    this.openroad = inter;
                    this.openroadside = inter.getOut(mx, my);
                    break;
                }
            }
            this.connclicked = true;
        }
    }

    deleteClickCallback () {
        var mx, my;
        mx = this.mousecell.x;
        my = this.mousecell.y;
        for (var i = 0; i < this.sim.roads.length; i++) {
            if (this.insideRoad(mx, my, this.sim.roads[i])) {
                this.sim.roads.splice( i, 1 );
                break;
            }
        }
        //Check if click is on an intersection
        for (var i = 0; i < this.sim.intersections.length; i++) {
            if (this.insideInt(mx, my, this.sim.intersections[i])) {
                this.sim.intersections.splice(i, 1);
                break;
            }
        }
    }

    calculateMousePos (event){
    	const rect = this.sim.canvas.getBoundingClientRect()
	    const mx = event.clientX - rect.left
	    const my = event.clientY - rect.top
	    return {x: mx, y: my};
    }

    calculateMouseCell () {
        var mx = this.mousepos.x;
        var my = this.mousepos.y;
        mx = mx - this.sim.size.x0-(this.sim.scale/4);
        my = my - this.sim.size.y0-(this.sim.scale/4);
        mx = Math.floor(mx / this.sim.scale);
        my = Math.floor(my / this.sim.scale);
        return {x: mx, y: my};
    }

    checkInsertionFit () {
        var rx0, ry0, rxn, ryn, or, o, bottom, top, left, right;
        rx0 = this.mousecell.x;
        ry0 = this.mousecell.y;
        switch (this.selected) {
            case 1:
                o = this._roador;
                or = this.r.getO(o * 1);
                rxn = rx0 + ((this._roadlanes - 1) * or.lx + (this._length - 1) * or.px);
                ryn = ry0 + ((this._roadlanes - 1) * or.ly + (this._length - 1) * or.py);

                top = Math.max(ry0, ryn);
                bottom = Math.min(ry0, ryn);
                left = Math.min(rx0, rxn);
                right = Math.max(rx0, rxn);
                break;
            case 2:
                rxn = rx0 - this._intlanes * 2 + 1;
                ryn = ry0 - this._intlanes * 2 + 1;

                top = Math.max(ry0, ryn);
                bottom = Math.min(ry0, ryn);
                left = Math.min(rx0, rxn);
                right = Math.max(rx0, rxn);
                break;
            default:
                break;
        }

        this.roadfits = true;
        //Bounding rect
        if (top < this.sim.size.y && bottom >= 0 && left >= 0 && right < this.sim.size.x) {
            var road, rtop, rbottom, rleft, rright;
            for (var i = 0; i < this.sim.roads.length; i++) {
                road = this.sim.roads[i];
                rtop = Math.max(road.dim.yd0, road.dim.yd0 + road.dim.dy);
                rbottom = Math.min(road.dim.yd0, road.dim.yd0 + road.dim.dy);
                rright = Math.max(road.dim.xd0, road.dim.xd0 + road.dim.dx);
                rleft = Math.min(road.dim.xd0, road.dim.xd0 + road.dim.dx);
                // l1 < r2 && r1 > l2 && b1 < t2 && t1 > b2
                if (left < rright && right >= rleft && top >= rbottom && bottom < rtop) {
                    this.roadfits = false;

                    break;
                }
            }
        } else {
            this.roadfits = false;
        }
    }

    insideRoad (x, y, road) {

        var right = Math.max(road.dim.xn0, road.dim.xn0 + (road.o.lx * (road.lanes - 1)) + (road.o.px * (road.length - 1)));
        var left = Math.min(road.dim.xn0, road.dim.xn0 + (road.o.lx * (road.lanes - 1)) + (road.o.px * (road.length - 1)));
        var top = Math.max(road.dim.yn0, road.dim.yn0 + (road.o.ly * (road.lanes - 1)) + (road.o.py * (road.length - 1)));
        var bottom = Math.min(road.dim.yn0, road.dim.yn0 + (road.o.ly * (road.lanes - 1)) + (road.o.py * (road.length - 1)));

        return (x >= left)
                && (x <= right)
                && (y >= bottom)
                && (y <= top);
    }

    insideInt (x, y, int) {
        var right = int.base.x;
        var left = int.base.x - 2 * int.lanes;
        var bottom = int.base.y - 2 * int.lanes;
        var top = int.base.y;
        var ret = (x >= left)
                && (x <= right)
                && (y >= bottom)
                && (y <= top);
        return ret;
    }

    getPos (x, y, road) {
        var lane, pos;
        lane = Math.abs(road.o.lx * (road.dim.xn0 - x) + road.o.ly * (road.dim.yn0 - y));
        //pos is distance in px/py from xn0/yn0
        pos = Math.abs(road.o.px * (road.dim.xn0 - x) + road.o.py * (road.dim.yn0 - y));
        return {l: lane, p: pos};
    }
};

function Driver() {
    return({NORMAL: 0, SLOW: 1, CRAZY: 2});
}

export default InputHandler;