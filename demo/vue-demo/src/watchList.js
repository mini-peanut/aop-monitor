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
