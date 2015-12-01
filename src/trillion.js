import React from 'react';
import Immutable from 'immutable';

import template from './templates/table-react.jsx';

function createList(data, indices) {
  const definedFields = indices.map(function (index) {
    return index.field;
  });

  let filteredData = data.map(function (item) {
    let ret = {};

    for(let field of definedFields) {
      ret[field] = {
        'displayValue': item[field],
        'rawValue': item[field]
      };
    }

    return ret;
  });

  return Immutable.List(filteredData);
}

const Trillion = React.createClass({
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
    let list = createList(this.props.data, this.props.indices);

    this.setState({
      'list': list
    }, () => {
      this.updateRows();
    });
  },
  'updateRows': function () {
    // filter
    // sort
    // reverse
    // paginate
    this.getPage(this.state.page);
  },
  'getPage': function (page) {
    let rows = this.state.list.slice(((this.state.page - 1) * this.props.pageSize), (this.state.page * this.props.pageSize));

    this.setState({
      'rows': rows.toArray()
    });
  }
});

export default Trillion;