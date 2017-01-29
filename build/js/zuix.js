!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.zuix=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

/**
 * Task Queue Manager
 *
 * @class TaskQueue
 * @constructor
 */
function TaskQueue(listener) {
    var _t = this;
    _t._worker = null;
    _t._taskList = [];
    _t._requests = [];
    if (listener == null)
        listener = function () { };
    _t.taskQueue = function (tid, fn) {
        _t._taskList.push({
            tid: tid,
            fn: fn,
            status: 0,
            end: function () {
                this.status = 2;
            }
        });
        _t.check();
    };
    _t.check = function () {
        if (_t._worker != null)
            clearTimeout(_t._worker);
        _t._worker = setTimeout(function () {
            _t.taskCheck();
        }, 10);
    };
    _t.taskCheck = function () {
        var next = -1;
        for (var i = 0; i < _t._taskList.length; i++) {
            if (next != -2 && _t._taskList[i].status == 0) {
                next = i;
            }
            else if (_t._taskList[i].status == 1) {
                next = -2;
                _t.check();
                listener(_t, 'load:step', {
                    task: _t._taskList[i].tid
                });
                return;
            }
            else if (_t._taskList[i].status == 2) {
                listener(this, 'load:next', {
                    task: _t._taskList[i].tid
                });
                _t._taskList.splice(i, 1);
                _t.check();
                return;
            }
        }
        if (next >= 0) {
            _t._taskList[next].status = 1;
            (_t._taskList[next].fn).call(_t._taskList[next]);
            _t.check();
            listener(_t, 'load:begin', {
                task: _t._taskList[next].tid
            });
        } else {
            listener(_t, 'load:end');
        }
    }
}
TaskQueue.prototype.queue = function(tid, fn) {
    return this.taskQueue(tid, fn);
};
/**
 * Request a lock for throttle invocation
 *
 * @param {function} handlerFn
 * @returns {boolean}
 */
TaskQueue.prototype.requestLock = function(handlerFn) {
    if (handlerFn._taskerLock != null)
        return false;
    handlerFn._taskerLock = true;
    return true;
};
TaskQueue.prototype.releaseLock = function(handlerFn) {
    // Throttle rate 100ms (+ execution time)
    setTimeout(function () {
        delete handlerFn._taskerLock;
    }, 100);
};
/**
 * Debounce. The calling function must also call 'requestLock'.
 *
 * @param {function} handlerFn
 * @param {function} callback
 * @param {number} delay
 * @returns {boolean}
 */
TaskQueue.prototype.lockLater = function(handlerFn, callback, delay) {
    var _t = this;
    if (handlerFn._taskerLock == null)
        callback();
    else {
        if (handlerFn._taskerTimeout == null) {
            handlerFn._taskerTimeout = true;
            handlerFn._taskerTimeout = setTimeout(function () {
                delete handlerFn._taskerTimeout;
                _t.lockLater(handlerFn, callback, delay);
            }, delay);
        }
    }
    return true;
};

module.exports = TaskQueue;
},{}],2:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

// Generic utility class
module.exports = {

    isNoU: function (obj) {
        return (typeof obj === 'undefined' || obj === null);
    },

    isFunction: function (f) {
        return typeof f === 'function';
    },

    objectEquals: function (x, y) {
        if (x === null || x === undefined || y === null || y === undefined) {
            return x === y;
        }
        // after this just checking type of one would be enough
        if (x.constructor !== y.constructor) {
            return false;
        }
        // if they are functions, they should exactly refer to same one (because of closures)
        if (x instanceof Function) {
            return x === y;
        }
        // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
        if (x instanceof RegExp) {
            return x === y;
        }
        if (x === y || x.valueOf() === y.valueOf()) {
            return true;
        }
        if (Array.isArray(x) && x.length !== y.length) {
            return false;
        }

        // if they are dates, they must had equal valueOf
        if (x instanceof Date) {
            return false;
        }

        // if they are strictly equal, they both need to be object at least
        if (!(x instanceof Object)) {
            return false;
        }
        if (!(y instanceof Object)) {
            return false;
        }

        // recursive object equality check
        var p = Object.keys(x);
        return Object.keys(y).every(function (i) {
                return p.indexOf(i) !== -1;
            }) &&
            p.every(function (i) {
                return util.objectEquals(x[i], y[i]);
            });
    },

    propertyFromPath: function (o, s) {
        if (typeof s !== 'string') return;
        s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        var ref = o;
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (typeof ref[k] !== 'undefined') {
                ref = ref[k];
            } else {
                return;
            }
        }
        return ref;
    },

    cloneObject: function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // give temp the original obj's constructor
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = cloneObject(obj[key]);
        return temp;
    },

    // work-around for lint eval error
    evalJs: eval

};
},{}],3:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var util = _dereq_('./Util.js');

/**
 *
 * @callback IterationCallback
 * @param {number} i Iteration count
 */

/**
 *
 * @callback ZxQueryIterationCallback
 * @param {number} i Iteration count
 * @param {ZxQuery} zxElement Current element
 * @param {Element} [this]
 */

/**
 * ZxQuery, a very lite subset of jQuery-like functions
 * internally used in Zuix.
 *
 * The constructor takes one optional argument that can be
 * a DOM element, a node list or a valid DOM query selector string expression.
 * If no parameter is given, the ZxQuery will wrap the root *document* element.
 *
 * @class ZxQuery
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [element]
 * @return {ZxQuery} The *ZxQuery* instance object.
 * @constructor
 */
function ZxQuery(element) {
    /** @protected */
    this._selection = [];

    if (typeof element === 'undefined')
        element = document.documentElement;

    if (element instanceof ZxQuery)
        return element;
    else if (element instanceof HTMLCollection || element instanceof NodeList || Array.isArray(element))
        this._selection = element;
    else if (element instanceof HTMLElement || element instanceof Node)
        this._selection = [element];
    else if (typeof element === 'string')
        this._selection = document.documentElement.querySelectorAll(element);
    else if (element !== null) { //if (typeof element === 'string') {
        console.log(typeof element);
        throw(element);
    }
    return this;
}
/**
 * Number of elements in current DOM selection.
 * @return {Number} Number of DOM elements in the current selection.
 */
