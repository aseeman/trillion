import React from 'react';

import { Trillion, Filter } from './trillion';

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

    let trillion = Trillion(data, indices);
    let benzFilter = new Filter('match', 'name', 'Benz');
    trillion.addFilter(benzFilter);

    trillion.compute();

    let rows = trillion.rows.map(row => {
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
