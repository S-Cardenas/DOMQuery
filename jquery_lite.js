/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DomNodeColection = __webpack_require__(1);
	
	const _documentLoadedCallbacks = [];
	let _docReady = false;
	
	//core method (ie the equivalent of $() in jQuery)
	window.$l = function $l(input) {
	  let output = undefined;
	  switch(typeof(input)) {
	    case "function":
	      addCallBackFunction(input);
	      break;
	    case "string":
	      output = getNodesFromDom(input);
	      break;
	    case "object":
	      if(input instanceof HTMLElement) {
	        output = new DomNodeColection([input]);
	      }
	      break;
	  }
	  return output;
	};
	
	//helper method which uses the DOM API to select html elements
	function getNodesFromDom(selector) {
	  const elementList = document.querySelectorAll(selector);
	  const nodesArray = Array.from(elementList);
	  return new DomNodeColection(nodesArray);
	}
	
	//helper method to add callbacks
	function addCallBackFunction(fn) {
	  if(!_docReady) {
	    _documentLoadedCallbacks.push(fn);
	  }
	  else {
	    fn();
	  }
	}
	
	document.addEventListener('DOMContentLoaded', function() {
	  _docReady = true;
	  _documentLoadedCallbacks.forEach(function(fn) {
	    fn();
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	function DOMNodeCollection(nodesArray) {
	  //receives an array of HTML elements
	  this.nodes = Array.from(nodesArray);
	}
	
	//sets the value of the internal html of all the nodes
	DOMNodeCollection.prototype.html = function(str) {
	  if (typeof str === "string") {
	    this.nodes.forEach(function(node) {
	      node.innerHTML = str;
	    });
	  }
	  if (this.nodes.length > 0) {
	    return this.nodes[0].innerHTML;
	  }
	};
	
	//clears the value of the inner html of all the nodes
	DOMNodeCollection.prototype.empty = function() {
	  this.html('');
	};
	
	//insert content to the end of each element in the set of matched elements
	DOMNodeCollection.prototype.append = function(content) {
	  if (this.nodes.legnth > 0) return;
	  if (typeof content === 'object' && !(content instanceof DOMNodeCollection)) {
	    content = window.$l(content);
	  }
	  if (typeof content === "string") {
	    this.nodes.forEach(function(node) {
	      node.innerHTML += content;
	    });
	  }
	  else if (content instanceof DOMNodeCollection) {
	    let node = this.nodes[0];
	    content.nodes.forEach(function(child) {
	      node.appendChild(child);
	    });
	  }
	};
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map