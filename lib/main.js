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
