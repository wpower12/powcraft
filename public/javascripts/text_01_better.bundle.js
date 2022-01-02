/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/language/01_better_ngrams.js":
/*!*********************************************!*\
  !*** ./src/js/language/01_better_ngrams.js ***!
  \*********************************************/
/***/ (() => {

eval("var elm_corpus = document.getElementById(\"corpus\");\nvar elm_output = document.getElementById(\"output\");\nvar btn_ngrams = document.getElementById(\"gen_ngram_btn\");\nvar btn_sample = document.getElementById(\"gen_sample_btn\");\nvar input_n = document.getElementById(\"N\");\nvar input_s = document.getElementById(\"S\");\n\nvar N = 2;\nvar n_grams = [];\n\nbtn_ngrams.onclick = function(e) {\n\tN = input_n.value;\n\tn_grams = []; // Reset.\n\tlet words = elm_corpus.value.replace(\"\\n\", \" \").split(/\\s+/);\n\tfor (var i = (N-1); i < words.length; i++) {\n\t\tlet n_gram = [];\n\t\tfor (var n = (i-N+1); n <= i; n++) {\n\t\t\tn_gram.push(words[n]);\n\t\t}\n\t\tn_grams.push(n_gram);\n\t}\n\tconsole.log(n_grams);\n}\n\nbtn_sample.onclick = function(e) {\n\t// Pick a random line to start with, append to sample \n\tlet sample = [];\n\tlet context = []; \n\tlet rand_start = n_grams[Math.floor(Math.random()*n_grams.length)];\n\tfor (var n = 0; n < N-1; n++) {\n\t\tsample.push(rand_start[n]);\n\t\tcontext.push(rand_start[n]);\n\t}\n\n\twhile(sample.length < input_s.value){\n\t\t// Find all possible maps from the n-1 context words to a third word\n\t\tlet candidate_words = [];\n\t\tfor (var n = 0; n < n_grams.length; n++) {\n\t\t\tlet gram = n_grams[n];\n\n\t\t\tlet match = true;\n\t\t\tfor (var t = 0; t < N-1; t++){\n\t\t\t\tif(context[t] != gram[t]){ match = false; break;}\n\t\t\t}\n\t\t\tif(match){ candidate_words.push(gram[N-1]); }\n\t\t}\n\n\t\tif(candidate_words.length > 0){\n\t\t\t// Randomly pick one, append it to the current list. \n\t\t\tlet rand_word = candidate_words[Math.floor(Math.random()*candidate_words.length)];\n\t\t\tsample.push(rand_word);\n\t\t\t\n\t\t\t// Update Context\n\t\t\tcontext.shift();\n\t\t\tcontext.push(rand_word);\n\t\t} else {\n\t\t\tbreak;\n\t\t}\n\t}\n\n\t// print to the output div.\n\tconsole.log(sample);\n\telm_output.innerHTML = sample.join(\" \");\n}\n\nbtn_ngrams.click();\n\n//# sourceURL=webpack://procgen/./src/js/language/01_better_ngrams.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/language/01_better_ngrams.js"]();
/******/ 	
/******/ })()
;