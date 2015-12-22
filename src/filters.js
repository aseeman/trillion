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
  'createFilter': function (type, field, ...args) {
    let fn = function () {
      return true;
    };

    if (filters[type]) {
      fn = function (data) {
        //todo: remove .raw
        return filters[type](data[field].raw || data[field], ...args)
      };
    }

    return fn;
  },

  'addFilter': function (filter) {
    this.resetPagination();

    for(let i = 0, l = this.filters.length; i < l; i++) {
      if (this.filters[i] === filter) {
        return;
      }
    }

    this.filters.unshift(filter);
  },

  'removeFilter': function (filter) {
    this.resetPagination();

    this.filters = this.filters.filter(f => {
      return f !== filter;
    });
  },

  'toggleFilter': function (filter) {

    const foundFilter = this.filters.filter(f => {
      return f === filter;
    }).length > 0;

    if (foundFilter) {
      this.removeFilter(filter);
    } else {
      this.addFilter(filter);
    }
  },

  'Filters': filters
};