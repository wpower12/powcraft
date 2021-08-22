import * as Tone from 'tone'

const synth = new Tone.Synth().toDestination();

function playStrum(){
	Tone.Transport.cancel();

	let bit_string = this.getAttribute('data-bits');
	for (var i = 0; i < 8; i++) {
		
		let tone_str;
		if(i % 2 == 0){
			tone_str = "C2"; // Down Strum Note
		} else { 
			tone_str = "G2"; // Up Strum Note
		}

		// Create a new loop to attach to Transport
		if(bit_string[i] == '1'){
			let time_os = "0:0:"+(2*i);
			new Tone.Loop(time => {
				synth.triggerAttackRelease(tone_str, "8n", time);
			}, "1n").start(time_os); 
		}
	}
	Tone.Transport.start();
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
