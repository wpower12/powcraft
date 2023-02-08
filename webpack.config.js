const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		saltcalc:   './src/js/saltcalc/main.js',
		strums:     './src/js/strums.js',
		beebc:      './src/js/beebc/main.js',
		forces:     './src/js/forces/main.js',
		traffic:    './src/js/traffic/traffic.js',
		tribes:     './src/js/tribes/main.js',
		miniclient: './src/js/minimog/client/client.js',
		// pg_global:  './src/js/procgen/viewglobal.js'
	},
	output: {
	    path: path.resolve(__dirname, 'public/javascripts'),
	    filename: '[name].bundle.js'
    },
};