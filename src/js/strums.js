import * as Tone from 'tone'

const synth = new Tone.Synth().toDestination();

async function playStrum(){
	await Tone.start()

	Tone.Transport.cancel();

	let bit_string = this.getAttribute('data-bits');
	// for each of the 8 8th notes. 
	for (var i = 0; i < 8; i++) {
		let tone_str;
		if(i % 2 == 0){
			tone_str = "C2"; // Down Strum Note
		} else { 
			tone_str = "G2"; // Up Strum Note
		}

		if(bit_string[i] == '1'){
			let time_os = "0:0:"+(2*i); // offset as "bars:beats:16ths"
			// Create a new loop to attach to Transport
			let tl = new Tone.Loop(time => {
				synth.triggerAttackRelease(tone_str, "8n", time);
			}, "1n").start(time_os); 
			// 8n -> the length of the note, 1 8th note long,
			// 1n -> period, how long we wait to play again. 1 whole note.
			// time_os -> the offset, in '16ths', so the 2*i 'scales' our
			//            8th notes (i) to 16th notes. 
		}
	}
	
	Tone.Transport.start(); 

	// additionally, lets update the 'console' with the new
	// strum pattern. 
	let strum_value = document.getElementById('strum-number');
	strum_value.value = parseInt(bit_string, 2);

	console.log("HI FROM METHOD")
}


var hels = document.getElementsByClassName('strum-pattern');
for (var i = 0; i < hels.length; i++) {
	hels[i].onclick = playStrum;
}

function stopSynth(){
	console.log("stopping synth");
	Tone.Transport.stop()
}

var stop_btn = document.getElementById('stop');
stop_btn.onclick = stopSynth;

console.log("HELLO WORLD")

