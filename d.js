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

    function selectAll(query, context) {
        if (Array.isArray(query) || query instanceof d) {
            return query;
        }

        if (typeof query === 'string') {
            query = (context || document).querySelectorAll(query);
        }

        if (query instanceof NodeList || query instanceof HTMLCollection) {
            return Array.prototype.slice.call(query);
        }

        return [query];
    }

    function selectOne(query, context) {
        if (typeof query === 'string') {
            return (context || document).querySelector(query);
        }

        if (Array.isArray(query) || query instanceof NodeList || query instanceof HTMLCollection || query instanceof d) {
            return query[0];
        }

        return query;
    }

    function handleEvents (event, query, callback, useCapture, fnName) {
        var elements = selectAll(query);
        useCapture = useCapture || false;

        if (event instanceof Event) {
            event = event.type;
        }

        elements.forEach(function (element) {
            element[fnName](event, callback, useCapture);
        });

        return elements;
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

    function d (query, context) {
        if (this instanceof d) {
            var elements;

            if (typeof query === 'string' && query[0] === '<') {
                elements = d.parse(query) || [];

                if (!Array.isArray(elements)) {
                    elements = [elements];
                }
            } else {
                elements = selectAll(query, context);
            }

            Array.prototype.splice.apply(this, [0, 0].concat(elements));
        } else {
            return new d(query, context);
        }
    };

    d.prototype = Object.create(Array.prototype, {
        on: {
            value: function (event, callback, useCapture) {
                return d.on(event, this, callback, useCapture);
            }
        },
        off: {
            value: function (event, callback, useCapture) {
                return d.off(event, this, callback, useCapture);
            }
        },
        trigger: {
            value: function (event) {
                return d.trigger(event, this);
            }
        },
        css: {
            value: function (prop, value) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);

                return d.css.apply(null, args);
            }
        }
    });

    /*
     * Select the first element
     */
    d.get = function (query, context) {
        return selectOne(query, context);
    };

    /*
     * Select an array of elements
     */
    d.getAll = function (query, context) {
        return selectAll(query, context);
    };

    /*
     * Check whether the element matches with a selector
     */
    d.is = function (element, query) {
        if (typeof query === 'string') {
            return (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector).call(element, query);
        }

        return element === query;
    };

    /*
     * Attach an event to the elements.
     */
    d.on = function (event, query, callback, useCapture) {
        return handleEvents(event, query, callback, useCapture, 'addEventListener');
    };

    /*
     * detach an event from the elements.
     */
    d.off = function (event, query, callback, useCapture) {
        return handleEvents(event, query, callback, useCapture, 'removeEventListener');
    };

    /*
     * dispatch an event.
     */
    d.trigger = function (event, query) {
        var elements = selectAll(query);

        if (typeof event === 'string') {
            if (window.Event) {
                event = new Event(event);
            } else {
                event = document.createEvent('Event');
                event.initEvent(event, true, true);
            }
        }

        elements.forEach(function (element) {
            element.dispatchEvent(event);
        });

        return elements;
    };

    /*
     * Remove elements
     */
    d.remove = function (query) {
        selectAll(query).forEach(function (element) {
            element.parentNode.removeChild(element);
        });
    };

    /*
     * Get/set the styles of elements
     */
    d.css = function (query, prop, value) {
        if (arguments.length < 3 && (typeof prop !== 'object')) {
            var style = getComputedStyle(selectOne(query));

            if (arguments.length === 1) {
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

        var elements = selectAll(query);

        elements.forEach(function (element, index, elements) {
            for (var prop in rules) {
                element.style[styleProp(prop)] = (typeof rules[prop] === 'function') ? rules[prop].call(this, element, index, elements) : rules[prop];
            }
        });

        return elements;
    };

    /*
     * Parses a html code
     */
    d.parse = function (html) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = html;

        if (tmp.body.children.length === 0) {
            return null;
        }

        if (tmp.body.children.length === 1) {
            return tmp.body.children[0];
        }

        return selectAll(tmp.body.children);
    };

    return d;
}));
