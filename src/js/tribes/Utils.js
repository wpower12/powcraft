export class ColorPicker {
    constructor(n){
        this.s = 90;
        this.l = 45;
        this.delta = 360 / n;     
    }
   get(c) {
        var ret = 'hsl(' + c * this.delta + ',' + this.s + '%,' + this.l + '%' + ')';
        return ret;
    }
}