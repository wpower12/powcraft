const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		strums:     './src/js/strums.js',
		beebc:      './src/js/beebc/main.js',
		forces:     './src/js/forces/main.js',
		traffic:    './src/js/traffic/traffic.js',
		tribes:     './src/js/tribes/main.js',
		miniclient: './src/js/minimog/client/client.js'
	},
	output: {
	    path: path.resolve(__dirname, 'public/javascripts'),
	    filename: '[name].bundle.js'
    },
   // Man I need to figure out why this was needed for the socket.io stuff. 
   //  module: {
	  //   rules: [
	  //     {
	  //       test: /\.m?js$/,
	  //       use: {
	  //         loader: "babel-loader",
	  //         options: {
	  //           presets: ["@babel/preset-env"], // ensure compatibility with older browsers
	  //           plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
	  //         },
	  //       },
	  //     },
	  //     {
	  //       test: /\.js$/,
	  //       loader: "webpack-remove-debug", // remove "debug" package
	  //     },
	  //   ],
  	// },
};