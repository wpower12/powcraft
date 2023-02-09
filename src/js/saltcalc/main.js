var scryfall = require("scryfall-client");

var el_deckList = document.getElementById("decklist");
var el_cmdSalt  = document.getElementById("cmdsalt");
var el_calcBtn  = document.getElementById("calcsalt");
var el_cmdKws   = document.getElementById("comboterms");
var el_scoreout = document.getElementById("score");
var deckList;

async function saltCalc(){
	let deckStr = el_deckList.value;	
	// deckStr.split("\n").forEach(card => console.log(card));
	deckList = [];
	for (let card of deckStr.split("\n")){
		await scryfall.search(card)
				.then(function (list) {
		    		deckList.push(list[0]);
				})
				.catch(function (err) {
					console.log(err);
				});
	}

	let c_support = 0;
	for (let card of deckList){
		let card_otext = card.oracle_text.toLowerCase();
		for (let keyword of el_cmdKws.value.split("\n")){
			if (card_otext.includes(keyword.toLowerCase())){
				c_support++;
			}
		}
	}

	el_scoreout.innerHTML = ""+c_support*parseFloat(el_cmdSalt.value);
}

el_calcBtn.addEventListener("click", saltCalc);
