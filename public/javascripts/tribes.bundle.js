/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/tribes/Simulation.js":
/*!*************************************!*\
  !*** ./src/js/tribes/Simulation.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Unit_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Unit.js */ \"./src/js/tribes/Unit.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"./src/js/tribes/Utils.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar Simulation = /*#__PURE__*/function () {\n  function Simulation(canvas) {\n    _classCallCheck(this, Simulation);\n\n    this.canvas = canvas;\n    this.scale = 8;\n    this.size = this.getSize();\n    this.ctx = this.canvas.getContext('2d');\n    this.units = [];\n    this.fps = 10;\n    this.fillfactor = 50;\n    this.look = 2; // Setup input handler\n    // this.input = new InputHandler(this);\n    // this.input.setFieldsFPS($('#fpsfield'), $('#fps'))\n    //         .setFieldsFill($('#fillfield'), $('#fill'))\n    //         .setFieldsScale($('#scalefield'), $('#scale'))\n    //         .setFieldsLookR($('#lookfield'), $('#look'));\n    // this.input.attachInputs();\n\n    this.reset(); //Main loop\n\n    self = this;\n\n    var tick = function tick() {\n      self.update();\n      self.draw();\n      setTimeout(function () {\n        requestAnimationFrame(tick);\n      }, 1000 / self.fps); //console.log(1);\n    };\n\n    tick(); //Start the show\n  }\n\n  _createClass(Simulation, [{\n    key: \"update\",\n    value: function update() {\n      //Update Nearest Neighbors\n      this.clearWorld();\n      var u;\n\n      for (var i = 0; i < this.units.length; i++) {\n        u = this.units[i];\n        this.world[u.loc.x][u.loc.y] = u;\n      } //Update each unit\n\n\n      for (var unit = 0; unit < this.units.length; unit++) {\n        var u = this.units[unit];\n        var friends = true;\n        var alpha = true;\n        var target;\n        var targets = []; //Get nearest neighbors\n\n        for (var i = -1 * this.look; i < this.look + 1; i++) {\n          for (var j = -1 * this.look; j < this.look + 1; j++) {\n            if (!(i == 0 && j == 0)) {\n              var xc = u.loc.x + i;\n              var yc = u.loc.y + j;\n\n              if (xc >= 0 && yc >= 0 && xc < this.size.x && yc < this.size.y) {\n                var c = this.world[xc][yc];\n\n                if (c instanceof _Unit_js__WEBPACK_IMPORTED_MODULE_0__.default) {\n                  if (c.tribe != u.tribe) {\n                    friends = false; //If really close, make them the target\n\n                    if (i > -2 && i < 2 && j > -2 && j < 2) {\n                      target = c;\n                      targets.push(c);\n                    }\n                  } else if (c.str > u.str) {\n                    alpha = false;\n                  }\n                }\n              }\n            }\n          }\n        } //If everyone is on your team and everyone is less str than you, revolt\n\n\n        if (friends && alpha) {\n          //Revolt\n          u.tribe = u.id;\n        } else if (target != 0) {\n          var tar;\n\n          for (var t = 0; t < targets.length; t++) {\n            tar = targets[t]; //Attack target - Bigger strength transfers tribeID\n\n            if (tar.str > u.str) {\n              u.tribe = tar.tribe;\n            } else if (tar.str < u.str) {\n              tar.tribe = u.tribe;\n            } else {\n              //Equal case is random\n              var r = Math.floor(Math.random() * 2);\n\n              if (r == 0) {\n                tar.tribe = u.tribe;\n              } else {\n                u.tribe = tar.tribe;\n              }\n            }\n          }\n        } //Everyone walks each loop.\n\n\n        var s = Math.floor(Math.random() * 2);\n        var t = Math.floor(Math.random() * 2) * 2 - 1;\n        var deltax = 0;\n        var deltay = 0;\n\n        if (s == 0) {\n          deltax = t;\n        } else {\n          deltay = t;\n        } //u.attemptMove(deltax, deltay, world);\n\n\n        var nx = u.loc.x + deltax;\n        var ny = u.loc.y + deltay; //if (inside(nx, ny, world) && empty(nx, ny, world)) {\n\n        if (nx >= 0 && nx < this.size.x && ny >= 0 && ny < this.size.y && this.world[nx][ny] === 0) {\n          this.world[u.loc.x][u.loc.y] = 0;\n          this.world[nx][ny] = u;\n          u.loc.x = nx;\n          u.loc.y = ny;\n        }\n      }\n    }\n  }, {\n    key: \"draw\",\n    value: function draw() {\n      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      this.drawGrid(); //Draw each unit\n\n      for (var i = 0; i < this.units.length; i++) {\n        var val = this.units[i];\n        var c = this.colors.get(val.tribe);\n        this.ctx.beginPath();\n        this.ctx.fillStyle = c;\n        this.ctx.rect(this.size.x0 + this.scale * val.loc.x + 2, this.size.y0 + this.scale * val.loc.y + 2, this.scale - 3, this.scale - 3);\n        this.ctx.fill();\n      }\n    }\n  }, {\n    key: \"drawGrid\",\n    value: function drawGrid() {\n      // this.ctx.fillStyle(\"grey\");\n      this.ctx.strokeStyle = \"darkgrey\";\n      this.ctx.lineWidth = 1;\n\n      for (var i = 0; i < this.size.x + 1; i++) {\n        this.ctx.beginPath();\n        this.ctx.moveTo(i * this.scale + this.size.x0 + 0.5, this.size.y0 + 0.5);\n        this.ctx.lineTo(i * this.scale + this.size.x0 + 0.5, this.size.y0 + this.size.h + 0.5);\n        this.ctx.stroke();\n      }\n\n      for (var j = 0; j < this.size.y + 1; j++) {\n        this.ctx.beginPath();\n        this.ctx.moveTo(this.size.x0 + 0.5, j * this.scale + this.size.y0 + 0.5);\n        this.ctx.lineTo(this.size.x0 + this.size.w + 0.5, j * this.scale + this.size.y0 + 0.5);\n        this.ctx.stroke();\n      }\n    }\n  }, {\n    key: \"getSize\",\n    value: function getSize() {\n      //Return 0 point of drawing grid, width of grid in pixels/cells\n      var width = this.canvas.width;\n      var height = this.canvas.height;\n      var xn = Math.floor((width - this.scale) / this.scale);\n      var yn = Math.floor((height - this.scale) / this.scale);\n      return {\n        x: xn,\n        y: yn,\n        w: xn * this.scale,\n        h: yn * this.scale,\n        x0: (width - xn * this.scale) / 2,\n        y0: (height - yn * this.scale) / 2\n      };\n    }\n  }, {\n    key: \"clearWorld\",\n    value: function clearWorld() {\n      this.world = [];\n\n      for (var i = 0; i < this.size.x; i++) {\n        this.world[i] = [];\n\n        for (var j = 0; j < this.size.y; j++) {\n          this.world[i][j] = 0;\n        }\n      }\n    }\n  }, {\n    key: \"reset\",\n    value: function reset() {\n      //Update Size\n      this.size = this.getSize();\n      this.clearWorld();\n      this.units = []; //Fill new units\n\n      var n = this.size.x * this.size.y * this.fillfactor * 0.01;\n      this.colors = new _Utils_js__WEBPACK_IMPORTED_MODULE_1__.ColorPicker(n); //Used later when drawing units\n\n      for (var i = 1; i < n + 1; i++) {\n        var collision = true;\n\n        while (collision) {\n          var xr = Math.floor(Math.random() * this.size.x);\n          var yr = Math.floor(Math.random() * this.size.y);\n          var str = Math.floor(Math.random() * 5);\n\n          if (!(this.world[xr][yr] instanceof _Unit_js__WEBPACK_IMPORTED_MODULE_0__.default)) {\n            this.units.push(new _Unit_js__WEBPACK_IMPORTED_MODULE_0__.default(i, str, i, xr, yr));\n            this.world[xr][yr] = this.units[i - 1];\n            collision = false;\n          }\n        }\n      }\n    }\n  }]);\n\n  return Simulation;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Simulation);\n\n//# sourceURL=webpack://powcraft/./src/js/tribes/Simulation.js?");

/***/ }),

