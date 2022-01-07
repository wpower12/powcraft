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

/***/ "./src/js/images/00_l_systems.js":
/*!***************************************!*\
  !*** ./src/js/images/00_l_systems.js ***!
  \***************************************/
/***/ (() => {

eval("const in_rules     = document.getElementById(\"rules\");\nconst in_num_iters = document.getElementById(\"num_iters\");\nconst in_line_len  = document.getElementById(\"line_len\");\nconst in_line_w    = document.getElementById(\"line_w\");\nconst in_rand_mag  = document.getElementById(\"rand_mag\");\nconst in_angle     = document.getElementById(\"angle\");\n\nconst cnv = document.getElementById(\"cnv\");\ncnv.style.width = \"100%\"; \ncnv.width = cnv.offsetWidth;\n\n\nfunction applyRules(in_str, rules){\n\tlet out_str = new String(\"\");\n\tfor (var c = 0; c < in_str.length; c++) {\n\t\tlet ch = in_str[c];\n\t\tif(rules.has(in_str[c])){\n\t\t\tout_str = out_str.concat(rules.get(in_str[c]));\n\t\t} else {\n\t\t\tout_str = out_str.concat(in_str[c]);\n\t\t}\n\t}\n\treturn out_str;\n}\n\n\nclass Turtle {\n\tconstructor(canvas){\n\t\tthis.ctx = canvas.getContext('2d');\n\t\tthis.ctx.clearRect(0, 0, canvas.width, canvas.height);\n\t\tthis.x = canvas.width/2;\n\t\tthis.y = canvas.height;\n\t\tthis.facing = 180;\n\t}\n\n\tleft(amt){ this.facing -= amt; }\n\n\tright(amt){ this.facing += amt; }\n\n\tstroke(dist){\n\t\tlet dx = dist*Math.sin((this.facing/360)*2*Math.PI);\n\t\tlet dy = dist*Math.cos((this.facing/360)*2*Math.PI);\n\t\t\n\t\tthis.ctx.lineWidth = parseInt(in_line_w.value);\n\t\tthis.ctx.beginPath();\n\t\tthis.ctx.moveTo(this.x, this.y);\n\t\tthis.ctx.lineTo(this.x+dx, this.y+dy);\n\t\tthis.ctx.stroke(); \n\t\t\n\t\tthis.x += dx;\n\t\tthis.y += dy;\n\t}\n\n\tleaf(){\n\t\tthis.ctx.beginPath();\n\t\tthis.ctx.arc(this.x, \n\t\t\tthis.y, \n\t\t\tparseInt(in_line_w.value), \n\t\t\t0, 2*Math.PI);\n\t\tthis.ctx.fillStyle = \"green\";\n\t\tthis.ctx.fill();\n\t}\n\n\tmove(i, j, dir){\n\t\tthis.x = i;\n\t\tthis.y = j;\n\t\tthis.facing = dir;\n\t}\n}\n\n\nfunction drawSentence(canvas, in_str, line_len, angle){\n\tlet turtle = new Turtle(canvas);\n\tlet stack  = [];\n\tfor (var c = 0; c < in_str.length; c++) {\n\t\tswitch (in_str[c]) {\n\t\t\tcase '1': // Line Segment\n\t\t\t\tturtle.stroke(line_len+in_rand_mag.value*Math.random());\n\t\t\t\tbreak;\n\t\t\tcase '0': // Line Segment, Leaf\n\t\t\t\tturtle.stroke(line_len+in_rand_mag.value*Math.random());\n\t\t\t\tturtle.leaf();\n\t\t\t\tbreak;\n\t\t\tcase '[': // Push (pos, facing), then turn <angle> Left\n\t\t\t\tstack.push([turtle.x, turtle.y, turtle.facing]);\n\t\t\t\tturtle.left(angle+in_rand_mag.value*Math.random());\n\t\t\t\tbreak;\n\t\t\tcase ']': // Pop (pos, facing), then turn <angle> Right\n\t\t\t\tlet s = stack.pop();\n\t\t\t\tturtle.move(s[0], s[1], s[2]);\n\t\t\t\tturtle.right(angle+in_rand_mag.value*Math.random());\n\t\t\t\tbreak;\n\t\t}\n\t}\n}\n\n\nfunction readRules(){\n\tlet rules = new Map();\n\tlet lines = in_rules.value.split(\"\\n\");\n\tlines.forEach(function(line){\n\t\tlet s = line.split(\": \");\n\t\trules.set(`${s[0]}`, s[1]);\n\t});\n\treturn rules;\n}\n\n\nfunction redraw(){\n\tlet pattern_str = \"0\";\n\tlet pattern_rules = readRules();\n\tfor (var n = 0; n < parseInt(in_num_iters.value); n++){\n\t\tpattern_str = applyRules(pattern_str, pattern_rules);\n\t}\n\tdrawSentence(cnv, \n\t\tpattern_str, \n\t\tparseInt(in_line_len.value), \n\t\tparseInt(in_angle.value));\n}\n\nredraw();\nin_num_iters.onclick = redraw;\nin_line_len.onclick = redraw; \nin_line_w.onclick = redraw;   \nin_rand_mag.onclick = redraw; \nin_angle.onclick = redraw;    \n\n//# sourceURL=webpack://procgen/./src/js/images/00_l_systems.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/images/00_l_systems.js"]();
/******/ 	
/******/ })()
;