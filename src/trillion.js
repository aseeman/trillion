import React from 'react';

import template from './templates/table-react.jsx';

const Trillion = React.createClass({
  //todo: validate props
  'render': template,
  'getInitialState': function () {
    return {
      'rows': []
    };
  },
  'getDefaultProps': function () {
    return {};
  },
  'componentWillMount': function () {
    const rows = [];
    const data = this.props.data;
    const indices = this.props.indices;

    if (data &&
        Array.isArray(data) &&
        indices &&
        Array.isArray(indices)) {

      for(let i = 0; i < data.length; i++) {
        let row = [];
        for(let j = 0; j < indices.length; j++) {
          let index = indices[j];
          //todo: allow changing default type
          let type = index.type || String;
          row.push(type(data[i][index.field]));
        }
        rows.push(row);
      }
    } else {
      throw Error('Invalid indices or data');
    }

    this.setState({
      'rows': rows
    });
  }
});

export default Trillion;