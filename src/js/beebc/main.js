import EightBitComp from "./EightBitComp.js";
import EBCGUI       from "./EBCGUI.js"
import Assembler    from "./Assembler.js";
import {AddSub, AddSub_Src} from "./Examples.js"; 

var ebc     = new EightBitComp();
var ebc_gui = new EBCGUI();
var ass     = new Assembler();

var DELAY = 5;
var running = false;
var timer;

// **** BUTTONS ****
// Advance Clock One Tick - The 'Step' button
function step(){
	ebc.tick(); 
	ebc_gui.update_elements(ebc);
}
var btn_step = document.getElementById('clk_step');
btn_step.onclick = step;

// Start/Stop the clock - "play/pause" button
function startstop(){
	if(running){
		running = false;
		clearTimeout(timer);
	} else {
		running = true;
		timer = setInterval(step, DELAY);
	}
}
var btn_ss = document.getElementById('clk_start');
btn_ss.onclick = startstop;

// Reset - Clear everything but the RAM
function reset(){
	ebc.reset_not_RAM();
	ebc_gui.update_elements(ebc);
}
var btn_rs = document.getElementById('reset');
btn_rs.onclick = reset;

// Process Code in Assembler Area
function assemble(){
	src = ass_txt.value; 
	res = ass.assemble(src); // Will return an object, so I can pass a
							 // error code if needed. 

	if(res[0] == 0){         // Error code of 0 == no error
		ebc.RAM = res[1];    // Means we can safely dump result into ram.
	} else {
		console.log("Error in assembly: "+res[0]);
	}
	ebc_gui.update_elements(ebc);
	return false;
}
var ass_txt  = document.getElementById('ass_in');
var form_ass = document.getElementById('ass_form');
form_ass.onsubmit = assemble;

// *** Memory Editing
var mems_dsp = [16];
var mems_inp = [16];
var mems_btn = [16];
var idx;
for (var i = 0; i < 16; i++) {
	idx = i.toString(2).padStart(4,'0');
	mems_dsp[i] = document.getElementById('m'+idx);
	mems_inp[i] = document.getElementById('i'+idx);
	mems_btn[i] = document.getElementById('b'+idx);
}

function edit_mem(){
	var i = parseInt(this.id.substring(1), 2);
	mems_dsp[i].classList.add("hidden");
	mems_inp[i].classList.remove("hidden");
	mems_btn[i].classList.remove("hidden");
	mems_inp[i].value = ebc.RAM[i].toString(2).padStart(8, '0');
}

function save_mem(){
	var i = parseInt(this.id.substring(1), 2);
	ebc.RAM[i] = parseInt(mems_inp[i].value, 2);
	mems_dsp[i].innerHTML = ebc_gui.format_register_html(ebc.RAM[i].toString(2), 8, true);
	mems_dsp[i].classList.remove("hidden");
	mems_inp[i].classList.add("hidden");
	mems_btn[i].classList.add("hidden");
}

for (var i = 0; i < 16; i++) {
	mems_dsp[i].onclick = edit_mem;
	mems_btn[i].onclick = save_mem;
}

// Load some initial code. 
ebc.RAM = AddSub;
ass_txt.value = AddSub_Src;
ebc_gui.update_elements(ebc);



