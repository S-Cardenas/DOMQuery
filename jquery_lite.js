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
	
	$l.ajax = function(options) {
	  let request = new XMLHttpRequest();
	  let defaults = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: function() {},
	    error: function() {},
	    data: {},
	  };
	
	  options = $l.extend(defaults, options);
	  if (options.method.toUpperCase() === "GET"){
	    options.url += "?" + makeQueryString(options.data);
	  }
	
	  request.open(options.method, options.url, true);
	  request.onload = e => {
	    //NB: Triggered when request.readyState === XMLHttpRequest.DONE ===  4
	    if (request.status === 200) {
	      options.success(request.response);
	    } else {
	      options.error(request.response);
	    }
	  };
	
	  request.send(JSON.stringify(options.data));
	};
	
	$l.extend = function(target, ...otherElements) {
	  otherElements.forEach(function(ele) {
	    for (let key in ele) {
	      target[key] = ele[key];
	    }
	  });
	  return target;
	};
	
	
	//make a query string
	function makeQueryString(pojo) {
	  let result = "";
	  for (let key in pojo) {
	    if (pojo.hasOwnProperty(key)) {
	      result += key + "=" + pojo[key] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	}
	
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
	
	//returns DOMNodeCollection of ALL children of all nodes in the array
	DOMNodeCollection.prototype.children = function() {
	  let descendants = [];
	  for (let i = 0; i < this.nodes.length; i++) {
	    let currentChildren = this.nodes[i].children;
	    for (let j = 0; j < currentChildren.length; j++) {
	      descendants.push(currentChildren[j]);
	    }
	  }
	  return new DOMNodeCollection(descendants);
	};
	
	//return DOMNodeColection of the parent(s) of each of the nodes
	DOMNodeCollection.prototype.parent = function() {
	  let ancestors = [];
	  for (let i = 0; i < this.nodes.length; i++) {
	    let currentAncestors = this.nodes[i].parentElement;
	    ancestors.concat(Array.from(currentAncestors));
	  }
	  return new DOMNodeCollection(ancestors);
	};
	
	//finds all nodes matching the selector passed in at are
	//descendants of the nodes
	DOMNodeCollection.prototype.find = function(selector) {
	  var result = [];
	  for (let i = 0; i < this.nodes.length; i++) {
	    let matches = this.nodes[i].querySelectorAll(selector);
	    result.concat(Array.from(matches));
	  }
	  return new DOMNodeCollection(result);
	};
	
	//removes the html of all the nodes in the array from the DOM
	DOMNodeCollection.prototype.remove = function() {
	  for (let i = 0; i < this.nodes.length; i++) {
	    this.nodes[i].remove();
	  }
	  this.nodes = [];
	};
	
	//get the value of an attribute for the first element in the set of matched
	//elements or set one of more attributes for every matched element
	DOMNodeCollection.prototype.attr = function(attributeName, value) {
	  if (!value) {
	    return this.nodes[0].getAttribute(attributeName);
	  }
	  else {
	    for (let i = 0; i < this.nodes.length; i++){
	      this.nodes[i].setAttribute(attributeName, value);
	    }
	  }
	};
	
	//adds the specified class(es) to each element in set of matched elements
	DOMNodeCollection.prototype.addClass = function(className) {
	  if (typeof className === 'string') {
	    for (let i = 0; i < this.nodes.length; i++){
	      this.nodes[i].classList.add(className);
	    }
	  }
	};
	
	//removes the specified class from each element in set of matched elements
	DOMNodeCollection.prototype.removeClass = function(className) {
	  if (typeof className === 'string') {
	    for (let i = 0; i < this.nodes.length; i++){
	      this.nodes[i].classList.remove(className);
	    }
	  }
	};
	
	//on method for DOMNodeCollection
	DOMNodeCollection.prototype.on = function(type, fn) {
	  for (let i = 0; i < this.nodes.length; i++){
	    this.nodes[i].addEventListener(type, fn);
	    let typeKey = `my-${type}`;
	    if (typeof this.nodes[i][typeKey] === "undefined") {
	      this.nodes[i][typeKey] = [];
	    }
	    this.nodes[i].push(fn);
	  }
	};
	
	//off method for DOMNodeCollection
	DOMNodeCollection.prototype.off = function(type) {
	  for (let i = 0; i < this.nodes.length; i++) {
	    let typeKey = `my-${type}`;
	    this.nodes[i][typeKey].forEach(function(fn) {
	      this.nodes[i].removeEventListener(type, fn);
	    }.bind(this));
	    this.nodes[i][typeKey] = [];
	  }
	};
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map