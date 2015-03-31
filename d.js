(function (factory) {
  "strict mode";

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    window.d = factory();
  }
}(function () {
  return {
    get: function (query, context) {
      return (context || document).querySelector(query);
    },

    getAll: function (query, context) {
      return Array.prototype.slice.call((context || document).querySelectorAll(query));
    },

    is: function (element, query) {
      if (typeof query === 'string') {
        return (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector).call(element, query);
      }

      return element === query;
    },

    remove: function (element) {
      element.parentNode.removeChild(element);
    },

    position: function (element, viewport) {
      if (viewport) {
        return element.getBoundingClientRect();
      }

      return {
        left: element.offsetLeft,
        top: element.offsetTop
      };
    },

    css: function (element, ruleName, value) {
      if (value !== undefined) {
        element.style[ruleName] = value;
      } else {
        var style = getComputedStyle(element);

        return (ruleName === undefined) ? style : style[ruleName];
      }
    },

    parse: function (html) {
      var tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = html;

      return Array.prototype.slice.call(tmp.body.children);
    }
  };
}));
