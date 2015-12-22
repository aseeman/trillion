function MatchFilter (haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

function EqualFilter (a, b) {
  return a === b;
}

function MinFilter (a, b) {
  return a >= b;
}

function MaxFilter (a, b) {
  return a <= b;
}

function RangeFilter (value, min, max) {
  return value >= min && value <= max;
}

function AnyFilter (haystack, needle) {
  for(let i = 0, l = haystack.length; i < l; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }

  return false;
}

const filters = {
  'match': MatchFilter,
  'equal': EqualFilter,
  'min': MinFilter,
  'max': MaxFilter,
  'range': RangeFilter,
  'any': AnyFilter
};

export default {
  'createFilter': function (type, field, value) {
    const name = `${type}-${field}-${value}`;
    let fn = function () {
      return true;
    };

    if (filters[type]) {
      fn = function (data) {
        return filters[type](data[field].raw, value, [type, field])
      };
    }

    fn._name = name;

    return fn;
  },

  'addFilter': function (filter) {
    this.resetPagination();
    if (!this.filters[filter._name]) {
      this.filters[filter._name] = filter;
    }
  },

  'removeFilter': function (filter) {
    this.resetPagination();
    if (this.filters[filter._name]) {
      delete this.filters[filter._name];
    }
  },

  'toggleFilter': function (filter) {
    if (this.filters[filter._name]) {
      this.removeFilter(filter);
    } else {
      this.addFilter(filter);
    }
  },

  'Filters': filters
};