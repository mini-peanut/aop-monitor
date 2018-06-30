# aop-monitor
[![npm](https://img.shields.io/npm/v/aop-monitor.svg)](https://www.npmjs.com/package/aop-monitor)


### Background
埋点代码常常要侵入具体的业务逻辑，这使埋点代码变得很繁琐并且容易出错。因此，最直接的做法就是将埋点代码与业务逻辑解耦，也就是“声明式编程”，从而降低埋点的难度。

### Design ideas

1. 用户的每一次操作，必然会触发相应的回调，我们可以做到监控那些回调
1. 监控对象可以是类或者是对象,如果类监控的是类，则监控其的prototype对象
2. 监控函数调用发生在业务逻辑函数调用之后
3. 监控逻辑不能修改业务逻辑的数据或者返回结果

### Feature
1. 完全与业务解耦，业务代码里可以永远见不到埋点的逻辑了
2. 埋点数据无需手动发送，只需在最开始的时候传入一次 发送的方法，埋点的方法只需要返回数据就行了，系统会自动为你发送
3. 支持在用户某个操作之后，一次性发送多个埋点，你需要做的只是将相应的数据以数组方式返回
4. 监控对象可以是类或者是对象，换句话说，支持react和vue
5. 极其轻量：所有代码加上注释没超过100行，真正用来实现功能的代码也就50行左右

### Getting Started

#### monitor.js
```js
import initAopMonitor  from 'aop-monitor';

const send = (params) => {
  // 这里做一些参数的检验或者自定义处理逻辑

  // 这里写你的发送埋点事件
  return console.log('将要被埋点的参数', params);
};

export default initAopMonitor(send)
```
ps: 推荐将该逻辑放到单独一个模块，并配置webpack alias以方便引用

#### 埋点代码 - watchList.js
返回的数据最终会被之前传入的send方法发送出去，如果该业务方法内有多处埋点，支持返回数组的方式
```js
export default {
  init() {
    return {
      msg: 'monitor init'
    }
  },
  handleButtonAClick() {
    console.log('处理按钮A点击的埋点事件');
    return {
      msg: 'monitor handleButtonAClick'
    }
  },
  handleButtonBClick(testArgs) {
    console.log('watchList内：handleButtonBClick的参数是', testArgs);
    console.log('watchList内：handleButtonBClick的this是', this);

    return {
      msg: 'monitor handleButtonBClick'
    }
  }
}
```

#### 业务组件 - react版本 - 具体打印效果可以查看demo/react-demo
```js
import React from 'react';
import monitor from "./monitor/monitor";
import watchList from "./watchList";

@monitor(watchList)
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

export default App;
```

#### 业务组件 - vue 版本 - 具体打印效果可以查看demo/vue-demo
```js
import monitor from "path/to/monitor";
import watchList from "path/to/watchList";

const watch = monitor(watchList)
export default {
  mounted() {
    this.init();
  },
  methods: watch({
    init() {
      console.log('App初始化');
    },
    handleButtonAClick() {
      console.log('按钮A被点击了');
    },
    handleButtonBClick(testArgs) {
      console.log('按钮B被点击了');
      console.log('组件内：handleButtonBClick的参数是', testArgs);
      console.log('组件内：handleButtonBClick的this是', this);
    },
    handleButtonCClick() {
      console.log('按钮C被点击了');
    }
  })
}
```
