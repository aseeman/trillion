import React from 'react';

import template from './templates/table-react.jsx';

export default React.createClass({
  //todo: validate props
  'render': template,
  'getInitialState': function () {
    return {
      'page': 1,
      'rows': []
    };
  },
  'getDefaultProps': function () {
    return {
      'pageSize': 10
    };
  },
  'componentWillMount': function () {
    const data = this.props.data;
    const indices = this.props.indices;
    const Trillion = this.props.Trillion;

    if (!Trillion.rows) {
      throw Error('No rows computed');
    }

    let rows = Trillion.rows.map(row => {
      let ret = {};

      Object.keys(row).forEach(key => {
        ret[key] = row[key].display;
      });

      return ret;
    });

    this.setState({
      'rows': rows
    });
  }
});

module.exports = exports.default;