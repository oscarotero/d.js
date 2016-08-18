# d.js

Micro dom manipulation library. Because jQuery is not needed always.

A lot of this code is taken from http://youmightnotneedjquery.com/

* Compatible with modern browsers and IE >= 10
* Installable with bower `bower install d.js`
* Compatible with AMD, commonJS and global javascript
* Only 3Kb (minified)
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

### get()

Returns the first element found:

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **context** An optional context (by default is `document`)

```js
var container = d.get('.container');
var buttonInContainer = d.get('.button', container);
```

### getAll()

Returns an array with all elements found:

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **context** An optional context (by default is `document`)

```js
d.get('.button').forEach(function (el) {
	el.classList.add('selected');
});
```

### is()

Returns if the element matches with the selector:

* **element** The element
* **query** A string with the selector

```js
d.is(document.body, 'h1'); //false
d.is(document.body, 'body'); //true
```

### on()

Attach an event to the elements

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **event** A string with the event name or an instance of `Event`
* **callback** The event callback
* **useCapture** (optional)

```js
function clickAction(e) {
	alert('Event ' + e.type);
}

d.on('click', '.button', clickAction);
```

### off()

Removes an event from the elements

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **event** A string with the event name or an instance of `Event`
* **callback** The event callback
* **useCapture** (optional)

```js
d.off('click', '.button', clickAction);
```

### trigger()

Trigger an event of the elements

* **event** A string with the event name or an instance of `Event`
* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.trigger('click', '.button');
```

### remove()

Removes the elements from the DOM

* **query** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance

```js
d.remove('.button');
```

### insertAfter()

Insert new elements after other

* **newNodes** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance

```js
d.insertAfter(newNode, 'li:last-child');
```

### insertBefore()

Insert new elements before other

* **newNodes** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance

```js
d.insertBefore(newNode, 'li:first-child');
```

### prepend()

Insert new elements as first children of other element

* **newNodes** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance

```js
d.prepend(newLiNode, 'ul');
```

### append()

Insert new elements as last children of other element

* **newNodes** A string with the selector, array of elements or a Node/NodeList/HTMLCollection instance
* **query** A string with the selector, array of elements or a NodeList/HTMLCollection instance

```js
d.append(newLiNode, 'ul');
```

### css()

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
	backgroundColor: 'blue',
	transform: 'rotate(5deg)' //don't care about vendor prefixes
});
```

### parse()

Parses html code. Returns an element or an array of elements

* **html** A string with the code to parse

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

## Instance API

`d.js` allows to create `d` instances so you can apply some of these methods in a object oriented way:

```js
d('.button') //returns a d instance
	.css({
		color: 'red',
		fontFamily: 'Arial'
	}).
	.on('click', function (e) {
		alert('Button clicked');
	})
	.append('.buttons');

```
