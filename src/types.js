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
      return a - b;
    }
  }
}