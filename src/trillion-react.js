import React from 'react';

import template from './templates/table-react.jsx';

export default React.createClass({
  //todo: validate props
  'render': template,
  'getInitialState': function () {
    return {
      'indices': [],
      'rows': []
    };
  },

  //todo: move into mixin
  'updateFromTrillion': function (rows, indices) {
    this.setState({
      'rows': rows,
      'indices': indices
    });
  },

  'componentWillMount': function () {
    const Trillion = this.props.Trillion;
    Trillion.registerListener(this.updateFromTrillion);
  },

  'componentWillUnmount': function () {
    const Trillion = this.props.Trillion;
    Trillion.unregisterListener(this.updateFromTrillion);
  }
});

module.exports = exports.default;