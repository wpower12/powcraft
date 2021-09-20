import SimplexNoise from 'simplex-noise';

export function TestLevel(side_length, max_height){
	let simplex = new SimplexNoise();

	var level = [];
	for (var i = 0; i < side_length; i++) {
		let new_row = [];
		for (var j = 0; j < side_length; j++) {
			// Find a doodad.
			let t = getRandomInt(50);
			let d; // doo-dad
            switch (t) {
                case 0:
                    d = 'trees_1';
                    break;
                case 1:
                    d = 'trees_2';
                    break;
                case 2:
                    d = 'trees_3';
                    break;
                case 4:
                    d = 'rocks_1';
                    break;
                case 5:
                    d = 'rocks_2';
                    break;
                default:
                    d = '';
			}

			let new_cell = {
				'height': Math.floor((max_height*(simplex.noise2D(i/20, j/20)+1))),
				'tile': 'grass',
				'top': d
			};

			new_row.push(new_cell);
		}
		level.push(new_row);
	}

	// Attempt to add a 'door' -> stone tile + animated crystal?

	return level;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}