ZxQuery.prototype.length = function () {
    return this._selection.length;
};
/**
 * Get the closest parent matching the selector filter.
 * @param {string} filter A valid DOM query selector filter
 * @return {ZxQuery} A new *ZxQuery* object with the *parent* selection.
 */
ZxQuery.prototype.parent = function (filter) {
    if (!util.isNoU(filter))
        return new ZxQuery(z$.getClosest(this._selection[0], filter));
    return new ZxQuery(this._selection[0].parentNode);
};
/**
 * Get the children matching the given selector filter.
 * @param {string} filter A valid DOM query selector filter
 * @return {ZxQuery}  A new *ZxQuery* object with the *children* selection.
 */
ZxQuery.prototype.children = function (filter) {
    // TODO: implement filtering
    if (!util.isNoU(filter))
        return new ZxQuery(this._selection[0].querySelectorAll(filter));
    return new ZxQuery(this._selection[0].children);
};
/**
 * Reverse the order of elements in current selection.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.reverse = function () {
    var elements = (Array.prototype.slice).call(this._selection, 0);
    this._selection = elements.reverse();
    return this;
};
/**
 * Get the DOM element at given position in the current selection.
 * If no index is provided, the default element will be returned
 * (the one at position 0).
 * @param {number} i Position of element
 * @return {Node|Element} The *DOM* element
 */
ZxQuery.prototype.get = function (i) {
    if (util.isNoU(i)) i = 0;
    return this._selection[i];
};
/**
 * Get the ZxQuery object for then element at the given
 * position in the current selection.
 * @param {number} i Position of element
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.eq = function (i) {
    return new ZxQuery(this._selection[i]);
};
/**
 * Select all descendants matching the given *DOM* query selector filter.
 * @param {string} selector A valid *DOM* query selector
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.find = function (selector) {
    return new ZxQuery(this._selection[0].querySelectorAll(selector));
};
/**
 * Iterate through all *DOM* elements in the selection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * *DOM* element corresponding the current iteration.
 * `index` will be the iteration count, and `item`
 * a `{ZxQuery}` instance wrapping the current *DOM* element.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 * @param {ZxQueryIterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.each = function (iterationCallback) {
    z$.each(this._selection, iterationCallback);
    return this;
};
/**
 * Gets or sets the given element attribute.
 * @param {string} attr The attribute name
 * @param {string|undefined} [val] The attribute value
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.attr = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].getAttribute(attr);
    else
        this.each(function (k, v) {
            this.setAttribute(attr, val);
        });
    return this;
};
/**
 * Trigger a component event.
 * @param {string} eventPath Path of the event to trigger.
 * @param {object} eventData Value of the event.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.trigger = function (eventPath, eventData) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventPath, {detail: eventData});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventPath, true, true, eventData);
    }
    this.each(function (k, v) {
        this.dispatchEvent(event);
    });
    return this;
};
/**
 * Listen once for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.one = function (eventPath, eventHandler) {
    var fired = false;
    this.on(eventPath, function (a, b) {
        if (fired) return;
        fired = true;
        z$(this).off(eventPath, eventHandler);
        (eventHandler).call(this, a, b);
    });
    return this;
};
/**
 * Listen for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.on = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, v) {
        var _t = this;
        z$.each(events, function (k, v) {
            _t.addEventListener(v, eventHandler, false);
        });
    });
    return this;
};
/**
 * Stop listening for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.off = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, v) {
        var _t = this;
        z$.each(events, function (k, v) {
            _t.removeEventListener(v, eventHandler);
        });
    });
    return this;
};
/**
 * Returns *true* if the element is empty.
 * @return {boolean} *true* if the element is empty, *false* otherwise
 */
