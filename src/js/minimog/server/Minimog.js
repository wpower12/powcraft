var Chunk  = require('./Chunk');
var Player = require('./Player'); 


class Minimog {

	constructor(io, server){
		this.io = io;
		this.server = server;
		
		this.setServerMessageHandlers()
		this.server.listen(3000);  

		this.players = [];
		this.active_chunks = [];


	}	

	setServerMessageHandlers(){

		this.io.on('connection', (socket) => {
			console.log('a user connected');
			this.players.push(socket.client.id);
			console.log("players: "+this.players);
		});



	}


	updateWorld(){
		// TODO
	}
}

module.exports = Minimog;