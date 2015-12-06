import t from 'transducers.js';
import debug from 'debug';

import Filter from './filter';

const log = debug('trillion');

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function paginate (trillion) {
  let startIndex = (trillion.currentPage - 1) * trillion.options.pageSize;
  let endIndex = Math.min(startIndex + trillion.options.pageSize, trillion.rows.length);
  let view = [];
  let rows = trillion.rows;

  for(let i = startIndex; i < endIndex; i++) {
    view.push(rows[i]);
  }

  trillion.pageCount = Math.ceil(rows.length / trillion.options.pageSize);

  return view;
}

const Trillion = function (data, headers, options) {
  if (!(this instanceof Trillion)) {
    return new Trillion(data, headers, options);
  }

  this.initialize(data, headers, options);
};

Trillion.prototype.initialize = function (input, headers, options) {
  this.filters = {};
  this.options = {};
  this.listeners = [];
  this.currentPage = 1;

  this.options.pageSize = clamp(options.pageSize, 1, 1000) || 100;
  this.options.lazy = !!options.lazy;

  const fields = headers.map(index => {
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

  let stack = [];

  const filters = this.filters;
  const filterNames = Object.keys(filters);

  for(let i = 0, l = filterNames.length; i < l; i++) {
    const filter = filters[filterNames[i]];
    stack.push(t.filter(filter));
  }

  // fuzzy search

  const transform = t.compose.apply(null, stack);
  const rows = t.seq(this.data, transform);

  // sort
  // group

  log('compute end');

  this.rows = rows;

  this.renderPage();
};

Trillion.prototype.getNextPage = function () {
  let currentPage = this.currentPage;

  if (currentPage + 1 <= this.pageCount) {
    this.currentPage = currentPage + 1;
  }

  this.renderPage();
};

Trillion.prototype.getPreviousPage = function () {
  let currentPage = this.currentPage;

  if (currentPage - 1 > 0) {
    this.currentPage = currentPage - 1;
  }

  this.renderPage();
};

Trillion.prototype.renderPage = function () {
  const view = paginate(this);
  const headers = this.headers;

  this.notifyListeners(view, headers);
};

Trillion.prototype.notifyListeners = function (rows, headers) {
  for(let i = 0, l = this.listeners.length; i < l; i++) {
    if (typeof this.listeners[i] === 'function') {
      this.listeners[i](rows, headers);
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
      listener(this.rows, this.headers);
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