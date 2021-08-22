const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		strums: './src/js/strums.js',
		beebc:  './src/js/beebc/main.js'
	},
	output: {
	    path: path.resolve(__dirname, 'public/javascripts'),
	    filename: '[name].bundle.js'
    }
};