ZxQuery.prototype.isEmpty = function () {
    return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
/**
 * Sets or gets the given css property.
 * @param {string} attr The CSS property name
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* css value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.css = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].style[attr];
    else
        this.each(function (k, v) {
            this.style[attr] = val;
        });
    return this;
};
/**
 * Adds the given css class to the element class list.
 * @param {string} className The css class name.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.addClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, v) {
        if (this.classList) {
            var _t = this;
            z$.each(classes, function (k, v) {
                _t.classList.add(v);
            });
        } else this.className += ' ' + className;
    });
    return this;
};
/**
 * Returns *true* if the element contains the given css class.
 * @param {string} className The css class name.
 * @return {boolean} *true* if the element has the *className* css class, *false* otherwise
 */
ZxQuery.prototype.hasClass = function (className) {
    return z$.hasClass(this._selection[0], className);
};
/**
 * Removes the given css class to the element class list.
 * @param {string} className The css class name.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.removeClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, v) {
        if (this.classList) {
            var _t = this;
            z$.each(classes, function (k, v) {
                _t.classList.remove(v);
            });
        } else this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
    return this;
};
/**
 * Moves to the previous sibling in the DOM.
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.prev = function () {
    return new ZxQuery(this._selection[0].previousElementSibling);
};
/**
 * Moves to the next sibling in the DOM.
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.next = function () {
    return new ZxQuery(this._selection[0].nextElementSibling);
};
/**
 * Gets or sets the HTML markup.
 * @param {string|undefined} [htmlText] HTML markup text.
 * @return {ZxQuery}
 */
ZxQuery.prototype.html = function (htmlText) {
    if (util.isNoU(htmlText))
        return this._selection[0].innerHTML;
    this.each(function (k, v) {
        this.innerHTML = htmlText;
    });
    return this;
};
/**
 * Appends the given element/markup to the current element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.append = function (el) {
    if (typeof el === 'string')
        this._selection[0].innerHTML += el;
    else
        this._selection[0].appendChild(el);
    return this;
};
/**
 * Prepends the given element/markup to the current element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.prepend = function (el) {
    if (typeof el === 'string')
        this._selection[0].innerHTML = el + this._selection[0].innerHTML;
    else
        this._selection[0].insertBefore(el, this._selection[0].innerHTML.firstElementChild);
    return this;
};
/**
 * Gets or sets the css display property.
 * @param {string|undefined} [mode] The display value.
 * @return {string|ZxQuery} The *display* css value when no *mode* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.display = function (mode) {
    if (util.isNoU(mode))
        return this._selection[0].style.display;
    z$.each(this._selection, function (k, v) {
        this.style.display = mode;
    });
    return this;
};
/**
 * Gets or sets the css visibility property.
 * @param {string|undefined} [mode] The visibility value.
 * @return {string|ZxQuery} The *visibility* css value when no *mode* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.visibility = function (mode) {
    if (util.isNoU(mode))
        return this._selection[0].style.visibility;
    z$.each(this._selection, function (k, v) {
        this.style.visibility = mode;
    });
    return this;
};
/**
 * Sets the css display property to ''.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.show = function () {
    return this.display('');
};
/**
 * Sets the css display property to 'none'.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.hide = function () {
    return this.display('none');
};


/**
 * Exported ZxQuery interface.
 *
 * @param [what] {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined}
 * @returns {ZxQuery}
 */
var z$ = function (what) {
    return new ZxQuery(what);
};
z$.find = function (filter) {
    return z$().find(filter);
};
/**
 * Iterate through all objects in the given `items` collection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * object corresponding the current iteration and
 * the `index` passed to the callback will be the iteration count.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 *
 * @param {Array<Object>} items Enumerable objects collection.
 * @param {ZxQueryIterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {z$} `this`.
 */
z$.each = function (items, iterationCallback) {
    if (items != null)
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item instanceof Element)
                item = z$(item);
            if (iterationCallback.call(items[i], i, item) === false)
                break;
        }
    return this;
};
z$.hasClass = function(el, className) {
    var classes = className.match(/\S+/g) || [];
    var success = false;
    z$.each(classes, function (k, v) {
        if (el.classList)
            success = el.classList.contains(v);
        else
            success = (new RegExp('(^| )' + v + '( |$)', 'gi').test(el.className));
        if (success) return false;
    });
    return success;
};
z$.ajax = function ajax(opt) {
    var url;
    if (!util.isNoU(opt) && !util.isNoU(opt.url))
        url = opt.url;
    else
        url = opt;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            if (util.isFunction(opt.success)) opt.success(xhr.responseText);
        }
        else {
            if (util.isFunction(opt.error)) opt.error(xhr);
        }
        if (util.isFunction(opt.then)) opt.then(xhr);
    };
    xhr.send();
    return this;
};
z$.wrapElement = function (containerTag, element) {
    //$(element).wrap($('<'+containerTag+'/>'));
    //return element;
    /** @type Element */
    var container = document.createElement(containerTag);
    if (typeof element === 'string')
        container.innerHTML = element;
    else
    // TODO: test this, it may not work
        container.appendChild(element);
    return container;
};
z$.wrapCss = function (wrapperRule, css) {
    var wrapReX = /([.,\w])([^/{};]+)({)/g;
    var r, result = null, wrappedCss = '';
    while (r = wrapReX.exec(css)) {
        if (result != null)
            wrappedCss += wrapperRule + ' ' + css.substring(result.index, r.index);
        result = r;
    }
    if (result != null)
        wrappedCss += wrapperRule + ' ' + css.substring(result.index);
    if (wrappedCss != '') {
        css = wrappedCss;
    }
    return css;
};
z$.appendCss = function (css, target) {
    var style = null, head;
    if (typeof css === 'string') {
        // output css
        head = document.head || document.getElementsByTagName('head')[0];
        style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet)
            style.styleSheet.cssText = css;
        else
            style.appendChild(document.createTextNode(css));
    } else if (css instanceof Element) style = css;
    // remove previous style node
    if (!util.isNoU(target))
        head.removeChild(target);
    if (!util.isNoU(style))
        head.appendChild(style);
    return style;
};
z$.getClosest = function (elem, selector) {
    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};
z$.getPosition = function (el) {
    var visible = z$.isInView(el);
    var x = 0, y = 0;
    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var scrollX = el.scrollLeft || document.documentElement.scrollLeft;
            var scrollY = el.scrollTop || document.documentElement.scrollTop;
            x += (el.offsetLeft - scrollX + el.clientLeft);
            y += (el.offsetTop - scrollY + el.clientTop);
        } else {
            // for all other non-BODY elements
            x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            y += (el.offsetTop - el.scrollTop + el.clientTop);
        }
        el = el.offsetParent;
    }
    return {
        x: x,
        y: y,
        visible: visible
    };
};
z$.isInView = function (el) {
    if (el.offsetParent === null)
        return false;
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0
        && rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        && rect.top < (window.innerHeight || document.documentElement.clientHeight);
    /* or $(window).height() */
};
z$.ZxQuery = ZxQuery;

