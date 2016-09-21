const DomNodeColection = require('./dom_node_collection');

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
