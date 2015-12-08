export default {
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
  }
};