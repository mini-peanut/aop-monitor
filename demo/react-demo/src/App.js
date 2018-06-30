import React from 'react';
import monitor from "./monitor/monitor";
import watchList from "./watchList";

class App extends React.Component {
  componentDidMount() {
    console.log('componentDidMount');
  }

  handleButtonAClick() {
    console.log('按钮A被点击了');
  }
  handleButtonBClick(testArgs) {
    console.log('按钮B被点击了');
    console.log('组件内：handleButtonBClick的参数是', testArgs);
    console.log('组件内：handleButtonBClick的this是', this);
  }
  handleButtonCClick() {
    console.log('按钮C被点击了');
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.handleButtonAClick}>buttonA</button>
        <button onClick={_ => this.handleButtonBClick(123)}>buttonB</button>
        <button onClick={this.handleButtonCClick}>buttonC</button>
      </div>
    )
  }
}

// 也可以使用decorator的形式在class上方引入@monitor(watchList)
export default monitor(watchList)(App);
