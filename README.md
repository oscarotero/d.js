# d

Micro dom manipulation library (< 1Kb). Because jQuery is not needed always.

A lot of this code is taken from http://youmightnotneedjquery.com/

## Usage

```js
//returns one element:
var element = d.get('.foo');

//returns all elements as an array
var elements = d.getAll('.foo');

//Check if an element matches with a selector
d.is(element, '.foo');

//Remove the element
d.remove(element);

//Get the element position
d.position(element);

//Get the position relative to viewport
d.position(element, true);

//Get a css property
d.css(element, 'color');

//Get all css properties
var styles = d.css(element);

//Set a css property
d.css(element, 'color', 'blue');

//Parse a html code
var elements = d.parse('<p>Hello world</p>');
```
