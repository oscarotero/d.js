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

    function d (query, context) {
        //constructor
        if (this instanceof d) {
            if (!Array.isArray(query)) {
                this.push(query);
            } else {
                Array.prototype.splice.apply(this, [0, 0].concat(query));
            }

            return this;
        }

        return new d(selectOrParse(query, context));
    };

    d.prototype = Object.create(Array.prototype, {
        get: {
            value: function (query) {
                for (var i = 0; i < this.length; i++) {
                    var found = selectOne(query, this[i]);

                    if (found) {
                        return new d(found);
                    }
                }
            }
        },
        getAll: {
            value: function (query) {
                var all = [];

                this.forEach(function (el) {
                    selectAll(query, el).forEach(function (found) {
                        if (all.indexOf(found) === -1) {
                            all.push(found);
                        }
                    });
                });

                return new d(all);
            }
        },
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
            value: function (prop, value) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);

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
        },
        toArray: {
            value: function () {
                return Array.prototype.slice.call(this);
            }
        }
    });

    /*
     * Select the first element
     */
    d.get = selectOne;

    /*
     * Select an array of elements
     */
    d.getAll = selectAll;

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
        handleEvents(event, query, callback, useCapture, 'addEventListener');
    };

    /*
     * detach an event from the elements.
     */
    d.off = function (event, query, callback, useCapture) {
        handleEvents(event, query, callback, useCapture, 'removeEventListener');
    };

    /*
     * dispatch an event.
     */
    d.trigger = function (event, query, data) {
        if (typeof event === 'string') {
            event = createEvent(event, data);
        }

        selectAll(query).forEach(function (el) {
            el.dispatchEvent(event);
        });
    };

    /*
     * Remove elements
     */
    d.remove = function (query) {
        selectAll(query).forEach(function (el) {
            el.parentNode.removeChild(el);
        });
    };

    /*
     * Insert a new element before other
     */
    d.insertBefore = function (query, content) {
        var element = selectOne(query);

        selectOrParse(content).forEach(function (el) {
            element.parentNode.insertBefore(el, element);
        });
    };

    /*
     * Insert a new element after other
     */
    d.insertAfter = function (query, content) {
        var element = selectOne(query);

        selectOrParse(content).reverse().forEach(function (el) {
            element.parentNode.insertBefore(el, element.nextSibling);
        });
    };

    /*
     * Insert a new element as the first child of other
     */
    d.prepend = function (query, content) {
        var element = selectOne(query);

        selectOrParse(content).reverse().forEach(function (el) {
            element.insertBefore(el, element.firstChild);
        });
    };

    /*
     * Insert a new element as the last child of other
     */
    d.append = function (query, content) {
        var element = selectOne(query);

        selectOrParse(content).forEach(function (el) {
            element.appendChild(el);
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

        selectAll(query).forEach(function (element, index, elements) {
            for (var prop in rules) {
                element.style[styleProp(prop)] = (typeof rules[prop] === 'function') ? rules[prop].call(this, element, index, elements) : rules[prop];
            }
        });
    };

    /*
     * Parses a html code
     */
    d.parse = function (html) {
        return parse(html, false);
    };


    /******************************
     * Helpers functions
     ******************************/

     var support = {}, div = document.createElement('div');

    function parse(html, forceArray) {
        div.innerHTML = html;

        if (div.children.length === 0) {
            return forceArray ? [] : null;
        }

        if (div.children.length === 1 && !forceArray) {
            return div.children[0];
        }

        return selectAll(div.children);
    }

    function selectOrParse(query, context) {
        if (typeof query === 'string' && query[0] === '<') {
            return parse(query, true) || [];
        }

        return selectAll(query, context);
    }

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

    function styleProp (prop) {
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

        //prefixed property
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

    function createEvent (type, data) {
        //native event
        if (('on' + type) in div) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, false);

            return event;
        }

        //custom event
        if (window.CustomEvent) {
            return new CustomEvent(type, {detail: data || {}});
        }

        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, data || {});
        return event;
    }

    return d;
}));
