import t from 'transducers.js';
import assign from 'object-assign';

import Filter from './filter';
import Filters from './filters';

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

assign(Trillion.prototype, Filters);

Trillion.prototype.initialize = function (input, headers, options) {
  this.filters = {};
  this.options = {};
  this.listeners = [];
  this.sortConfig = null;
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

Trillion.prototype.compute = function () {
  if (this.options.lazy && !this.listeners.length) {
    return;
  } else if (!this.data || !this.data.length) {
    return;
  }

  let stack = [];

  const filters = this.filters;
  const filterNames = Object.keys(filters);

  for(let i = 0, l = filterNames.length; i < l; i++) {
    const filter = filters[filterNames[i]];
    stack.push(t.filter(filter));
  }

  const transform = t.compose.apply(null, stack);
  const rows = t.seq(this.data, transform);

  // todo: group

  this.sort();

  this.rows = rows;

  this.renderPage();
};

//todo: probably should be internal
Trillion.prototype.sort = function () {
  if (!this.sortConfig) {
    return;
  }

  let field = this.sortConfig.header.field;
  let type = this.sortConfig.header.type;
  let ascending = this.sortConfig.ascending;

  if (type === String) {
    this.rows = this.rows.sort(function (a, b) {
      let x = ascending ? a : b;
      let y = ascending ? b : a;
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

  let header = this.headers[headerIndex];

  if (this.sortConfig && header === this.sortConfig.header) {
    this.sortConfig.ascending = !this.sortConfig.ascending;
  } else{
    this.sortConfig = {
      'header': header,
      'ascending': false
    };
  }

  this.sort();
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