// Element.matches() polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
            }
            return i > -1;
        };
}
// window.CustomEvent polyfill for IE>=9
(function () {
    if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

module.exports =  z$;

},{"./Util.js":2}],4:[function(_dereq_,module,exports){
/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('zuix', function () {
            return (root.zuix = (factory).call(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = (factory).call(root);
    } else {
        // Browser globals
        root.zuix = (factory).call(root);
    }
}(this, _dereq_('./zuix/Zuix.js')));
},{"./zuix/Zuix.js":7}],5:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var z$ =
    _dereq_('../helpers/ZxQuery');
var util =
    _dereq_('../helpers/Util');

/***
 * TODO: describe this class...
 *
 * @param {ContextOptions} options The context options.
 * @returns {ComponentContext} The component context instance.
 * @constructor
 */

function ComponentContext(options, eventCallback) {

    this._options = null;
    this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
    this.componentId = null;
    this.trigger = function(context, eventPath, eventValue) {
        if (typeof eventCallback === 'function')
            eventCallback(context, eventPath, eventValue);
    };

    /** @protected */
    this._container = null;

    /** @protected */
    this._model = null;
    /** @protected */
    this._view = null;
    /** @protected */
    this._css = null;
    /** @protected */
    this._style = null;
    /**
     * @protected
     * @type {ContextControllerHandler}
     */
    this._controller = null;

    /**
     * Define the local behavior handler for this context instance only.
     * Any global behavior matching the same `componentId` will be overridden.
     *
     * @function behavior
     * @param handler_fn {function}
     */
    this.behavior = null;

    /** @protected */
    this._eventMap = [];
    /** @protected */
    this._behaviorMap = [];

    /**
     * --@-protected
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}

ComponentContext.prototype.options = function (options) {
    if (options == null)
        return this._options;
    this._options = options;
    if (options.componentId != null)
        this.componentId = options.componentId;
    this.container(options.container);
    this.view(options.view);
    if (typeof options.css !== 'undefined')
        this.style(options.css);
    this.controller(options.controller);
    this.model(options.model);
    return this;
};

/**
 * TODO: describe
 * @event ComponentContext#ready
 * @param {ComponentContext} context The component context instance.
 */
ComponentContext.prototype.ready = function (context) {
};

/**
 * TODO: describe
 * @event ComponentContext#error
 * @param {ComponentContext} context The component context instance.
 * @param {Object} error The error object
 */
ComponentContext.prototype.error = function (context, error) {
};


/**
 * TODO: describe
 * @param a
 * @param b
 */
ComponentContext.prototype.on = function (a, b) {
    // TODO: throw error if _c (controller instance) is not yet ready
    return this._c.on(a, b);
};

/***
 *
 * @param {ContextModel|undefined} [model]
 * @returns {ComponentContext|Object}
 */
ComponentContext.prototype.model = function (model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.modelToView();
    return this;
};
/**
 *
 * @return {ComponentContext}
 */
ComponentContext.prototype.viewToModel = function() {
    var _t = this;
    this._model = {};
    // create data model from inline view fields
    z$(this._view).find('[data-ui-field]').each(function () {
        var field = z$(this);
        if (field.parent('pre,code').length() > 0)
            return true;
        var name = field.attr('data-ui-field');
        var value = '';
        switch(this.tagName.toLowerCase()) {
            // TODO: complete binding cases
            case 'img':
                value = this.src;
                break;
            case 'input':
                value = this.value;
                break;
            default:
                value = this.innerHTML;
        }
        // dotted field path
        if (name.indexOf('.')>0) {
            var path = name.split('.');
            var cur = _t._model;
            for (var p = 0; p < path.length - 1; p++) {
                if (typeof cur[path[p]] === 'undefined')
                    cur[path[p]] = {};
                cur = cur[path[p]];
            }
            cur[path[path.length - 1]] = value;
        } else _t._model[name] = value;
    });
    return this;
};
/**
 *
 * @return {ComponentContext}
 */
ComponentContext.prototype.modelToView = function () {
    if (this._view != null && this._model != null) {
        var _t = this;
        z$(this._view).find('[data-ui-field]').each(function () {
            var field = z$(this);
            if (field.parent('pre,code').length() > 0)
                return true;
            var boundField = field.attr('data-bind-to');
            if (boundField == null)
                boundField = field.attr('data-ui-field');
            if (typeof _t._model === 'function')
                (_t._model).call(_t._view, this, boundField);
            else {
                var boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(_t._view, this, boundField);
                } else if (boundData != null) {
                    // try to guess target property
                    switch (this.tagName.toLowerCase()) {
                        // TODO: complete binding cases
                        case 'img':
                            this.src = boundData;
                            break;
                        case 'input':
                            this.value = boundData;
                            break;
                        default:
                            this.innerHTML = boundData;
                    }
                }
            }
        });
        // TODO: deprecate this
        //if (!util.isNoU(this._c) && util.isFunction(this._c.refresh))
        //    this._c.refresh();
    }
    return this;
};

/***
 *
 * @param {string|Element|undefined} [css]
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.style = function (css) {
    if (typeof css === 'undefined') return this._style;
    if (css == null || css instanceof Element) {

        this._css = (css instanceof Element) ? css.innerText : css;
        this._style = z$.appendCss(css, this._style);

    } else if (typeof css === 'string') {

        // store original unparsed css (might be useful for debugging)
        this._css = css;

        // nest the CSS inside [data-ui-component='<componentId>']
        // so that the style is only applied to this component type
        css = z$.wrapCss('[data-ui-component="' + this.componentId + '"]:not(.zuix-css-ignore)', css);

        // trigger `css:parse` hook before assigning content to the view
        var hookData = { content: css };
        this.trigger(this, 'css:parse', hookData);
        css = hookData.content;

        // output css
        this._style = z$.appendCss(css, this._style);

    }
    // TODO: should throw error if ```css``` is not a valid type
    return this;
};
/**
 *
 * @param callback
 * @returns {ComponentContext}
 */
ComponentContext.prototype.loadCss = function (options) {
    var context = this;

    var cssPath = context.componentId + ".css?" + new Date().getTime();
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.path))
        cssPath = options.path;

    z$.ajax({
        url: cssPath,
        success: function (viewCss) {
            context.style(viewCss);
            if (util.isFunction(options.success))
                (options.success).call(context);
        },
        error: function (err) {
            console.log(err, context);
            if (util.isFunction(options.error))
                (options.error).call(context, err);
        },
        then: function () {
            if (util.isFunction(options.then))
                (options.then).call(context);
        }
    });

    return this;
};

