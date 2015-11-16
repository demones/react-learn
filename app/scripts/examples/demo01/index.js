ReactDOM.render(React.createElement(
  'h1',
  {
    __source: {
      fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo01\\index.js',
      lineNumber: 2
    }
  },
  'Hello, world!'
), document.getElementById('example'));
import React, { Component } from 'react';
import { render } from 'react-dom';

class HelloMessage extends Component {
  render() {
    return React.createElement(
      'div',
      {
        __source: {
          fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo01\\index.js',
          lineNumber: 10
        }
      },
      'Hello ',
      this.props.name
    );
  }
}

// 加载组件到 DOM 元素 mountNode
render(React.createElement(HelloMessage, { name: 'John', __source: {
    fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo01\\index.js',
    lineNumber: 15
  }
}), mountNode);