const CELL_WIDTH  = 10;
const CELL_HEIGHT = 10;

// quad tree to hold the cell entities?
// 

class Chunk {

	constructor(){
		this.cells = [];
		for (var i = 0; i < CELL_HEIGHT; i++) {
			 let new_row = [];
			 for (var i = 0; i < CELL_WIDTH; i++) {
			 	new_row.push(0);
			 }
			 this.cells.push(new_row);
		}
	}

}

module.exports = Chunk;