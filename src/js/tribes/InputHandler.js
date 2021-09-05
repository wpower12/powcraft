class InputHandler {
    constructor (sim){
        this.sim = sim;
        // TODO - Replace all the onchange listeners with a giant key handler.
        // same as with the traffic and forces things.  
        this.sim.canvas.on('keypress', this.handleKey.bind(this));      
    }
    handleKey (key){
        switch(key.which){
            case 113: // q fps down
                if(this.sim.fps > 1){
                    this.sim.fps--;
                    $(this.rangefps).text(""+this.sim.fps);
                }
                break;
            case 119:  // w - fps 'up'
                if(this.sim.fps < 60){
                    this.sim.fps++;
                    $(this.rangefps).text(""+this.sim.fps);
                }
                break;
            case 97:   // a - fill down
                if(this.sim.fillfactor > 1){
                    this.sim.fillfactor--;
                    $(this.rangefill).text(""+this.sim.fillfactor);
                    this.sim.reset();
                }
                break; 
            case 115:  // s - fill up
                if(this.sim.fillfactor < 100){
                    this.sim.fillfactor++;
                    $(this.rangefill).text(""+this.sim.fillfactor);
                    this.sim.reset();    
                }
                break;
            case 122:  // z - scale down
                if(this.sim.scale > 5){
                    this.sim.scale--;
                    $(this.rangescale).text(""+this.sim.scale);
                    this.sim.reset();
                }
                break; 
            case 120:  // x - scale up
                if(this.sim.scale < 20){
                    this.sim.scale++;
                    $(this.rangescale).text(""+this.sim.scale);
                    this.sim.reset();
                }
                break;  
        }
    }
    setFieldsFPS (r, v) {
        this.rangefps = r;
        this.viewfps = v;
        return this;
    }
    setFieldsFill (r, v) {
        this.rangefill = r;
        this.viewfill = v;
        return this;
    }
    setFieldsScale (r, v) {
        this.rangescale = r;
        this.viewscale = v;
        return this;
    }
    setFieldsLookR (r, v) {
        this.rangelook = r;
        this.viewlook = v;
        return this;
    }
    attachInputs () {
        //Fill Setting
        $(this.rangefill).on('change', function (e) {
            var v = $(this.rangefill).val();
            this.sim.fillfactor = v;
            $(this.viewfill).text(String(v));
            this.sim.reset();
        }.bind(this));

        //FPS Setting
        $(this.rangefps).on('change', function (e) {
            var v = $(this.rangefps).val();
            this.sim.fps = v;
            $(this.viewfps).text(String(v));
            this.sim.reset();
        }.bind(this));

        //Scale Settings
        $(this.rangescale).on('change', function (e) {
            var v = $(this.rangescale).val();
            this.sim.scale = v;
            $(this.viewscale).text(String(v));
            this.sim.reset();
        }.bind(this));

        //Look Radius
        $(this.rangelook).on('change', function (e) {
            var v = $(this.rangelook).val();
            this.sim.look = v;
            $(this.viewlook).text(String(v));
            this.sim.reset();
        }.bind(this));
    }
}