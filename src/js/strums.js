import * as Tone from 'tone'

const synth = new Tone.Synth().toDestination();

function playStrum(){
	Tone.Transport.cancel();

	console.log(this.getAttribute('data-bits'));
	let bit_string = this.getAttribute('data-bits');
	for (var i = 0; i < 8; i++) {
		
		let tone_str;
		if(i % 2 == 0){
			tone_str = "C2";
		} else {
			tone_str = "G2";
		}

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


// Island Strum - 'D_ DU _U DU'