/***
 *
 * @param {Element|string|undefined} [view]
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.view = function (view) {
    if (typeof view === 'undefined') return this._view;
    if (typeof view === 'string') {
        // load view from HTML source

        // trigger `html:parse` hook before assigning content to the view
        var hookData = {content: view};
        this.trigger(this, 'html:parse', hookData);
        view = hookData.content;

        if (this._container != null) {
            // append view content to the container
            this._view = this._container;
            this._view.innerHTML += view;
        } else {
            var viewDiv = z$.wrapElement('div', view);
            if (this._view != null)
                this._view.innerHTML = viewDiv.innerHTML;
            else this._view = viewDiv;
        }

        z$(this._view).find('script').each(function () {
            if (this.getAttribute('zuix-loaded') !== 'true') {
                this.setAttribute('zuix-loaded', 'true');
                (eval).call(window, this.innerHTML);
                /*
                 var clonedScript = document.createElement('script');
                 clonedScript.setAttribute('zuix-loaded', 'true');
                 clonedScript.onload = function () {
                 // TODO: ...
                 };
                 if (!util.isNoU(this.type) && this.type.length > 0)
                 clonedScript.type = this.type;
                 if (!util.isNoU(this.text) && this.text.length > 0)
                 clonedScript.text = this.text;
                 if (!util.isNoU(this.src) && this.src.length > 0)
                 clonedScript.src = this.src;
                 this.parentNode.insertBefore(clonedScript, this);
                 */
            }
        });

        // trigger `view:process` hook when the view is ready to be processed
        this.trigger(this, 'view:process', z$(this._view));

    } else {
        // load inline view
        if (this._container != null) {
            this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
            this._view.removeAttribute('data-ui-view');
            this._container.appendChild(this._view);
            this._view = this._container;
        } else this._view = view;
    }

    var v = z$(this._view);
    if (this._options.css === false)
    // disable local css styling for this instance
        v.addClass('zuix-css-ignore');
    else
    // enable local css styling
        v.removeClass('zuix-css-ignore');

    this.modelToView();

    return this;
};
ComponentContext.prototype.loadHtml = function(options) {
    var context = this;

    var htmlPath = context.componentId;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.path))
        htmlPath = options.path;

    // TODO: check if view caching is working in this case too
    var inlineView = z$().find('[data-ui-view="' + htmlPath + '"]:not([data-ui-component*=""])');
    if (inlineView.length() > 0) {
        var inlineElement = inlineView.get(0);
        if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement)))
            // TODO: test this case
            context.view(inlineElement);
        else
            context.view(inlineElement.outerHTML);
        if (util.isFunction(options.success))
            (options.success).call(context);
        if (util.isFunction(options.then))
            (options.then).call(context);
    } else {
        if (htmlPath == context.componentId)
            htmlPath +=  '.html?' + new Date().getTime();
        z$.ajax({
            url: htmlPath,
            success: function (viewHtml) {
                context.view(viewHtml);
                if (util.isFunction(options.success))
                    (options.success).call(context);
            },
            error: function (err) {
                console.log(err, context);
                if (util.isFunction(options.error))
                    (options.error).call(context, err);
            },
            then: function () {
                if (util.isFunction(options.then))
                    (options.then).call(context);
            }
        });
    }

    return this;
};

/***
 *
 * @param {ContextControllerHandler|undefined} [controller]
 * @returns {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function (controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};
/***
 *
 * @param {ViewContainer} [container]
 * @returns {ComponentContext|Node}
 */
ComponentContext.prototype.container = function (container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else this._container = container;
    return this;
};


module.exports = ComponentContext;
},{"../helpers/Util":2,"../helpers/ZxQuery":3}],6:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var z$ =
    _dereq_('../helpers/ZxQuery');


/**
 * TODO: complete JSDoc
 *
 * @param {ComponentContext} context
 * @returns {ContextController}
 * @constructor
 */
