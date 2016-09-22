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

//finds all nodes matching the selector passed in that are
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
