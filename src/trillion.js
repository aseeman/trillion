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

  this.options.pageSize = clamp(options.pageSize, 1, 1000) || 100;

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
  const sequence = t.seq(this.data, transform);

  // sort
  // reverse
  // paginate

  this.rows = sequence;
  return this.rows;
};

export default Trillion;

Trillion.Filter = Filter;

module.exports = exports.default;