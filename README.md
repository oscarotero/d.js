# d.js

Micro dom manipulation library. Because jQuery is not needed always.

* Compatible with modern browsers and IE 11
* Installable with NPM `npm install d_js` and bower `bower install d.js`
* Compatible with AMD, commonJS and global javascript
* Only 4Kb (minified)
* HTML & SVG support

## Usage example:

```js
//Get all .buttons elements
var buttons = d.getAll('.buttons');

//Change css properties
d.css(buttons, {
	fontFamily: 'Arial',
	color: 'red',
	transition: 'all 2s'
});

//Handle events
d.on('click', buttons, () => alert('clicked'));
```

## API

### d.get(query)

Returns the first element found:

* **query** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList

```js
var container = d.get('.container');

//Use an object to specify the context
var buttonInContainer = d.get({'.button': container});
```

### d.getAll(query)

Returns `NodeList` with all elements found:

* **query** A string with the selector or an object `{"selector": elementContext}`

```js
d.getAll('.button').forEach(el => el.classList.add('selected'));
```

### d.getSiblings(element, query)

Returns an `Array` with all siblings of another.

* **element** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList
* **query** Optional string to filter the siblings

```js
d.getSiblings('li'); //return all siblings
d.getSiblings('li', '.filtered'); //return all siblings with class '.filtered'
```

### d.on(event, query, callback, useCapture)

Attach an event to the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList
* **callback** The event callback
* **useCapture** (optional)

```js
function clickAction(e) {
	alert('Event ' + e.type);
}

d.on('click', '.button', clickAction);
```

### d.delegate(event, query, target, callback, useCapture)

Delegate an event to the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList
* **target** A string with the target selector
* **callback** The event callback
* **useCapture** (optional)

```js
function clickAction(e) {
	alert('Event ' + e.type);
}

d.on('click', '.navigation', 'a', clickAction);
```

### d.off(event, query, callback, useCapture)

Removes an event from the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList
* **callback** The event callback
* **useCapture** (optional)

```js
d.off('click', '.button', clickAction);
```

### d.trigger(event, query)

Trigger an event of the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, an object `{"selector": elementContext}` or a Node/NodeList

```js
d.trigger('click', '.button');
```

### d.data()

Set/get `data-*` attributes. It can detect and convert primitive types like integers, floats and booleans. If it's an array or object, is converted to json.

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **name** A string with the name of the data attribute or an object with name/values
* **value** The new value of the property

```js
//Get a data value
var clicked = d.data('.button', 'clicked');

//Set a new value
d.data('.button', 'clicked', true);

//Set several values
d.data('.button', {
	boolean: true,
	array: ['blue', 'red', 'green'],
	object: {one: '1', two: 2},
	integer: 123,
	float: 123.45,
});
```

### d.css()

Set/get the css properties of the first element. The vendor prefixes are handled automatically.

* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance
* **prop** A string with the property name or an object with property/values
* **value** The new value of the property

```js
//Get the value
var color = d.css('.button', 'color');

//Set a new value
d.css('.button', 'color', 'blue');

//Set several values
d.css('.button', {
	color: 'red',
	backgroundColor: ['blue', 'red', 'green'], //set different values for each element
	transform: 'rotate(5deg)' //don't care about vendor prefixes
	width: function (el, index) { //use a function to calculate the value for each element
		return (100 + (100*index)) + 'px';
	}
});
```

### d.parse()

Parses html and returns a `DocumentFragment`

* **html** A string with the code to parse

```js
//parse one element
var button = d.parse('<button>Hello</button>').firstChild;

//parse a list of elements
var buttons = d.parse('<button>Hello</button><button>World</button>');
```

## Polyfills

This library provides also some polyfills to add support for some DOM manipulation convenience methods missing in Explorer and Edge:

* `Element.prototype.matches`
* `Element.prototype.closest`
* `Element.prototype.remove`
* `Element.prototype.append`
* `Element.prototype.prepend`
* `Element.prototype.before`
* `Element.prototype.after`
* `Element.prototype.replaceWith`
* `NodeList.prototype.forEach`
* `:scope` selector
