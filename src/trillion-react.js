import React from 'react';

import template from './templates/table-react.jsx';

export default React.createClass({
  //todo: validate props
  'render': template,
  'getInitialState': function () {
    return {
      'rows': []
    };
  },
  'componentWillMount': function () {
    const Trillion = this.props.Trillion;

    if (!Trillion.rows) {
      throw Error('No rows computed');
    }

    this.setState({
      'rows': Trillion.rows,
      'indices': Trillion.indices
    });
  }
});

module.exports = exports.default;