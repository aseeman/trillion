import fuzzysearch from 'fuzzysearch';
import damerau from './vendor/damerau-levenshtein';

function MatchFilter (haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

function FuzzyFilter (haystack, needle) {
  let source = haystack.toLowerCase().replace(/\-/g, ' ').replace(/[^a-z0-9 ]/g, '');
  let search = needle.toLowerCase().replace(/\-/g, ' ').replace(/[^a-z0-9 ]/g, '');

  if (fuzzysearch(search, source)) {
    return true;
  } else {
    let dlDistance = damerau(source, search);

    if (dlDistance.relative > 0.5 && dlDistance.similarity > 0.4) {
      return true;
    }

    return false;
  }
}

const filters = {
  'match': MatchFilter,
  'fuzzy': FuzzyFilter
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
    if (!this.filters[filter._name]) {
      this.filters[filter._name] = filter;
    }
  },

  'removeFilter': function (filter) {
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