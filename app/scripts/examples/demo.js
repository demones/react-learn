var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function () {
    var createItem = function (itemText) {
      return React.createElement(
        'li',
        {
          __source: {
            fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
            lineNumber: 4
          }
        },
        itemText
      );
    };
    return React.createElement(
      'ul',
      {
        __source: {
          fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
          lineNumber: 6
        }
      },
      this.props.items.map(createItem)
    );
  }
});
var TodoApp = React.createClass({
  displayName: 'TodoApp',

  getInitialState: function () {
    return { items: [], text: '' };
  },
  onChange: function (e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({ items: nextItems, text: nextText });
  },
  render: function () {
    return React.createElement(
      'div',
      {
        __source: {
          fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
          lineNumber: 24
        }
      },
      React.createElement(
        'h3',
        {
          __source: {
            fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
            lineNumber: 25
          }
        },
        'TODO'
      ),
      React.createElement(TodoList, { items: this.state.items, __source: {
          fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
          lineNumber: 26
        }
      }),
      React.createElement(
        'form',
        { onSubmit: this.handleSubmit, __source: {
            fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
            lineNumber: 27
          }
        },
        React.createElement('input', { onChange: this.onChange, value: this.state.text, __source: {
            fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
            lineNumber: 28
          }
        }),
        React.createElement(
          'button',
          {
            __source: {
              fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
              lineNumber: 29
            }
          },
          'Add #' + (this.state.items.length + 1)
        )
      )
    );
  }
});

React.render(React.createElement(TodoApp, {
  __source: {
    fileName: '..\\..\\..\\..\\..\\app\\react-src\\examples\\demo.js',
    lineNumber: 36
  }
}), document.getElementById('example'));