/***/ "./src/js/tribes/Unit.js":
/*!*******************************!*\
  !*** ./src/js/tribes/Unit.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Unit = function Unit(id, str, tribe, x, y) {\n  _classCallCheck(this, Unit);\n\n  this.id = id;\n  this.str = str;\n  this.tribe = tribe;\n  this.loc = {\n    x: x,\n    y: y\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Unit);\n\n//# sourceURL=webpack://powcraft/./src/js/tribes/Unit.js?");

/***/ }),

/***/ "./src/js/tribes/Utils.js":
/*!********************************!*\
  !*** ./src/js/tribes/Utils.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ColorPicker\": () => (/* binding */ ColorPicker)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar ColorPicker = /*#__PURE__*/function () {\n  function ColorPicker(n) {\n    _classCallCheck(this, ColorPicker);\n\n    this.s = 90;\n    this.l = 45;\n    this.delta = 360 / n;\n  }\n\n  _createClass(ColorPicker, [{\n    key: \"get\",\n    value: function get(c) {\n      var ret = 'hsl(' + c * this.delta + ',' + this.s + '%,' + this.l + '%' + ')';\n      return ret;\n    }\n  }]);\n\n  return ColorPicker;\n}();\n\n//# sourceURL=webpack://powcraft/./src/js/tribes/Utils.js?");

/***/ }),

/***/ "./src/js/tribes/main.js":
/*!*******************************!*\
  !*** ./src/js/tribes/main.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Simulation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Simulation.js */ \"./src/js/tribes/Simulation.js\");\n\nvar canvas = document.getElementById('tribescanvas');\nconsole.log(canvas);\nvar sim = new _Simulation_js__WEBPACK_IMPORTED_MODULE_0__.default(canvas);\n\n//# sourceURL=webpack://powcraft/./src/js/tribes/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/tribes/main.js");
/******/ 	
/******/ })()
;