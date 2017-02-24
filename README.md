# d.js

Micro dom manipulation library. Because jQuery is not needed always.

A lot of this code is taken from http://youmightnotneedjquery.com/

* Compatible with modern browsers and IE >= 10
* Installable with bower `bower install d.js`
* Compatible with AMD, commonJS and global javascript
* Only 4Kb (minified)
* HTML & SVG support

## Usage example:

```js
//Get an array with all .buttons elements
var buttons = d.getAll('.buttons');

//Change css properties
d.css(buttons, {
	fontFamily: 'Arial',
	color: 'red',
	transition: 'all 2s'
});

//Handle events
d.on('click', buttons, function () {
	alert('clicked');
});
```

## API

### d.get(query)

Returns the first element found:

* **query** A string with the selector, array of elements, an object or a Node/NodeList/HTMLCollection instance

```js
var container = d.get('.container');

//Use an object to specify the context
var buttonInContainer = d.get({'.button': container});
```

### d.getAll(query)

Returns an array with all elements found:

* **query** A string with the selector, array of elements, an object or a Node/NodeList/HTMLCollection instance

```js
d.get('.button').forEach(function (el) {
	el.classList.add('selected');
});
```

### d.is(element, query)

Returns if the element matches with the selector:

* **element** The element
* **query** A string with the selector

```js
d.is(document.body, 'h1'); //false
d.is(document.body, 'body'); //true
```

### d.on(event, query, callback, useCapture)

Attach an event to the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
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
* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
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
* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **callback** The event callback
* **useCapture** (optional)

```js
d.off('click', '.button', clickAction);
```

### d.trigger(event, query)

Trigger an event of the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.trigger('click', '.button');
```

### d.remove(query)

Removes the elements from the DOM

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.remove('.button');
```

### d.insertAfter(query, content)

Insert new elements after other

* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance
* **content** A string with the selector or html content, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.insertAfter('li:last-child', newNodes);
d.insertAfter('li:last-child', '<li>new content</li>');
```

### d.insertBefore(query, content)

Insert new elements before other

* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance
* **content** A string with the selector or html content, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.insertBefore('li:first-child', newNodes);
d.insertBefore('li:first-child', '<li>new content</li>');
```

### d.prepend(query, content)

Insert new elements as first children of other element

* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance
* **content** A string with the selector or html content, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.prepend('ul', newLiNode);
d.prepend('ul', '<li>new content</li>');
```

### d.append(query, content)

Insert new elements as last children of other element

* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance
* **content** A string with the selector or html content, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.append('ul', newLiNode);
d.append('ul', '<li>new content</li>');
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

Parses html code. Returns an element or an array of elements

* **html** A string with the code to parse
* **forceArray** To return an array of elements even if just one element has been parsed

```js
//parse one element
var button = d.parse('<button>Hello</button>');
button.classList.add('active');

//parse a list of elements
var buttons = d.parse('<button>Hello</button><button>World</button>');

buttons.forEach(function (el) {
	el.classList.add('active');
});
```

## Chaining

`d.js` allows to create `d` instances so you can chain some of these methods. Example:

```js
d('.button')
	.css({
		color: 'red',
		fontFamily: 'Arial'
	}).
	.on('click', function (e) {
		alert('Button clicked');
	})
	.append('.buttons');

//You can create new elements on the fly:
d('<button>Click me</button>')
	.css({
		color: 'red',
		fontFamily: 'Arial'
	})
	.on('click', function () {
		alert('Hi!');
	})
	.appendTo('.buttons');
```

Chainable methods:

Method | Description
------ | -----------
`.on(event, callback, useCapture)` | Attach an event.
`.off(event, callback, useCapture)` | Removes an event.
`.delegate(event, target, callback, useCapture)` | Delegates an event.
`.trigger(event, data)` | Trigger an event
`.css(props|prop, value)` | Get/set css properties
`.insertBefore(content|query)` | Insert new elements before the element
`.insertAfter(content|query)` | Insert new elements after the element
`.prepend(content|query)` | Insert new elements as first children
`.append(content|query)` | Insert new elements as last children
`.insertBeforeTo(query)` | Insert the element before other element
`.insertAfterTo(query)` | Insert the element after other element
`.prependTo(query)` | Insert the element as first child of other element
`.appendTo(query)` | Insert the element as last child of other element
