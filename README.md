##**DOMQuery**
Lightweight JavaScript library utilizing native Web API for efficient DOM interaction.
Inspired by jQuery.

##**Public API**
* $l(selector) - find all the html elements that match the selector and create new DOMNodeCollection
* $l(function) - adds a callback to be executed on document ready
* $l(DOMNodeObject) - places a DOMQuery wrapper around the object
* $l.ajax(optionsHash) - asynchronous XMLHttpRequest
* $l.extend(target,[objectA],[objectB]) - concatenate new objects into target

##**DOM Class Manipulation**
* html(input) - sets the value of the internal HTML of all the DOMNodes
* empty() - clears the value of the inner HTML of all the DOMNodes
* append(content) - insert content to the end of each element in the set of matched elements
* children() - returns DOMNodeCollection of ALL children of all nodes in the array
* parent() - return DOMNodeCollection fo the parent(s) of each of the nodes
* find(selector) - finds all the DOMNodes matching the selector passed in that descendants of the nodes
* remove() - removes the HTML of all the nodes in the array from the DOM
* attr(attributeName, value) - get the value of an attribute for the first element in the set of matched elements or set one of more attributes for every matched element
* addClass(className) - adds the specified CSS class(es) to each element in set of matched elements
* removeClass(className) - removes the specified class from each element in set of matched elements
* on(type, function) -  attach an event handler function for one or more events to the selected elements
* off(type) - remove an event handler.