function ContextController(context) {
    var _t = this;

    /** @protected */
    this.context = context;

    // TODO: should improve/deprecate this.componentId?
    this.componentId = context.componentId;

    this._view = null;
    /**
     * TODO: desc
     *
     * @param what {(Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined)}
     * @return {ZxQuery}
     */
    this.view = function (what) {
        if (context.view() != null || this._view !== context.view())
            return this._view = (what == null ? z$(context.view())
                : typeof what === 'string' ? z$(context.view()).find(what)
                    : z$(what));
        else if (this._view !== null)
            return this._view;
        else
            throw({
                message: 'Not attacched to a view yet.',
                source: this
            });
    };
    /** @type {object} */
    this.model = function (model) {
        return context.model(model)
    };
    /** @type {function} */
    this.expose = function (methodName, handler) {
        context[methodName] = handler;
    };
    /** @type {function} */
    this.behavior = function () {
        return context.behavior;
    };

    /** @protected */
    this._childNodes = [];
    /** @type {function} */
    this.saveView = function () {
        this.restoreView();
        this.view().children().each(function () {
            _t._childNodes.push(this);
        });
    };
    this.restoreView = function() {
        if (this._childNodes.length > 0) {
            _t.view().html('');
            z$.each(_t._childNodes, function () {
                _t.view().append(this);
            });
            this._childNodes.length = 0;
        }
    };

    /** @type {function} */
    this.loadHtml = function(options) {
        this.saveView();
        return context.loadHtml(options);
    };

    /** @type {function} */
    this.loadCss = function(options) {
        return context.loadCss(options);
    };

    /** @protected */
    this._fieldCache = [];

    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.resume = null;
    /** @type {function} */
    this.pause = null;
    /** @type {function} */
    this.destroy = null;
    /** @type {function} */
    this.refresh = null;
    /** @type {function} */
    this.event = null; // UI event stream handler (eventPath,eventValue)

    /** @type {function} */
    this.trigger = function (eventPath, eventData) {
        if (context._eventMap[eventPath] == null)
            this.addEvent(this.view(), eventPath, null);
        // TODO: ...
        _t.view().trigger(eventPath, eventData);
    };
    /** @type {function} */
    this.on = function (eventPath, handler_fn) {
        this.addEvent(this.view(), eventPath, handler_fn);
        // TODO: implement automatic event unbinding (off) in super().destroy()
    };
    /** @protected */
    this.mapEvent = function (eventMap, target, eventPath, handler_fn) {
        if (target != null) {
            var t = z$(target);
            t.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler_fn;
            t.on(eventPath, this.eventRouter);
        } else {
            // TODO: should report missing target
        }
    };
    /** @protected */
    this.eventRouter = function (e) {
        //if (typeof _t.behavior() === 'function')
        //    _t.behavior().call(_t.view(), a, b);
        if (typeof context._behaviorMap[e.type] === 'function')
            context._behaviorMap[e.type].call(context.view(), e, e.detail);
        if (typeof context._eventMap[e.type] === 'function')
            context._eventMap[e.type].call(context.view(), e, e.detail);
        // TODO: else-> should report anomaly
    };

    // create event map from context options
    var options = context.options(), handler = null;
    if (options.on != null) {
        for (var ep in options.on) {
            handler = options.on[ep];
            // TODO: should log.warn if k already exists
            _t.addEvent(context.view(), ep, handler);
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
        for (var bp in options.behavior) {
            handler = options.behavior[bp];
            // TODO: should log.warn if k already exists
            _t.addBehavior(context.view(), bp, handler);
        }
    }

    context.controller().call(this, this);

    return this;
}

// TODO: add jsDoc
ContextController.prototype.addEvent = function (target, eventPath, handler_fn) {
    this.mapEvent(this.context._eventMap, target, eventPath, handler_fn);
    return this;
};

// TODO: add jsDoc
ContextController.prototype.addBehavior = function (target, eventPath, handler_fn) {
    this.mapEvent(this.context._behaviorMap, target, eventPath, handler_fn);
    return this;
};
/***
 * Search and cache this view elements.
 *
 * @param {!string} field Name of the `data-ui-field` to search
 * @returns {ZxQuery}
 */
ContextController.prototype.field = function (field) {
    var _t = this, el = null;
    if (typeof this._fieldCache[field] === 'undefined') {
        el = this.view().find('[data-ui-field=' + field + ']');
        if (el != null) {
            // ZxQuery base methods override
            el.on = function (eventPath, eventHandler) {
                if (typeof eventHandler === 'string') {
                    var eh = eventHandler;
                    eventHandler = function () { _t.trigger(eh); }
                }
                z$.ZxQuery.prototype.on.call(el, eventPath, eventHandler);
            };
            this._fieldCache[field] = el;
        }
    } else {
        el = this._fieldCache[field];
    }
    return el;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};

module.exports = ContextController;
},{"../helpers/ZxQuery":3}],7:[function(_dereq_,module,exports){
/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var util =
    _dereq_('../helpers/Util');
var z$ =
    _dereq_('../helpers/ZxQuery');
var TaskQueue =
    _dereq_('../helpers/TaskQueue');
var ComponentContext =
    _dereq_('./ComponentContext');
var ContextController =
    _dereq_('./ContextController');

/**
 * @const
 */
var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';

/**
 *  ZUIX, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @returns {Zuix}
 */
function Zuix() {
    return this;
}

/**
 * @private
 * @type {!Array<ComponentCache>}
 */
var _componentCache = [];

/** @private */
var _contextSeqNum = 0;
/**
 * @private
 * @type {!Array<ComponentContext>}
 */
var _contextRoot = [];

/** @private */
var _hooksCallbacks = [];

/** @private */
var _globalHandlers = {};

/** @private */
var _lazyQueued = []; // Lazy loading - queued elements
/** @private */
var _lazyLoaders = []; // "data-ui-lazyload" elements

/** @private **/
var tasker = new TaskQueue(function (tq, eventPath, eventValue) {
    trigger(tq, eventPath, eventValue);
});

/**
 * Initializes a controller ```handler```.
 *
 * @private
 * @param handler {ContextControllerHandler}
 * @return {ContextControllerHandler}
 */
function controller(handler) {
    if (typeof handler['for'] !== 'function')
        handler['for'] = function (componentId) {
            _globalHandlers[componentId] = handler;
            return handler;
        };
    return handler;
}

/**
 * Searches and returns elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @private
 * @param {!string} fieldName The class to check for.
 * @param {!Element} [container] Starting DOM element for this search (**default:** ```document```)
 * @return {ZxQuery}
 */
function field(fieldName, container) {
    // TODO: implement caching ?
    return z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]');
}

/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 *
 * @private
 * @param [element] {Element} Optional container to use as starting node for the search.
 */
function componentize(element) {
    // Throttle method
    if (tasker.requestLock(componentize)) {
        z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])').each(function () {
            this.style.visibility = 'hidden';
            // override lazy loading if 'lazyload' is set to 'false' for the current element
            if (!lazyLoad() || this.getAttribute('data-ui-lazyload') == 'false') {
                loadInline(this);
                return true;
            }
            // defer element loading if lazy loading is enabled and the element is not in view
            var lazyContainer = z$.getClosest(this, '[data-ui-lazyload=true]');
            if (lazyContainer !== null) {
                if (_lazyLoaders.indexOf(lazyContainer) == -1) {
                    _lazyLoaders.push(lazyContainer);
                    z$(lazyContainer).on('scroll', function () {
                        componentize(lazyContainer);
                    });
                }
                var position = z$.getPosition(this);
                if (!position.visible) {
                    if (_lazyQueued.indexOf(this) == -1) {
                        _lazyQueued.push(this);
                    }
                    // Not in view: defer element loading and
                    // process next inline element
                    return true;
                }
            }
            // proceed loading inline element
            var queued = _lazyQueued.indexOf(this);
            if (queued > -1)
                _lazyQueued.splice(queued, 1);
            loadInline(this);
        });
        tasker.releaseLock(componentize);
    } else tasker.lockLater(componentize, function () {
        componentize(element);
    }, 200);
}

/** @protected */
function loadInline(element) {
    var v = z$(element);
    if (v.attr('data-ui-loaded') === 'true' || v.parent('pre,code').length() > 0) {
        console.log("ZUIX", "WARN", "Skipped", element);
        return;
    }
    v.attr('data-ui-loaded', 'true');
    /** @type {ContextOptions} */
    var options = v.attr('data-ui-options');
    if (!util.isNoU(options)) {
        options = util.propertyFromPath(window, options);
        // copy passed options
        options = util.cloneObject(options) || {};
    } else options = {};

    // Automatic view/container selection
    if (util.isNoU(options.view) && !v.isEmpty()) {
        options.view = element;
        options.viewDeferred = true;
    } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty())
        options.container = element;

    var componentId = v.attr('data-ui-load');
    if (util.isNoU(componentId)) {
        // Static include should not have any controller
        componentId = v.attr('data-ui-include');
        v.attr('data-ui-component', componentId);
        // disable controller auto-loading
        if (util.isNoU(options.controller))
            options.controller = function () {
            }; // null
    }

    // inline attributes have precedence over ```options```

    var model = v.attr('data-bind-model');
    if (!util.isNoU(model) && model.length > 0)
        options.model = util.propertyFromPath(window, model);

    // TODO: Behavior are also definable in "data-ui-behavior" attribute
    // TODO: Events are also definable in "data-ui-on" attribute
    // TODO: perhaps "data-ui-ready" and "data-ui-error" too
    // util.propertyFromPath( ... )

    load(componentId, options);
}

