(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Trillion"] = factory();
	else
		root["Trillion"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _transducers = __webpack_require__(2);

	var _transducers2 = _interopRequireDefault(_transducers);

	var _debug = __webpack_require__(3);

	var _debug2 = _interopRequireDefault(_debug);

	var _filter = __webpack_require__(6);

	var _filter2 = _interopRequireDefault(_filter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var log = (0, _debug2.default)('trillion');

	function clamp(value, min, max) {
	  return Math.min(Math.max(value, min), max);
	}

	function paginate(trillion) {
	  var startIndex = (trillion.currentPage - 1) * trillion.options.pageSize;
	  var endIndex = Math.min(startIndex + trillion.options.pageSize, trillion.rows.length);
	  var view = [];
	  var rows = trillion.rows;

	  for (var i = startIndex; i < endIndex; i++) {
	    view.push(rows[i]);
	  }

	  trillion.pageCount = Math.ceil(rows.length / trillion.options.pageSize);

	  return view;
	}

	var Trillion = function Trillion(data, headers, options) {
	  if (!(this instanceof Trillion)) {
	    return new Trillion(data, headers, options);
	  }

	  this.initialize(data, headers, options);
	};

	Trillion.prototype.initialize = function (input, headers, options) {
	  this.filters = {};
	  this.options = {};
	  this.listeners = [];
	  this.sortConfig = null;
	  this.currentPage = 1;

	  this.options.pageSize = clamp(options.pageSize, 1, 1000) || 100;
	  this.options.lazy = !!options.lazy;

	  var fields = headers.map(function (index) {
	    return index.field;
	  });

	  var output = [];

	  for (var i = 0, l = input.length; i < l; i++) {
	    var ret = {};
	    var item = input[i];

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var field = _step.value;

	        ret[field] = {
	          'display': item[field],
	          'raw': item[field]
	        };
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    output.push(ret);
	  }

	  this.data = output;
	  this.headers = headers;
	  this.compute();
	};

	Trillion.prototype.addFilter = function (filter) {
	  if (!this.filters[filter._name]) {
	    this.filters[filter._name] = filter;
	  }
	};

	Trillion.prototype.compute = function () {
	  if (this.options.lazy && !this.listeners.length) {
	    return;
	  } else if (!this.data || !this.data.length) {
	    return;
	  }

	  log('compute start');

	  var stack = [];

	  var filters = this.filters;
	  var filterNames = Object.keys(filters);

	  for (var i = 0, l = filterNames.length; i < l; i++) {
	    var filter = filters[filterNames[i]];
	    stack.push(_transducers2.default.filter(filter));
	  }

	  var transform = _transducers2.default.compose.apply(null, stack);
	  var rows = _transducers2.default.seq(this.data, transform);

	  // todo: group

	  this.sort();

	  log('compute end');

	  this.rows = rows;

	  this.renderPage();
	};

	//todo: probably should be internal
	Trillion.prototype.sort = function () {
	  if (!this.sortConfig) {
	    return;
	  }

	  var field = this.sortConfig.header.field;
	  var type = this.sortConfig.header.type;
	  var ascending = this.sortConfig.ascending;

	  if (type === String) {
	    this.rows = this.rows.sort(function (a, b) {
	      var x = ascending ? a : b;
	      var y = ascending ? b : a;
	      return x[field].raw.localeCompare(y[field].raw);
	    });
	  } else {
	    this.rows = this.rows.sort(function (a, b) {
	      return a[field].raw - b[field].raw;
	    });
	  }
	};

	Trillion.prototype.sortByHeader = function (headerIndex) {
	  if (headerIndex >= this.headers.length) {
	    throw Error('Header index out of bounds');
	  }

	  var header = this.headers[headerIndex];

	  if (this.sortConfig && header === this.sortConfig.header) {
	    this.sortConfig.ascending = !this.sortConfig.ascending;
	  } else {
	    this.sortConfig = {
	      'header': header,
	      'ascending': false
	    };
	  }

	  this.sort();
	  this.renderPage();
	};

	Trillion.prototype.getNextPage = function () {
	  var currentPage = this.currentPage;

	  if (currentPage + 1 <= this.pageCount) {
	    this.currentPage = currentPage + 1;
	  }

	  this.renderPage();
	};

	Trillion.prototype.getPreviousPage = function () {
	  var currentPage = this.currentPage;

	  if (currentPage - 1 > 0) {
	    this.currentPage = currentPage - 1;
	  }

	  this.renderPage();
	};

	Trillion.prototype.renderPage = function () {
	  var view = paginate(this);
	  var headers = this.headers;

	  this.notifyListeners(view, headers);
	};

	Trillion.prototype.notifyListeners = function (rows, headers) {
	  for (var i = 0, l = this.listeners.length; i < l; i++) {
	    if (typeof this.listeners[i] === 'function') {
	      this.listeners[i](rows, headers);
	    }
	  }
	};

	Trillion.prototype.registerListener = function (listener) {
	  var newListener = true;

	  if (typeof listener !== 'function') {
	    throw Error('Listener is not a function');
	  }

	  for (var i = 0, l = this.listeners.length; i < l; i++) {
	    if (listener === this.listeners[i]) {
	      newListener = false;
	    }
	  }

	  if (newListener) {
	    this.listeners.push(listener);

	    if (this.listeners.length === 1 && this.options.lazy) {
	      this.compute();
	    } else if (this.listeners.length > 1) {
	      listener(this.rows, this.headers);
	    }
	  }
	};

	Trillion.prototype.unregisterListener = function (listener) {
	  var listeners = [];

	  if (typeof listener !== 'function') {
	    throw Error('Listener is not a function');
	  }

	  for (var i = 0, l = this.listeners.length; i < l; i++) {
	    if (listener !== this.listeners[i]) {
	      listeners.push(this.listeners[i]);
	    }
	  }

	  this.listeners = listeners;
	};

	exports.default = Trillion;

	Trillion.Filter = _filter2.default;

	module.exports = exports.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	// basic protocol helpers

	var symbolExists = typeof Symbol !== 'undefined';

	var protocols = {
	  iterator: symbolExists ? Symbol.iterator : '@@iterator'
	};

	function throwProtocolError(name, coll) {
	  throw new Error("don't know how to " + name + " collection: " + coll);
	}

	function fulfillsProtocol(obj, name) {
	  if (name === 'iterator') {
	    // Accept ill-formed iterators that don't conform to the
	    // protocol by accepting just next()
	    return obj[protocols.iterator] || obj.next;
	  }

	  return obj[protocols[name]];
	}

	function getProtocolProperty(obj, name) {
	  return obj[protocols[name]];
	}

	function iterator(coll) {
	  var iter = getProtocolProperty(coll, 'iterator');
	  if (iter) {
	    return iter.call(coll);
	  } else if (coll.next) {
	    // Basic duck typing to accept an ill-formed iterator that doesn't
	    // conform to the iterator protocol (all iterators should have the
	    // @@iterator method and return themselves, but some engines don't
	    // have that on generators like older v8)
	    return coll;
	  } else if (isArray(coll)) {
	    return new ArrayIterator(coll);
	  } else if (isObject(coll)) {
	    return new ObjectIterator(coll);
	  }
	}

	function ArrayIterator(arr) {
	  this.arr = arr;
	  this.index = 0;
	}

	ArrayIterator.prototype.next = function () {
	  if (this.index < this.arr.length) {
	    return {
	      value: this.arr[this.index++],
	      done: false
	    };
	  }
	  return {
	    done: true
	  };
	};

	function ObjectIterator(obj) {
	  this.obj = obj;
	  this.keys = Object.keys(obj);
	  this.index = 0;
	}

	ObjectIterator.prototype.next = function () {
	  if (this.index < this.keys.length) {
	    var k = this.keys[this.index++];
	    return {
	      value: [k, this.obj[k]],
	      done: false
	    };
	  }
	  return {
	    done: true
	  };
	};

	// helpers

	var toString = Object.prototype.toString;
	var isArray = typeof Array.isArray === 'function' ? Array.isArray : function (obj) {
	  return toString.call(obj) == '[object Array]';
	};

	function isFunction(x) {
	  return typeof x === 'function';
	}

	function isObject(x) {
	  return x instanceof Object && Object.getPrototypeOf(x) === Object.getPrototypeOf({});
	}

	function isNumber(x) {
	  return typeof x === 'number';
	}

	function Reduced(value) {
	  this['@@transducer/reduced'] = true;
	  this['@@transducer/value'] = value;
	}

	function isReduced(x) {
	  return x instanceof Reduced || x && x['@@transducer/reduced'];
	}

	function deref(x) {
	  return x['@@transducer/value'];
	}

	/**
	 * This is for transforms that may call their nested transforms before
	 * Reduced-wrapping the result (e.g. "take"), to avoid nested Reduced.
	 */
	function ensureReduced(val) {
	  if (isReduced(val)) {
	    return val;
	  } else {
	    return new Reduced(val);
	  }
	}

	/**
	 * This is for tranforms that call their nested transforms when
	 * performing completion (like "partition"), to avoid signaling
	 * termination after already completing.
	 */
	function ensureUnreduced(v) {
	  if (isReduced(v)) {
	    return deref(v);
	  } else {
	    return v;
	  }
	}

	function reduce(coll, xform, init) {
	  if (isArray(coll)) {
	    var result = init;
	    var index = -1;
	    var len = coll.length;
	    while (++index < len) {
	      result = xform['@@transducer/step'](result, coll[index]);
	      if (isReduced(result)) {
	        result = deref(result);
	        break;
	      }
	    }
	    return xform['@@transducer/result'](result);
	  } else if (isObject(coll) || fulfillsProtocol(coll, 'iterator')) {
	    var result = init;
	    var iter = iterator(coll);
	    var val = iter.next();
	    while (!val.done) {
	      result = xform['@@transducer/step'](result, val.value);
	      if (isReduced(result)) {
	        result = deref(result);
	        break;
	      }
	      val = iter.next();
	    }
	    return xform['@@transducer/result'](result);
	  }
	  throwProtocolError('iterate', coll);
	}

	function transduce(coll, xform, reducer, init) {
	  xform = xform(reducer);
	  if (init === undefined) {
	    init = xform['@@transducer/init']();
	  }
	  return reduce(coll, xform, init);
	}

	function compose() {
	  var funcs = Array.prototype.slice.call(arguments);
	  return function (r) {
	    var value = r;
	    for (var i = funcs.length - 1; i >= 0; i--) {
	      value = funcs[i](value);
	    }
	    return value;
	  };
	}

	// transformations

	function transformer(f) {
	  var t = {};
	  t['@@transducer/init'] = function () {
	    throw new Error('init value unavailable');
	  };
	  t['@@transducer/result'] = function (v) {
	    return v;
	  };
	  t['@@transducer/step'] = f;
	  return t;
	}

	function bound(f, ctx, count) {
	  count = count != null ? count : 1;

	  if (!ctx) {
	    return f;
	  } else {
	    switch (count) {
	      case 1:
	        return function (x) {
	          return f.call(ctx, x);
	        };
	      case 2:
	        return function (x, y) {
	          return f.call(ctx, x, y);
	        };
	      default:
	        return f.bind(ctx);
	    }
	  }
	}

	function arrayMap(arr, f, ctx) {
	  var index = -1;
	  var length = arr.length;
	  var result = Array(length);
	  f = bound(f, ctx, 2);

	  while (++index < length) {
	    result[index] = f(arr[index], index);
	  }
	  return result;
	}

	function arrayFilter(arr, f, ctx) {
	  var len = arr.length;
	  var result = [];
	  f = bound(f, ctx, 2);

	  for (var i = 0; i < len; i++) {
	    if (f(arr[i], i)) {
	      result.push(arr[i]);
	    }
	  }
	  return result;
	}

	function Map(f, xform) {
	  this.xform = xform;
	  this.f = f;
	}

	Map.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Map.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Map.prototype['@@transducer/step'] = function (res, input) {
	  return this.xform['@@transducer/step'](res, this.f(input));
	};

	function map(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);

	  if (coll) {
	    if (isArray(coll)) {
	      return arrayMap(coll, f, ctx);
	    }
	    return seq(coll, map(f));
	  }

	  return function (xform) {
	    return new Map(f, xform);
	  };
	}

	function Filter(f, xform) {
	  this.xform = xform;
	  this.f = f;
	}

	Filter.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Filter.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Filter.prototype['@@transducer/step'] = function (res, input) {
	  if (this.f(input)) {
	    return this.xform['@@transducer/step'](res, input);
	  }
	  return res;
	};

	function filter(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);

	  if (coll) {
	    if (isArray(coll)) {
	      return arrayFilter(coll, f, ctx);
	    }
	    return seq(coll, filter(f));
	  }

	  return function (xform) {
	    return new Filter(f, xform);
	  };
	}

	function remove(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);
	  return filter(coll, function (x) {
	    return !f(x);
	  });
	}

	function keep(coll) {
	  return filter(coll, function (x) {
	    return x != null;
	  });
	}

	function Dedupe(xform) {
	  this.xform = xform;
	  this.last = undefined;
	}

	Dedupe.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Dedupe.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Dedupe.prototype['@@transducer/step'] = function (result, input) {
	  if (input !== this.last) {
	    this.last = input;
	    return this.xform['@@transducer/step'](result, input);
	  }
	  return result;
	};

	function dedupe(coll) {
	  if (coll) {
	    return seq(coll, dedupe());
	  }

	  return function (xform) {
	    return new Dedupe(xform);
	  };
	}

	function TakeWhile(f, xform) {
	  this.xform = xform;
	  this.f = f;
	}

	TakeWhile.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	TakeWhile.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	TakeWhile.prototype['@@transducer/step'] = function (result, input) {
	  if (this.f(input)) {
	    return this.xform['@@transducer/step'](result, input);
	  }
	  return new Reduced(result);
	};

	function takeWhile(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);

	  if (coll) {
	    return seq(coll, takeWhile(f));
	  }

	  return function (xform) {
	    return new TakeWhile(f, xform);
	  };
	}

	function Take(n, xform) {
	  this.n = n;
	  this.i = 0;
	  this.xform = xform;
	}

	Take.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Take.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Take.prototype['@@transducer/step'] = function (result, input) {
	  if (this.i < this.n) {
	    result = this.xform['@@transducer/step'](result, input);
	    if (this.i + 1 >= this.n) {
	      // Finish reducing on the same step as the final value. TODO:
	      // double-check that this doesn't break any semantics
	      result = ensureReduced(result);
	    }
	  }
	  this.i++;
	  return result;
	};

	function take(coll, n) {
	  if (isNumber(coll)) {
	    n = coll;coll = null;
	  }

	  if (coll) {
	    return seq(coll, take(n));
	  }

	  return function (xform) {
	    return new Take(n, xform);
	  };
	}

	function Drop(n, xform) {
	  this.n = n;
	  this.i = 0;
	  this.xform = xform;
	}

	Drop.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Drop.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Drop.prototype['@@transducer/step'] = function (result, input) {
	  if (this.i++ < this.n) {
	    return result;
	  }
	  return this.xform['@@transducer/step'](result, input);
	};

	function drop(coll, n) {
	  if (isNumber(coll)) {
	    n = coll;coll = null;
	  }

	  if (coll) {
	    return seq(coll, drop(n));
	  }

	  return function (xform) {
	    return new Drop(n, xform);
	  };
	}

	function DropWhile(f, xform) {
	  this.xform = xform;
	  this.f = f;
	  this.dropping = true;
	}

	DropWhile.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	DropWhile.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	DropWhile.prototype['@@transducer/step'] = function (result, input) {
	  if (this.dropping) {
	    if (this.f(input)) {
	      return result;
	    } else {
	      this.dropping = false;
	    }
	  }
	  return this.xform['@@transducer/step'](result, input);
	};

	function dropWhile(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);

	  if (coll) {
	    return seq(coll, dropWhile(f));
	  }

	  return function (xform) {
	    return new DropWhile(f, xform);
	  };
	}

	function Partition(n, xform) {
	  this.n = n;
	  this.i = 0;
	  this.xform = xform;
	  this.part = new Array(n);
	}

	Partition.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Partition.prototype['@@transducer/result'] = function (v) {
	  if (this.i > 0) {
	    return ensureUnreduced(this.xform['@@transducer/step'](v, this.part.slice(0, this.i)));
	  }
	  return this.xform['@@transducer/result'](v);
	};

	Partition.prototype['@@transducer/step'] = function (result, input) {
	  this.part[this.i] = input;
	  this.i += 1;
	  if (this.i === this.n) {
	    var out = this.part.slice(0, this.n);
	    this.part = new Array(this.n);
	    this.i = 0;
	    return this.xform['@@transducer/step'](result, out);
	  }
	  return result;
	};

	function partition(coll, n) {
	  if (isNumber(coll)) {
	    n = coll;coll = null;
	  }

	  if (coll) {
	    return seq(coll, partition(n));
	  }

	  return function (xform) {
	    return new Partition(n, xform);
	  };
	}

	var NOTHING = {};

	function PartitionBy(f, xform) {
	  // TODO: take an "opts" object that allows the user to specify
	  // equality
	  this.f = f;
	  this.xform = xform;
	  this.part = [];
	  this.last = NOTHING;
	}

	PartitionBy.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	PartitionBy.prototype['@@transducer/result'] = function (v) {
	  var l = this.part.length;
	  if (l > 0) {
	    return ensureUnreduced(this.xform['@@transducer/step'](v, this.part.slice(0, l)));
	  }
	  return this.xform['@@transducer/result'](v);
	};

	PartitionBy.prototype['@@transducer/step'] = function (result, input) {
	  var current = this.f(input);
	  if (current === this.last || this.last === NOTHING) {
	    this.part.push(input);
	  } else {
	    result = this.xform['@@transducer/step'](result, this.part);
	    this.part = [input];
	  }
	  this.last = current;
	  return result;
	};

	function partitionBy(coll, f, ctx) {
	  if (isFunction(coll)) {
	    ctx = f;f = coll;coll = null;
	  }
	  f = bound(f, ctx);

	  if (coll) {
	    return seq(coll, partitionBy(f));
	  }

	  return function (xform) {
	    return new PartitionBy(f, xform);
	  };
	}

	function Interpose(sep, xform) {
	  this.sep = sep;
	  this.xform = xform;
	  this.started = false;
	}

	Interpose.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Interpose.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Interpose.prototype['@@transducer/step'] = function (result, input) {
	  if (this.started) {
	    var withSep = this.xform['@@transducer/step'](result, this.sep);
	    if (isReduced(withSep)) {
	      return withSep;
	    } else {
	      return this.xform['@@transducer/step'](withSep, input);
	    }
	  } else {
	    this.started = true;
	    return this.xform['@@transducer/step'](result, input);
	  }
	};

	/**
	 * Returns a new collection containing elements of the given
	 * collection, separated by the specified separator. Returns a
	 * transducer if a collection is not provided.
	 */
	function interpose(coll, separator) {
	  if (arguments.length === 1) {
	    separator = coll;
	    return function (xform) {
	      return new Interpose(separator, xform);
	    };
	  }
	  return seq(coll, interpose(separator));
	}

	function Repeat(n, xform) {
	  this.xform = xform;
	  this.n = n;
	}

	Repeat.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Repeat.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Repeat.prototype['@@transducer/step'] = function (result, input) {
	  var n = this.n;
	  var r = result;
	  for (var i = 0; i < n; i++) {
	    r = this.xform['@@transducer/step'](r, input);
	    if (isReduced(r)) {
	      break;
	    }
	  }
	  return r;
	};

	/**
	 * Returns a new collection containing elements of the given
	 * collection, each repeated n times. Returns a transducer if a
	 * collection is not provided.
	 */
	function repeat(coll, n) {
	  if (arguments.length === 1) {
	    n = coll;
	    return function (xform) {
	      return new Repeat(n, xform);
	    };
	  }
	  return seq(coll, repeat(n));
	}

	function TakeNth(n, xform) {
	  this.xform = xform;
	  this.n = n;
	  this.i = -1;
	}

	TakeNth.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	TakeNth.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	TakeNth.prototype['@@transducer/step'] = function (result, input) {
	  this.i += 1;
	  if (this.i % this.n === 0) {
	    return this.xform['@@transducer/step'](result, input);
	  }
	  return result;
	};

	/**
	 * Returns a new collection of every nth element of the given
	 * collection. Returns a transducer if a collection is not provided.
	 */
	function takeNth(coll, nth) {
	  if (arguments.length === 1) {
	    nth = coll;
	    return function (xform) {
	      return new TakeNth(nth, xform);
	    };
	  }
	  return seq(coll, takeNth(nth));
	}

	// pure transducers (cannot take collections)

	function Cat(xform) {
	  this.xform = xform;
	}

	Cat.prototype['@@transducer/init'] = function () {
	  return this.xform['@@transducer/init']();
	};

	Cat.prototype['@@transducer/result'] = function (v) {
	  return this.xform['@@transducer/result'](v);
	};

	Cat.prototype['@@transducer/step'] = function (result, input) {
	  var xform = this.xform;
	  var newxform = {};
	  newxform['@@transducer/init'] = function () {
	    return xform['@@transducer/init']();
	  };
	  newxform['@@transducer/result'] = function (v) {
	    return v;
	  };
	  newxform['@@transducer/step'] = function (result, input) {
	    var val = xform['@@transducer/step'](result, input);
	    return isReduced(val) ? deref(val) : val;
	  };

	  return reduce(input, newxform, result);
	};

	function cat(xform) {
	  return new Cat(xform);
	}

	function mapcat(f, ctx) {
	  f = bound(f, ctx);
	  return compose(map(f), cat);
	}

	// collection helpers

	function push(arr, x) {
	  arr.push(x);
	  return arr;
	}

	function merge(obj, x) {
	  if (isArray(x) && x.length === 2) {
	    obj[x[0]] = x[1];
	  } else {
	    var keys = Object.keys(x);
	    var len = keys.length;
	    for (var i = 0; i < len; i++) {
	      obj[keys[i]] = x[keys[i]];
	    }
	  }
	  return obj;
	}

	var arrayReducer = {};
	arrayReducer['@@transducer/init'] = function () {
	  return [];
	};
	arrayReducer['@@transducer/result'] = function (v) {
	  return v;
	};
	arrayReducer['@@transducer/step'] = push;

	var objReducer = {};
	objReducer['@@transducer/init'] = function () {
	  return {};
	};
	objReducer['@@transducer/result'] = function (v) {
	  return v;
	};
	objReducer['@@transducer/step'] = merge;

	// building new collections

	function toArray(coll, xform) {
	  if (!xform) {
	    return reduce(coll, arrayReducer, []);
	  }
	  return transduce(coll, xform, arrayReducer, []);
	}

	function toObj(coll, xform) {
	  if (!xform) {
	    return reduce(coll, objReducer, {});
	  }
	  return transduce(coll, xform, objReducer, {});
	}

	function toIter(coll, xform) {
	  if (!xform) {
	    return iterator(coll);
	  }
	  return new LazyTransformer(xform, coll);
	}

	function seq(coll, xform) {
	  if (isArray(coll)) {
	    return transduce(coll, xform, arrayReducer, []);
	  } else if (isObject(coll)) {
	    return transduce(coll, xform, objReducer, {});
	  } else if (coll['@@transducer/step']) {
	    var init;
	    if (coll['@@transducer/init']) {
	      init = coll['@@transducer/init']();
	    } else {
	      init = new coll.constructor();
	    }

	    return transduce(coll, xform, coll, init);
	  } else if (fulfillsProtocol(coll, 'iterator')) {
	    return new LazyTransformer(xform, coll);
	  }
	  throwProtocolError('sequence', coll);
	}

	function into(to, xform, from) {
	  if (isArray(to)) {
	    return transduce(from, xform, arrayReducer, to);
	  } else if (isObject(to)) {
	    return transduce(from, xform, objReducer, to);
	  } else if (to['@@transducer/step']) {
	    return transduce(from, xform, to, to);
	  }
	  throwProtocolError('into', to);
	}

	// laziness

	var stepper = {};
	stepper['@@transducer/result'] = function (v) {
	  return isReduced(v) ? deref(v) : v;
	};
	stepper['@@transducer/step'] = function (lt, x) {
	  lt.items.push(x);
	  return lt.rest;
	};

	function Stepper(xform, iter) {
	  this.xform = xform(stepper);
	  this.iter = iter;
	}

	Stepper.prototype['@@transducer/step'] = function (lt) {
	  var len = lt.items.length;
	  while (lt.items.length === len) {
	    var n = this.iter.next();
	    if (n.done || isReduced(n.value)) {
	      // finalize
	      this.xform['@@transducer/result'](this);
	      break;
	    }

	    // step
	    this.xform['@@transducer/step'](lt, n.value);
	  }
	};

	function LazyTransformer(xform, coll) {
	  this.iter = iterator(coll);
	  this.items = [];
	  this.stepper = new Stepper(xform, iterator(coll));
	}

	LazyTransformer.prototype[protocols.iterator] = function () {
	  return this;
	};

	LazyTransformer.prototype.next = function () {
	  this['@@transducer/step']();

	  if (this.items.length) {
	    return {
	      value: this.items.pop(),
	      done: false
	    };
	  } else {
	    return { done: true };
	  }
	};

	LazyTransformer.prototype['@@transducer/step'] = function () {
	  if (!this.items.length) {
	    this.stepper['@@transducer/step'](this);
	  }
	};

	// util

	function range(n) {
	  var arr = new Array(n);
	  for (var i = 0; i < arr.length; i++) {
	    arr[i] = i;
	  }
	  return arr;
	}

	module.exports = {
	  reduce: reduce,
	  transformer: transformer,
	  Reduced: Reduced,
	  isReduced: isReduced,
	  iterator: iterator,
	  push: push,
	  merge: merge,
	  transduce: transduce,
	  seq: seq,
	  toArray: toArray,
	  toObj: toObj,
	  toIter: toIter,
	  into: into,
	  compose: compose,
	  map: map,
	  filter: filter,
	  remove: remove,
	  cat: cat,
	  mapcat: mapcat,
	  keep: keep,
	  dedupe: dedupe,
	  take: take,
	  takeWhile: takeWhile,
	  takeNth: takeNth,
	  drop: drop,
	  dropWhile: dropWhile,
	  partition: partition,
	  partitionBy: partitionBy,
	  interpose: interpose,
	  repeat: repeat,
	  range: range,

	  LazyTransformer: LazyTransformer
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(4);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return 'WebkitAppearance' in document.documentElement.style ||
	  // is firebug? http://stackoverflow.com/a/398120/376773
	  window.console && (console.firebug || console.exception && console.table) ||
	  // is firefox >= v31?
	  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function (v) {
	  return JSON.stringify(v);
	};

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function (match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch (e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch (e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(5);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {}
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long ? long(val) : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Match = Match;

	exports.default = function (type, field, value) {
	  var name = type + '-' + field + '-' + value;
	  var fn = function fn() {
	    return true;
	  };

	  if (filters[type]) {
	    fn = function (data) {
	      return filters[type](data[field].raw, value);
	    };
	  }

	  fn._name = name;

	  return fn;
	};

	function Match(haystack, needle) {
	  return haystack.indexOf(needle) !== -1;
	}

	var filters = {
	  'match': Match
	};

	;

/***/ }
/******/ ])
});
;