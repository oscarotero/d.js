"strict mode";

(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define([], function() {
            return factory();
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.d = factory();
    }
}(this, function () {

    // Helpers functions

    function selectAll(elements, context) {
        if (Array.isArray(elements)) {
            return elements;
        }

        if (typeof elements === 'string') {
            elements = (context || document).querySelectorAll(elements);
        }

        if (elements instanceof NodeList || elements instanceof HTMLCollection) {
            return Array.prototype.slice.call(elements);
        }

        return [elements];
    }

    function selectOne(elements, context) {
        if (typeof elements === 'string') {
            return (context || document).querySelector(elements);
        }

        if (Array.isArray(elements) || elements instanceof NodeList || elements instanceof HTMLCollection) {
            return elements[0];
        }

        return elements;
    }

    function handleEvents (element, event, callback, useCapture, fnName) {
        element = selectAll(element);
        useCapture = useCapture || false;

        if (event instanceof Event) {
            event = event.type;
        }

        element.forEach(function (element) {
            element[fnName](event, callback, useCapture);
        });

        return element;
    }

    var support = {}, div;

    function styleProp (prop) {
        div = div || document.createElement('div');

        //camelCase (ex: font-family => fontFamily)
        prop = prop.replace(/(-\w)/g, function (match) {
            return match[1].toUpperCase();
        });

        if (prop in div.style) {
            return prop;
        }

        if (prop in support) {
            return support[prop];
        }

        var vendorProp,
        capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
        prefixes = ['Moz', 'Webkit', 'O', 'ms'];

        for (var i = 0; i < prefixes.length; i++) {
            vendorProp = prefixes[i] + capProp;
            
            if (vendorProp in div.style) {
                support[prop] = vendorProp;
                return vendorProp;
            }
        }
    }

    return {

        /*
         * Select the first element
         */
        get: function (query, context) {
            return selectOne(query, context);
        },

        /*
         * Select an array of elements
         */
        getAll: function (query, context) {
            return selectAll(query, context);
        },

        /*
         * Check whether the element matches with a selector
         */
        is: function (element, query) {
            if (typeof query === 'string') {
                return (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector).call(element, query);
            }

            return element === query;
        },

        /*
         * Attach an event to the elements.
         */
        on: function (element, event, callback, useCapture) {
            return handleEvents(element, event, callback, useCapture, 'addEventListener');
        },

        /*
         * Detach an event from the elements.
         */
        off: function (element, event, callback, useCapture) {
            return handleEvents(element, event, callback, useCapture, 'removeEventListener');
        },

        /*
         * Dispatch an event.
         */
        trigger: function (element, event) {
            element = selectAll(element);

            if (typeof event === 'string') {
                if (window.Event) {
                    event = new Event(event);
                } else {
                    event = document.createEvent('Event');
                    event.initEvent(event, true, true);
                }
            }

            element.forEach(function (element) {
                element.dispatchEvent(event);
            });

            return element;
        },

        /*
         * Remove elements
         */
        remove: function (element) {
            selectAll(element).forEach(function (element) {
                element.parentNode.removeChild(element);
            });
        },

        /*
         * Get/set the styles of elements
         */
        css: function (element, prop, value) {
            if (value === undefined && (typeof prop !== 'object')) {
                var style = getComputedStyle(selectOne(element));

                if (prop === undefined) {
                    return style;
                }

                return style[styleProp(prop)];
            }

            var rules = {};

            if (typeof prop === 'object') {
                rules = prop;
            } else {
                rules[prop] = value;
            }

            element = selectAll(element);
            
            element.forEach(function (element, index, elements) {
                for (var prop in rules) {
                    element.style[styleProp(prop)] = (typeof rules[prop] === 'function') ? rules[prop].call(this, element, index, elements) : rules[prop];
                }
            });

            return element;
        },

        /*
         * Parses a html code
         */
        parse: function (html) {
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = html;

            if (tmp.body.children.length === 0) {
                return null;
            }

            if (tmp.body.children.length === 1) {
                return tmp.body.children[0];
            }

            return selectAll(tmp.body.children);
        }
    };
}));
