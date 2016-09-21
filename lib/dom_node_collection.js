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
