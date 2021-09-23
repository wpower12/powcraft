import SimplexNoise from 'simplex-noise';

export function TestLevel(cell_offset, side_length, max_height, scale, seed){
	let simplex = new SimplexNoise(seed);

	var level = [];
	for (var i = 0; i < side_length; i++) {
		let new_row = [];
		for (var j = 0; j < side_length; j++) {
			// Find a doodad.
			let t = Math.floor(13*(simplex.noise3D((i+cell_offset.x)*3000, (j+cell_offset.y)*3000, (i+cell_offset.x)*100)+1));
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
				'height': Math.floor((max_height*(simplex.noise2D((i+cell_offset.x)/scale, (j+cell_offset.y)/scale)+1))),
				'tile': 'grass',
				'top': d,
				'portal': false
			};

			new_row.push(new_cell);
		}
		level.push(new_row);
	}

	// Attempt to add a 'door' -> stone tile + animated crystal?

	let mid = Math.floor(side_length/2);

	if(level[0][mid]['height'] > 0){
		level[0][mid]['tile'] = 'stone';
		level[0][mid]['portal'] = true;
		level[0][mid]['crystal'] = 'crystal-orange';
		level[0][mid]['anim'] = 'spin-orange';
		level[0][mid]['facing'] = 'a'; // For 'cell to cell movement'
	}

	if(level[mid][0]['height'] > 0){
		level[mid][0]['tile'] = 'stone';
		level[mid][0]['portal'] = true;
		level[mid][0]['crystal'] = 'crystal-orange';
		level[mid][0]['anim'] = 'spin-orange';
		level[mid][0]['facing'] = 'w'; // For 'cell to cell movement'
	}

	if(level[side_length-1][mid]['height'] > 0){
		level[side_length-1][mid]['tile'] = 'stone';
		level[side_length-1][mid]['portal'] = true;
		level[side_length-1][mid]['crystal'] = 'crystal-orange';
		level[side_length-1][mid]['anim'] = 'spin-orange';
		level[side_length-1][mid]['facing'] = 'd'; // For 'cell to cell movement'
	}

	if(level[mid][side_length-1]['height'] > 0){
		level[mid][side_length-1]['tile'] = 'stone';
		level[mid][side_length-1]['portal'] = true;
		level[mid][side_length-1]['crystal'] = 'crystal-orange';
		level[mid][side_length-1]['anim'] = 'spin-orange';
		level[mid][side_length-1]['facing'] = 's'; // For 'cell to cell movement'
	}

	return level;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}