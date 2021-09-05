class Unit {
    constructor (id, str, tribe, x, y) {
        this.id = id;
        this.str = str;
        this.tribe = tribe;
        this.loc = {x: x, y: y};
    }
}

export default Unit;