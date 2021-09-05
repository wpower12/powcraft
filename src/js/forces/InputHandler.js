import vmath from './vmath.js';
import Disc  from './Disc.js';
import PointSource from './PointSource.js';

var InputHandler = function (s) {
    this.sim = s;
    this.c = s.canvas;
    this.rect = s.canvas.getBoundingClientRect();

    this.addingDisc = true;
    this.addingPoint = false;
    
    this.btn_disc  = document.getElementById('btn-disc');
    this.btn_point = document.getElementById('btn-point');
    this.btn_stats = document.getElementById('btn-stats');
    this.btn_grid  = document.getElementById('btn-grid');
    this.btn_clear = document.getElementById('btn-clear');

    this.attachButtonListeners();

    //Fields used by both during click events
    this.addradius = 0;
    this.addpower = 0;
    this.addvelocity = vmath.newvector(0, 0);
    this.addtimer = 0;
    this.maxdiscradius = 20;
    this.maxvelocity = 4.5;
    this.velocityscale = 0.01;
    this.maxpointradius = 85;
    //Click control
    this.clickloc = 0;
    this.mouseloc = 0;
    this.clicking = false;
    this.moved = false;
    this.sim.canvas.onmousedown = this.handleClick.bind(this);
};
InputHandler.prototype = {

    attachButtonListeners: function(){
    	this.btn_disc.addEventListener('click', function(){
    		this.addingDisc = true;
    		this.addingPoint = false;
    	}.bind(this));

    	this.btn_point.addEventListener('click', function(){
    		this.addingDisc = false;
    		this.addingPoint = true;
    	}.bind(this));

    	this.btn_stats.addEventListener('click', function(){
    		this.toggleStats();
    	}.bind(this));

    	this.btn_grid.addEventListener('click', function(){
    		this.toggleGrid();
    	}.bind(this));

    	this.btn_clear.addEventListener('click', function(){
    		this.clrAll();
    	}.bind(this))
    },

    draw: function () {
        if (this.clicking) {
            if (this.addingPoint) {
                this.draw_addPoint();
            } else if (this.addingDisc) {
                this.draw_addDisc();
            }
        }
    },

    draw_addPoint: function () {
        //Draw circle of radius center to point
        var screen = this.sim.screen;
        screen.beginPath();
        screen.arc(this.clickloc.i, this.clickloc.j, this.addradius, 0, 2 * Math.PI, false);
        screen.lineWidth = 2;
        screen.strokeStyle = 'black';
        screen.stroke();
    },

    draw_addDisc: function () {
        var screen = this.sim.screen;
        //If havent moved draw circle
        if (!this.moved) {
            screen.beginPath();
            screen.arc(this.clickloc.i, this.clickloc.j, this.addradius, 0, 2 * Math.PI, false);
            screen.fillStyle = 'gray';
            screen.fill();
            screen.beginPath();
            screen.arc(this.clickloc.i, this.clickloc.j, this.addradius, 0, 2 * Math.PI, false);
            screen.lineWidth = 2;
            screen.strokeStyle = 'black';
            screen.stroke();
        } else {
            drawLine(screen, this.clickloc, this.mouseloc);
            screen.beginPath();
            screen.arc(this.clickloc.i, this.clickloc.j, this.addradius, 0, 2 * Math.PI, false);
            screen.fillStyle = 'gray';
            screen.fill();
            screen.beginPath();
            screen.arc(this.clickloc.i, this.clickloc.j, this.addradius, 0, 2 * Math.PI, false);
            screen.lineWidth = 2;
            screen.strokeStyle = 'black';
            screen.stroke();
        }


    },
    addDisc: function (event) {
        var c = this.sim.canvas;
        this.addradius = 6;
        //Add interval timeout to increase disc size
        var discSizeTimeout = setInterval(function () {
            this.addradius += 2;
        }.bind(this), 800);
        //On mouse move - if the pointer leaves the circle, switch to
        // velocity onmousemove
        this.c.onmousemove = function (e) {
            this.mouseloc = getMousePos( c, e );
            var dist = Math.abs(vmath.length(vmath.sub(this.clickloc, this.mouseloc)));
            if (dist > this.addradius) {
                //Clear the timeout callback/set move flag
                clearInterval(discSizeTimeout);
                this.moved = true;
                //Add new onmousemove callback to track mouse position.
                this.c.onmousemove = function (e) {
                    this.mouseloc = getMousePos( c, e );
                    //mouse = click+line
                    //line = mouse-click
                    var line = vmath.sub(this.mouseloc, this.clickloc);
                    this.addvelocity = vmath.times(line, this.velocityscale);
                }.bind(this);
                this.c.onmouseup = function (e) {
                    if (this.addradius > 0) {
                        this.sim.discs.push(new Disc(this.clickloc.i, this.clickloc.j, this.addradius, this.addvelocity.i, this.addvelocity.j));
                        console.log("Disc: (" + this.clickloc.i + ", " + this.clickloc.j + "), " + this.addradius + ", (" + this.addvelocity.i + ", " + this.addvelocity.j + ")");
                    }
                    this.c.onmousemove = null;
                    this.c.onmouseup = null;
                    this.clicking = false;
                    this.moved = false;
                }.bind(this);
            }
        }.bind(this);
        this.c.onmouseup = function (e) {
            if (this.addradius > 0) {
                this.sim.discs.push(new Disc(this.clickloc.i, this.clickloc.j, this.addradius, this.addvelocity.i, this.addvelocity.j));
                console.log("Disc: (" + this.clickloc.i + ", " + this.clickloc.j + "), " + this.addradius + ", (" + this.addvelocity.i + ", " + this.addvelocity.j + ")");
            }
            this.c.onmousemove = null;
            this.c.onmouseup = null;
            this.clicking = false;
            this.moved = false;
            clearInterval(discSizeTimeout );
        }.bind(this);
    },
    addPoint: function (event) {
        this.c.onmousemove = function (e) {
            this.mouseloc = getMousePos( this.c, e );
            var dist = Math.abs(vmath.length(vmath.sub(this.clickloc, this.mouseloc)));
            dist = (dist < this.maxpointradius) ? dist : this.maxpointradius;
            this.addradius = dist;
        }.bind(this);
        this.c.onmouseup = function (e) {
            //xi, yi, radius, power
            if (this.addradius > 0) {
                this.sim.points.push(new PointSource(this.clickloc.i, this.clickloc.j, this.addradius, this.addradius / 40));
                console.log("Point: (" + this.clickloc.i + ", " + this.clickloc.j + "), " + this.addradius + ", " + this.addradius / 40);
            }
            //Reset stuff
            this.c.onmousemove = null;
            this.c.onmouseup = null;
            this.clicking = false;
        }.bind(this);
    },
    clrAll: function () {
        this.sim.discs = [];
        this.sim.points = [];
    },
    toggleBold: function (ele) {
        var style = ele.style;
        if (style.fontWeight == "") {
            style.fontWeight = "bold";
        } else {
            style.fontWeight = "";
        }
    },
    toggleGrid: function () {
        this.sim.showGrid = !this.sim.showGrid;
    },
    toggleStats: function () {
        this.sim.drawInfo = !this.sim.drawInfo;
    },
    // record: function () {
    //     if (!this.sim.recording) {
    //         this.sim.gif.startRecording();
    //         this.sim.recording = true;
    //         //Change Style of Button to light red background
    //     } else {
    //         this.sim.gif.stopRecording();
    //         this.sim.recording = true;
    //         //Change style of Button back to white background
    //     }
    // },
    handleClick: function (event) {
        
        var mloc = getMousePos( this.c, event );
        
        this.clicking = true;
        this.clickloc = vmath.newvector(mloc.i, mloc.j);
        this.mouseloc = vmath.newvector(mloc.i, mloc.j);
        this.addradius = 0;
        if (this.addingPoint) {
            this.addPoint(event);
        } else if (this.addingDisc) {
            this.addDisc(event);
        }
    }
};

var getMousePos = function (c, e) {
//Get mouse x, y
    var mx, my;
    var element = c, offsetX = 0, offsetY = 0;
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }
    var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(c, null)['paddingLeft'], 10) || 0;
    var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(c, null)['paddingTop'], 10) || 0;
    var styleBorderLeft = parseInt(document.defaultView.getComputedStyle(c, null)['borderLeftWidth'], 10) || 0;
    var styleBorderTop = parseInt(document.defaultView.getComputedStyle(c, null)['borderTopWidth'], 10) || 0;
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    var htmlTop = html.offsetTop;
    var htmlLeft = html.offsetLeft;
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    return { i: mx, j: my };
};

var drawLine = function (screen, a, b) {
    screen.beginPath();
    screen.strokeStyle = 'black';
    screen.moveTo(a.i, a.j);
    screen.lineTo(b.i, b.j);
    screen.stroke();
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


export default InputHandler;