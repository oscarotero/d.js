'use strict';

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.d = factory();
    }
})(this, function() {
    var div = document.createElement('div');
    var d = {
        /*
         * Select the first element
         */
        get: function(query, context) {
            if (context) {
                return context.querySelector(query);
            }

            if (typeof query === 'string') {
                return document.querySelector(query);
            }

            if (
                query instanceof NodeList ||
                query instanceof HTMLCollection ||
                query instanceof Array
            ) {
                return query[0];
            }

            if (Object.prototype.toString.call(query) === '[object Object]') {
                for (var q in query) {
                    return query[q].querySelector(q);
                }
            }

            return query;
        },

        /*
         * Select all elements
         */
        getAll: function(query, context) {
            if (context) {
                return context.querySelectorAll(query);
            }

            if (query instanceof NodeList) {
                return query;
            }

            if (typeof query === 'string') {
                return document.querySelectorAll(query);
            }

            if (Object.prototype.toString.call(query) === '[object Object]') {
                for (var q in query) {
                    return query[q].querySelectorAll(q);
                }
            }

            throw new Error('Invalid argument to getAll');
        },

        /**
         * Select the siblings of an element
         */
        getSiblings: function(element, query) {
            element = d.get(element);

            if (!element) {
                return [];
            }

            return Array.prototype.filter.call(
                element.parentNode.children,
                function(child) {
                    return (
                        child !== element && (!query || child.matches(query))
                    );
                }
            );
        },

        /*
         * Attach an event to the elements.
         */
        on: function(events, query, callback, useCapture) {
            forceArray(query).forEach(function(el) {
                events.split(' ').forEach(function(event) {
                    el.addEventListener(event, callback, useCapture || false);
                });
            });
        },

        /*
         * Delegate an event to the elements.
         */
        delegate: function(events, query, selector, callback) {
            d.on(
                events,
                query,
                function(event) {
                    for (
                        var target = event.target;
                        target && target !== this;
                        target = target.parentNode
                    ) {
                        if (target.matches(selector)) {
                            callback.call(target, event, target);
                            break;
                        }
                    }
                },
                true
            );
        },

        /*
         * Detach an event from the elements.
         */
        off: function(events, query, callback, useCapture) {
            forceArray(query).forEach(function(el) {
                events.split(' ').forEach(function(event) {
                    el.removeEventListener(
                        event,
                        callback,
                        useCapture || false
                    );
                });
            });
        },

        /*
         * Dispatch an event.
         */
        trigger: function(event, query, data) {
            if (typeof event === 'string') {
                event = createEvent(event, data);
            }

            forceArray(query).forEach(function(el) {
                el.dispatchEvent(event);
            });
        },

        /*
         * Get/set the styles of elements
         */
        css: function(query, prop, value) {
            if (arguments.length < 3 && typeof prop !== 'object') {
                var style = getComputedStyle(d.get(query));

                return arguments.length === 1 ? style : style[styleProp(prop)];
            }

            var rules = {};

            if (typeof prop === 'object') {
                rules = prop;
            } else {
                rules[prop] = value;
            }

            forceArray(query).forEach(function(el, index, elements) {
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
        },

        /*
         * Get/set data-* attributes
         */
        data: function(query, name, value) {
            if (
                arguments.length < 3 &&
                (typeof name !== 'object' || Array.isArray(name))
            ) {
                var element = d.get(query);

                if (!name) {
                    name = Object.keys(element.dataset);
                }

                if (Array.isArray(name)) {
                    var values = {};

                    name.forEach(function(name) {
                        if (element.dataset[name]) {
                            values[name] = dataValue(element.dataset[name]);
                        }
                    });

                    return values;
                }

                if (!element || !element.dataset[name]) {
                    return;
                }

                return dataValue(element.dataset[name]);
            }

            var values = {};

            if (typeof name === 'object') {
                values = name;
            } else {
                values[name] = value;
            }

            forceArray(query).forEach(function(el) {
                for (var name in values) {
                    var value = values[name];

                    if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    }

                    el.dataset[name] = value;
                }
            });
        },

        /*
         * Parses a html code
         */
        parse: function(html, includeTextNodes) {
            var tmp = document.implementation.createHTMLDocument('');
            tmp.body.innerHTML = html;
            return toFragment(
                includeTextNodes ? tmp.body.childNodes : tmp.body.children
            );
        }
    };

    /******************************
     * Polyfills
     ******************************/

    // http://caniuse.com/#search=matches
    if (!('matches' in Element.prototype)) {
        Element.prototype.matches =
            Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }

    // http://caniuse.com/#feat=element-closest
    if (!('closest' in Element.prototype)) {
        Element.prototype.closest = function(query) {
            var ancestor = this;

            do {
                if (ancestor.matches(query)) {
                    return ancestor;
                }

                ancestor = ancestor.parentElement;
            } while (ancestor !== null);

            return ancestor;
        };
    }

    // http://caniuse.com/#feat=childnode-remove
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }

    // http://caniuse.com/#feat=dom-manip-convenience
    if (!('append' in Element.prototype)) {
        Element.prototype.append = function() {
            this.appendChild(toFragment(arguments));
        };
    }

    if (!('prepend' in Element.prototype)) {
        Element.prototype.prepend = function() {
            this.insertBefore(toFragment(arguments), this.firstChild);
        };
    }

    if (!('before' in Element.prototype)) {
        Element.prototype.before = function() {
            this.parentNode.insertBefore(toFragment(arguments), this);
        };
    }

    if (!('after' in Element.prototype)) {
        Element.prototype.after = function() {
            this.parentNode.insertBefore(
                toFragment(arguments),
                this.nextSibling
            );
        };
    }

    if (!('replaceWith' in Element.prototype)) {
        Element.prototype.replaceWith = function() {
            this.parentNode.replaceChild(toFragment(arguments), this);
        };
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
    if (!('forEach' in NodeList.prototype)) {
        NodeList.prototype.forEach = function(callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    // https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
    // Polyfill https://github.com/lazd/scopedQuerySelectorShim
    try {
        div.querySelectorAll(':scope *');
    } catch (e) {
        // Match usage of scope
        var scopeRegexp = /:scope/g;

        // Overrides
        ['querySelector', 'querySelectorAll'].forEach(function(methodName) {
            var original = HTMLElement.prototype[methodName];

            // Override the method
            HTMLElement.prototype[methodName] = function(query) {
                if (!query.match(scopeRegexp)) {
                    return original.call(this, query);
                }

                var nodeList, removeId;

                // Temporary container
                if (!this.parentNode) {
                    div.appendChild(this);
                }

                // Temporary id
                if (!this.id) {
                    this.id = Math.random()
                        .toString()
                        .replace('0.', 'id_' + Date.now());
                    removeId = true;
                }

                nodeList = original.call(
                    this.parentNode,
                    query.replace(scopeRegexp, '#' + this.id)
                );

                if (removeId) {
                    this.id = '';
                }

                if (this.parentNode === div) {
                    div.removeChild(this);
                }

                return nodeList;
            };
        });
    }

    /******************************
     * Helpers functions
     ******************************/

    function forceArray(query) {
        if (query instanceof Node) {
            return [query];
        }

        return d.getAll(query);
    }

    function toFragment(args) {
        var fragment = document.createDocumentFragment();

        Array.prototype.slice.call(args).forEach(function(item) {
            fragment.appendChild(
                item instanceof Node
                    ? item
                    : document.createTextNode(String(item))
            );
        });

        return fragment;
    }

    function styleProp(prop) {
        //camelCase (ex: font-family => fontFamily)
        prop = prop.replace(/(-\w)/g, function(match) {
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

    function dataValue(value) {
        switch (value.toLowerCase()) {
            case 'true':
                return true;

            case 'false':
                return false;

            case 'undefined':
                return undefined;

            case 'null':
                return null;
        }

        var s = value.substr(0, 1);
        var e = value.substr(-1);

        if ((s === '[' && e === ']') || (s === '{' && e === '}')) {
            return JSON.parse(value);
        }

        if (/^\d+$/.test(value)) {
            return parseInt(value);
        }

        if (/^\d+\.\d+$/.test(value)) {
            return parseFloat(value);
        }

        return value;
    }

    function createEvent(type, data) {
        var event;

        //native event
        if ('on' + type in div) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, false);
            return event;
        }

        //custom event
        if (typeof window.CustomEvent === 'function') {
            return new CustomEvent(type, { detail: data || {} });
        }

        event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, data || {});
        return event;
    }

    return d;
});
