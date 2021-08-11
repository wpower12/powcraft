const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		strums: './src/js/strums.js'
	},
	output: {
	    path: path.resolve(__dirname, 'public/javascripts'),
	    filename: '[name].bundle.js'
    }
};