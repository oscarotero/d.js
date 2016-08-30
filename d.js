'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.d = factory();
    }
}(this, function () {
    var div = document.createElement('div');

    function d (query) {
        //constructor
        if (this instanceof d) {
            Array.prototype.splice.apply(this, [0, 0].concat(query));
        } else {
            return new d(selectOrParse(query));
        }
    }

    /*
     * Select the first element
     */
    d.get = function (query, context) {
        if (typeof query === 'string') {
            return (context || document).querySelector(query);
        }

        if (query instanceof NodeList || query instanceof HTMLCollection || query instanceof Array) {
            return query[0];
        }

        return query;
    };

    /*
     * Select an array of elements
     */
    d.getAll = function (query, context) {
        if (Array.isArray(query)) {
            return query;
        }

        if (typeof query === 'string') {
            query = (context || document).querySelectorAll(query);
        }

        if (query instanceof NodeList || query instanceof HTMLCollection || query instanceof d) {
            return Array.prototype.slice.call(query);
        }

        return [query];
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
    d.on = function (events, query, callback, useCapture) {
        d.getAll(query).forEach(function (el) {
            events.split(' ').forEach(function (event) {
                el.addEventListener(event, callback, useCapture || false);
            });
        });
    };

    /*
     * detach an event from the elements.
     */
    d.off = function (events, query, callback, useCapture) {
        d.getAll(query).forEach(function (el) {
            events.split(' ').forEach(function (event) {
                el.removeEventListener(event, callback, useCapture || false);
            });
        });
    };

    /*
     * dispatch an event.
     */
    d.trigger = function (event, query, data) {
        if (typeof event === 'string') {
            event = createEvent(event, data);
        }

        d.getAll(query).forEach(function (el) {
            el.dispatchEvent(event);
        });
    };

    /*
     * Remove elements
     */
    d.remove = function (query) {
        d.getAll(query).forEach(function (el) {
            el.parentNode.removeChild(el);
        });
    };

    /*
     * Insert a new element before other
     */
    d.insertBefore = function (query, content) {
        var element = d.get(query);

        if (element) {
            selectOrParse(content).forEach(function (el) {
                element.parentNode.insertBefore(el, element);
            });
        }
    };

    /*
     * Insert a new element after other
     */
    d.insertAfter = function (query, content) {
        var element = d.get(query);

        if (element) {
            selectOrParse(content).reverse().forEach(function (el) {
                element.parentNode.insertBefore(el, element.nextSibling);
            });
        }
    };

    /*
     * Insert a new element as the first child of other
     */
    d.prepend = function (query, content) {
        var element = d.get(query);

        if (element) {
            selectOrParse(content).reverse().forEach(function (el) {
                element.insertBefore(el, element.firstChild);
            });
        }
    };

    /*
     * Insert a new element as the last child of other
     */
    d.append = function (query, content) {
        var element = d.get(query);

        if (element) {
            selectOrParse(content).forEach(function (el) {
                element.appendChild(el);
            });
        }
    };

    /*
     * Get/set the styles of elements
     */
    d.css = function (query, prop, value) {
        if (arguments.length < 3 && (typeof prop !== 'object')) {
            var style = getComputedStyle(d.get(query));

            return (arguments.length === 1) ? style : style[styleProp(prop)];
        }

        var rules = {};

        if (typeof prop === 'object') {
            rules = prop;
        } else {
            rules[prop] = value;
        }

        d.getAll(query).forEach(function (el, index, elements) {
            for (var prop in rules) {
                var val = rules[prop];

                if (typeof val === 'function') {
                    val = val.call(this, el, index, elements);
                } else if (Array.isArray(val)) {
                    val = val[index % val.length];
                }

                el.style[styleProp(prop)] = val;
            }
        });
    };

    /*
     * Parses a html code
     */
    d.parse = function (html, forceArray) {
        div.innerHTML = html;

        if (div.children.length === 0) {
            return forceArray ? [] : null;
        }

        if (div.children.length === 1 && !forceArray) {
            return div.children[0];
        }

        return d.getAll(div.children);
    };


    /******************************
     * Wrapper for chaining
     ******************************/
    d.prototype = Object.create(Array.prototype, {
        on: {
            value: function (event, callback, useCapture) {
                d.on(event, this, callback, useCapture);
                return this;
            }
        },
        off: {
            value: function (event, callback, useCapture) {
                d.off(event, this, callback, useCapture);
                return this;
            }
        },
        trigger: {
            value: function (event, data) {
                d.trigger(event, this, data);
                return this;
            }
        },
        css: {
            value: function (prop) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);

                //getter
                if (args.length < 3 && (typeof prop !== 'object')) {
                    return d.css.apply(null, args);
                }

                d.css.apply(null, args);
                return this;
            }
        },
        insertBefore: {
            value: function (content) {
                d.insertBefore(this, content);
                return this;
            }
        },
        insertAfter: {
            value: function (content) {
                d.insertAfter(this, content);
                return this;
            }
        },
        prepend: {
            value: function (content) {
                d.prepend(this, content);
                return this;
            }
        },
        append: {
            value: function (content) {
                d.append(this, content);
                return this;
            }
        },
        insertBeforeTo: {
            value: function (query) {
                d.insertBefore(query, this);
                return this;
            }
        },
        insertAfterTo: {
            value: function (query) {
                d.insertAfter(query, this);
                return this;
            }
        },
        prependTo: {
            value: function (query) {
                d.prepend(query, this);
                return this;
            }
        },
        appendTo: {
            value: function (query) {
                d.append(query, this);
                return this;
            }
        }
    });


    /******************************
     * Helpers functions
     ******************************/

    function selectOrParse(query) {
        if (typeof query === 'string' && query[0] === '<') {
            return d.parse(query, true) || [];
        }

        return d.getAll(query);
    }

    function styleProp (prop) {
        //camelCase (ex: font-family => fontFamily)
        prop = prop.replace(/(-\w)/g, function (match) {
            return match[1].toUpperCase();
        });

        if (prop in div.style) {
            return prop;
        }

        //prefixed property
        var vendorProp,
            capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            prefixes = ['Moz', 'Webkit', 'O', 'ms'];

        for (var i = 0; i < prefixes.length; i++) {
            vendorProp = prefixes[i] + capProp;
            
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    function createEvent (type, data) {
        var event;

        //native event
        if (('on' + type) in div) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, false);
            return event;
        }

        //custom event
        if (window.CustomEvent) {
            return new CustomEvent(type, {detail: data || {}});
        }

        event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, data || {});
        return event;
    }

    return d;
}));
