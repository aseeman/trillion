import t from 'transducers.js';
import Debug from 'debug';

const debug = Debug('trillion');

export function Trillion (data, indices) {
  if (!(this instanceof Trillion)) {
    return new Trillion(data, indices);
  }

  this.initialize(data, indices);
};

Trillion.prototype.initialize = function (data) {
  debug('start initialize');
  this.filters = {};

  const definedFields = indices.map(index => {
    return index.field;
  });

  const filteredData = [];

  for (let i = 0, l = data.length; i < l; i++) {
    let ret = {};
    let item = data[i];

    for(let field of definedFields) {
      ret[field] = {
        'display': item[field],
        'raw': item[field]
      };
    }

    filteredData.push(ret);
  }

  this.data = filteredData;
  debug('finish initialize')
};

Trillion.prototype.addFilter = function (filter) {
  if (!this.filters[filter._name]) {
    this.filters[filter._name] = filter;
  }
};

Trillion.prototype.compute = function () {
  debug('start compute')
  let stack = [];

  const filters = this.filters;
  const filterNames = Object.keys(filters);

  for(let i = 0, l = filterNames.length; i < l; i++) {
    const filter = filters[filterNames[i]];
    stack.push(t.filter(filter));
  }

  const transform = t.compose.apply(null, stack);
  const sequence = t.seq(this.data, transform);

  this.rows = sequence;
  debug('finish compute')
  // sort
  // reverse
  // paginate
};

export function Filter (type, field, value) {
  const name = `${type}-${field}-${value}`;
  let fn = function () {
    return true;
  };

  if (type === 'match') {
    fn = function (data) {
      return data[field].raw.indexOf(value) !== -1;
    };
  }

  fn._name = name;

  return fn;
};