/**
 * Loads a component with the given options.
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
    // TODO: throw error on argument mismatch
    // TODO: prevent load loops when including recursively a component

    /** @type {ComponentContext} */
    var ctx = null;
    if (!util.isNoU(options)) {
        // check if context has its unique id assigned
        if (!util.isNoU(options.contextId)) {
            // if it does, try to pick it from allocated contexts list
            ctx = context(options.contextId);
            if (ctx !== null) {
                ctx.options(options);
            } else {
                // if no context is already allocated
                // with that id, then add a new one
                ctx = createContext(options);
            }
        } else {
            if (options === false)
                options = {};
            // generate contextId (this is a bit buggy, but it's quick)
            options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
            ctx = createContext(options);
        }
    } else {
        // empty context
        options = {};
        ctx = new ComponentContext(options, trigger);
    }

    // assign the given component (widget) to this context
    if (ctx.componentId != componentId) {
        ctx.componentId = componentId;
        /*
         TODO: to be fixed
         if (!util.isNoU(context.view())) {
         // TODO: implement this code in a context.detach() method
         //context.controller().pause()
         context.view().detach();
         context.view(null);
         }*/
    }

    if (util.isFunction(options.ready))
        ctx.ready = options.ready;
    if (util.isFunction(options.error))
        ctx.error = options.error;

    if (util.isNoU(options.view)) {

        // pick it from cache if found
        var cachedComponent = getCachedComponent(ctx.componentId);
        if (cachedComponent !== null && util.isNoU(ctx.controller()))
            ctx.controller(cachedComponent.controller);

        if (cachedComponent !== null && cachedComponent.view != null)
            ctx.view(cachedComponent.view);
        else {
            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(ctx.view())) {
                // Load View
                tasker.queue('html:' + ctx.componentId, function () {
                    var task = this;

                    ctx.loadHtml({
                        success: function () {
                            if (options.css !== false)
                                ctx.loadCss({
                                    error: function (err) {
                                        console.log(err, ctx);
                                    },
                                    then: function () {
                                        loadController(ctx);
                                    }
                                });
                            else {
                                loadController(ctx);
                            }
                        },
                        error: function (err) {
                            console.log(err, ctx);
                            if (util.isFunction(options.error))
                                (ctx.error).call(ctx, err);
                        },
                        then: function () {
                            task.end();
                        }
                    });

                });
                // defer controller loading
                return ctx;
            }
        }
    } else {
        ctx.view(options.view);
    }
    loadController(ctx);
    return ctx;
}

/**
 * Unload and dispose the component.
 *
 * @private
 * @param context {ComponentContext}
 */
function unload(context) {
    if (!util.isNoU(context) && !util.isNoU(context._c)) {
        if (!util.isNoU(context._c.view()))
            context._c.view().attr('data-ui-component', null);

        //context.unregisterEvents();
        // TODO: unregister events and local context behavior
        // TODO: detach view from parent if context.container is not null

        if (util.isFunction(context._c.destroy))
            context._c.destroy();
    }
}

/** @private */
function createContext(options) {
    var context = new ComponentContext(options, trigger);
    _contextRoot.push(context);
    return context;
}

/**
 * TODO: desc
 *
 * @private
 * @param {Element} contextId
 * @return {ComponentContext}
 */
function context(contextId) {
    var context = null;
    z$.each(_contextRoot, function (k, v) {
        if ((contextId instanceof Element && v.view() === contextId)
            || util.objectEquals(v.contextId, contextId)) {
            context = v;
            return false;
        }
    });
    return context;
}

/** @private */
function removeContext(contextId) {
    // TODO: removeContext
}

/**
 * TODO: desc
 *
 * @private
 * @param path
 * @param handler
 */
function hook(path, handler) {
    if (util.isNoU(handler))
        return _hooksCallbacks[path];
    _hooksCallbacks[path] = handler;
}

/**
 * TODO: desc
 *
 * @private
 * @param context
 * @param path
 * @param data
 */
function trigger(context, path, data) {

    // TODO: call all registered callback
    if (util.isFunction(_hooksCallbacks[path]))
        _hooksCallbacks[path].call(context, path, data);

    // ZUIX Componentizer is the last executed hook (built-in)
    if (path == 'view:process')
        componentize(data);
}

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
function lazyLoad(enable) {
    if (enable != null)
        _disableLazyLoading = !enable;
    return !_isCrawlerBotClient && !_disableLazyLoading;
}


/*********************** private members *************************/


/** @private */
function removeCachedComponent(componentId) {
    // TODO: removeCachedComponent
}

/***
 * @private
 * @param {Object} componentId
 * @returns {ComponentCache}
 */
function getCachedComponent(componentId) {
    var cached = null;
    z$.each(_componentCache, function (k, v) {
        if (util.objectEquals(v.componentId, componentId)) {
            cached = v;
            return false;
        }
    });
    return cached;
}

/***
 * @private
 * @param {ComponentContext} context
 */
