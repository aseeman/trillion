(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["TrillionReact"] = factory(require("react"));
	else
		root["TrillionReact"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _tableReact = __webpack_require__(3);

	var _tableReact2 = _interopRequireDefault(_tableReact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: 'trillion-react',

	  'render': _tableReact2.default,
	  'getInitialState': function getInitialState() {
	    return {
	      'indices': [],
	      'rows': []
	    };
	  },

	  'prevPage': function prevPage() {
	    var Trillion = this.props.Trillion;
	    Trillion.getPreviousPage();
	  },

	  'nextPage': function nextPage() {
	    var Trillion = this.props.Trillion;
	    Trillion.getNextPage();
	  },

	  //todo: this should be communicating header name, not field
	  'sortByHeader': function sortByHeader(headerIndex) {
	    var Trillion = this.props.Trillion;
	    Trillion.sortByHeader(headerIndex);
	  },

	  'updateFromTrillion': function updateFromTrillion(rows, indices) {
	    this.setState({
	      'rows': rows,
	      'indices': indices
	    });
	  },

	  'componentWillMount': function componentWillMount() {
	    var Trillion = this.props.Trillion;
	    Trillion.registerListener(this.updateFromTrillion);
	  },

	  'componentWillUnmount': function componentWillUnmount() {
	    var Trillion = this.props.Trillion;
	    Trillion.unregisterListener(this.updateFromTrillion);
	  }
	});

	module.exports = exports.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = template;
	function template() {
	  var _this = this;

	  var rows = this.state.rows || [];
	  var indices = this.state.indices || [];

	  return React.createElement(
	    "div",
	    null,
	    React.createElement(
	      "table",
	      null,
	      React.createElement(
	        "thead",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          indices.map(function (index, i) {
	            return React.createElement(
	              "th",
	              { key: i, onClick: _this.sortByHeader.bind(_this, i) },
	              index.label
	            );
	          })
	        )
	      ),
	      React.createElement(
	        "tbody",
	        null,
	        rows.map(function (row, i) {
	          return React.createElement(
	            "tr",
	            { key: i },
	            indices.map(function (index, j) {
	              return React.createElement(
	                "td",
	                { key: index.field },
	                String(row[index.field].display)
	              );
	            })
	          );
	        })
	      )
	    ),
	    React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "a",
	        { href: "#", onClick: this.prevPage },
	        "Prev"
	      ),
	      " ",
	      React.createElement(
	        "a",
	        { href: "#", onClick: this.nextPage },
	        "Next"
	      )
	    )
	  );
	}

/***/ }
/******/ ])
});
;