var express = require('express');
var router = express.Router();

// var base_strum = "DUDUDUDU";
var base_strum = "↓↑↓↑↓↑↓↑";

function replaceAt(s, i, c){
  return s.substring(0,i)+c+s.substring(i+1);
}

function strumString(bit_string){
  let raw_string = base_strum.slice();  
  let cur_pos = bit_string.indexOf('0');

  while(cur_pos !== -1){
    raw_string = replaceAt(raw_string, cur_pos, '_')
    cur_pos = bit_string.indexOf('0', cur_pos+1);
  }

  return raw_string;
}

var num_cols = 4;
var num_rows = 256/num_cols;

var strum_patterns = [];
for (var i = 0; i < 256; i++) {
  let bit_string = (i).toString(2).padStart(8, '0');
  let new_strum = [bit_string, strumString(bit_string)];
  strum_patterns.push(new_strum);
}

var strum_grid = [];
for (var row = 0; row < num_rows; row++){
  strum_grid.push(strum_patterns.splice(0, num_cols));
}

console.log(strum_grid);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('strums', { strums: strum_grid });
});

module.exports = router;