function loadController(context) {
    if (typeof context.options().controller === 'undefined' && context.controller() === null) {
        if (util.isFunction(_globalHandlers[context.componentId])) {
            context.controller(_globalHandlers[context.componentId]);
            createComponent(context);
        } else
            tasker.queue('js:' + context.componentId, function () {
                var task = this;
                z$.ajax({
                    url: context.componentId + ".js?" + new Date().getTime(),
                    success: function (ctrlJs) {
                        // TODO: improve js parsing!
                        try {
                            var fn = ctrlJs.indexOf('function');
                            var il = ctrlJs.indexOf('.load');
                            if (il > 1 && il < fn)
                                ctrlJs = ctrlJs.substring(0, il - 4);
                            var ih = ctrlJs.indexOf('.controller');
                            if (ih > 1 && ih < fn)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            var ec = ctrlJs.indexOf('//<--controller');
                            if (ec > 0)
                                ctrlJs = ctrlJs.substring(0, ec);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                        }
                    },
                    error: function (err) {
                        console.log(err, context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    },
                    then: function () {
                        task.end();
                        createComponent(context);
                    }
                });
            });
    } else {
        createComponent(context);
    }
}

/***
 * @private
 * @param context {ComponentContext}
 */
function createComponent(context) {
    if (!util.isNoU(context.view())) {
        if (!context.options().viewDeferred) {
            var cached = getCachedComponent(context.componentId);
            if (cached === null) {
                var html = (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
                var c = z$.wrapElement('div', html);
                _componentCache.push({
                    componentId: context.componentId,
                    view: c.innerHTML,
                    controller: context.controller()
                });
            }
        }
        initComponent(context);
    } else {
        // TODO: report error
    }
}

/***
 * @private
 * @param {ComponentContext} context
 */
function initComponent(context) {
    if (util.isFunction(context.controller())) {
        /** @type {ContextController} */
        var c = context._c = new ContextController(context);

        if (!util.isNoU(c.view())) {
            c.view().attr('data-ui-component', c.componentId);
            // if no model is supplied, try auto-create from view fields
            if (util.isNoU(context.model()) && !util.isNoU(context.view()))
                context.viewToModel();
            c.trigger('view:apply');
            if (context.options().viewDeferred) {
                context.options().viewDeferred = false;
                // save the original inline view
                // before loading the view template
                // it can be then restored with c.restoreView()
                c.saveView();
                if (context.options().css !== false)
                    context.loadCss();
                if (context.options().html !== false)
                    context.loadHtml();
            }

            c.view().css('visibility', '');
        }

        // TODO: review/improve life-cycle

        if (util.isFunction(c.create)) c.create();
        c.trigger('view:create');

        // TODO: is this to be deprecated?
        //if (util.isFunction(c.resume)) c.resume();
    }
    if (util.isFunction(context.ready))
        (context.ready).call(context);
}

/***
 * @private
 * @param javascriptCode string
 * @returns {ContextControllerHandler}
 */
// TODO: refactor this method name
function getController(javascriptCode) {
    var instance = function (ctx) {
    };
    if (typeof javascriptCode === 'string') {
        try {
            instance = (eval).call(this, javascriptCode);
        } catch (e) {
            // TODO: should trigger a global hook
            // eg. 'controller:error'
            console.log(this, e, javascriptCode);
        }
    }
    return instance;
}

// Browser Agent / Bot detection
/** @private */
/** @private */
var _isCrawlerBotClient = false, _disableLazyLoading = false;
if (navigator && navigator.userAgent)
    _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
        .test(navigator.userAgent);
if (_isCrawlerBotClient)
    console.log(navigator.userAgent, "is a bot, ignoring 'data-ui-lazyload' option.");


/******************* proto ********************/


/**
 * Initializes a controller ```handler```.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
```
 *
 * @param {ContextControllerHandler} handler The controller handler function.
 * @return {ContextControllerHandler} The initialized controller handler.
 */
Zuix.prototype.controller = controller;
/**
 * Searches and returns elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-field="container-div">
   <!-- container HTML -->
</div>
```

<small>**Example - JavaScript**</small>
```js
var containerDiv = zuix.field('container-div');
containerDiv.html('Hello World!');
```
 *
 * @param {!string} fieldName The class to check for.
 * @param {!Element} [container] Starting DOM element for this search (**default:** ```document```)
 * @return {ZxQuery}
 */
Zuix.prototype.field = field;
/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 * This is to be called if adding dynamically content
 * with elements that declare the above attributes.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.componentize(document);
```
 *
 * @param {Element} [element] Optional container to use as starting node for the search.
 * @return {Zuix}
 */
Zuix.prototype.componentize = function (element) {
    componentize(element);
    return this;
};
/**
 * Loads a component with the given options.
 * This is the programmatic equivalent of
 * `data-ui-include` or `data-ui-load`.
 * All available options are described in the
 * `ContextOptions` class documentation.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
var exampleController = zuix.controller(function(cp){
    cp.create = function() {
        cp.expose('test', testMethod);
        cp.view().html('Helllo World!');
    }
    function testMethod() {
        console.log('Test method exposing');
        cp.view().html('A simple test.');
    }
});
var componentOptions = {
    container: zuix.field('container-div');
    controller: exampleController,
    ready: function () {
        console.log('Loading complete.');
        console.log('Component context instance', this);
    },
    error: function(error) {
        console.log('Loading error!', error);
    }
};
var ctx = zuix.load('path/to/component_name', componentOptions);
ctx.test();
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded.
 * @param {ContextOptions} [options] Options used to initialize the loaded component.
 * @return {ComponentContext}
 */
Zuix.prototype.load = load;
/**
 * Unload and dispose the component.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext} context The `ComponentContext` instance of the component to be unloaded.
 * @return {Zuix}
 */
Zuix.prototype.unload = function (context) {
    unload(context);
    return this;
};
/**
 * Get the `ComponentContext`, given
 * the component's view or container element.
 * .
 * @example
 *
<small>**Example - JavaScript**</small>
```js
var ctx = zuix.context(containerDiv);
```
 *
 * @private
 * @param {Element} contextId
 * @return {ComponentContext}
 */
Zuix.prototype.context = context;
/**
 * TODO: desc
 *
 * @param {string} path
 * @param {function} handler
 * @return {Zuix}
 */
Zuix.prototype.hook = function (path, handler) {
    hook(path, handler);
    return this;
};
/**
 * TODO: desc
 *
 * @param {Object} context
 * @param {string} path
 * @param {object} data
 * @return {Zuix}
 */
Zuix.prototype.trigger = function (context, path, data) {
    trigger(context, path, data);
    return this;
};
/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = lazyLoad;

Zuix.prototype.$ = z$;
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ZxQuery = z$.ZxQuery;

Zuix.prototype.dumpCache = function () {
    console.log("ZUIX", "Component Cache", _componentCache);
};
Zuix.prototype.dumpContexts = function () {
    console.log("ZUIX", "Loaded Component Instances", _contextRoot);
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function (root) {
    var zuix = new Zuix();
    document.addEventListener("DOMContentLoaded", function(event) {
        zuix.componentize();
    });
    return zuix;
};



},{"../helpers/TaskQueue":1,"../helpers/Util":2,"../helpers/ZxQuery":3,"./ComponentContext":5,"./ContextController":6}]},{},[4])
(4)
});