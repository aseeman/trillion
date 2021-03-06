export default {
  'text': {
    'convert': function (raw) {
      if (typeof raw === 'string') {
        return raw;
      } else {
        return String(raw);
      }
    },
    'sort': function (a, b) {
      return a.localeCompare(b);
    }
  },

  'boolean': {
    'convert': function (raw) {
      return !!raw;
    },
    'sort': function (a, b) {
      return a > b;
    }
  },

  'number': {
    'convert': function (raw) {
      if (typeof raw === 'number' && !isNaN(raw)) {
        return raw;
      } else {
        return parseFloat(raw);
      }
    },
    'sort': function (a, b) {
      return a - b;
    }
  },

  'date': {
    'convert': function (raw) {
      if (raw.constructor === Date) {
        return raw;
      } else {
        return new Date(raw);
      }
    },
    'sort': function (a, b) {
      if (typeof a === 'undefined') {
        return -1;
      } else if (typeof b === 'undefined') {
        return 1;
      } else {
        return a - b;
      }
    }
  }
}