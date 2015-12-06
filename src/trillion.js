import t from 'transducers.js';
import debug from 'debug';

import Filter from './filter';

const log = debug('trillion');

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const Trillion = function (data, indices, options) {
  if (!(this instanceof Trillion)) {
    return new Trillion(data, indices, options);
  }

  this.initialize(data, indices, options);
};

Trillion.prototype.initialize = function (input, indices, options) {
  this.filters = {};
  this.options = {};
  this.listeners = [];

  this.options.pageSize = clamp(options.pageSize, 1, 1000) || 100;
  this.options.lazy = !!options.lazy;

  const fields = indices.map(index => {
    return index.field;
  });

  const output = [];

  for (let i = 0, l = input.length; i < l; i++) {
    let ret = {};
    let item = input[i];

    for(let field of fields) {
      ret[field] = {
        'display': item[field],
        'raw': item[field]
      };
    }

    output.push(ret);
  }

  this.data = output;
  this.indices = indices;
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
  }

  let stack = [];

  const filters = this.filters;
  const filterNames = Object.keys(filters);

  for(let i = 0, l = filterNames.length; i < l; i++) {
    const filter = filters[filterNames[i]];
    stack.push(t.filter(filter));
  }

  // fuzzy search

  stack.push(t.take(this.options.pageSize));

  const transform = t.compose.apply(null, stack);
  const rows = t.seq(this.data, transform);

  // sort
  // group
  // paginate

  this.rows = rows;
  this.notifyListeners(rows, this.indices);
};

Trillion.prototype.notifyListeners = function (rows, indices) {
  for(let i = 0, l = this.listeners.length; i < l; i++) {
    if (typeof this.listeners[i] === 'function') {
      this.listeners[i](rows, indices);
    }
  }
};

Trillion.prototype.registerListener = function (listener) {
  let newListener = true;

  if (typeof listener !== 'function') {
    throw Error('Listener is not a function');
  }

  for(let i = 0, l = this.listeners.length; i < l; i++) {
    if (listener === this.listeners[i]) {
      newListener = false;
    }
  }

  if (newListener) {
    this.listeners.push(listener);

    if (this.listeners.length === 1 && this.options.lazy) {
      this.compute();
    } else if (this.listeners.length > 1) {
      listener(this.rows, this.indices);
    }
  }
};

Trillion.prototype.unregisterListener = function (listener) {
  let listeners = [];

  if (typeof listener !== 'function') {
    throw Error('Listener is not a function');
  }

  for (let i = 0, l = this.listeners.length; i < l; i++) {
    if (listener !== this.listeners[i]) {
      listeners.push(this.listeners[i]);
    }
  }

  this.listeners = listeners;
};

export default Trillion;

Trillion.Filter = Filter;

module.exports = exports.default;