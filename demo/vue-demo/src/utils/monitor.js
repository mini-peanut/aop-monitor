import initAopMonitor  from 'aop-monitor';

const send = (params) => {
  // 这里做一些参数的检验或者自定义处理逻辑

  // 这里写你的发送埋点事件
  return console.log('将要被埋点的参数', params);
};

export default initAopMonitor(send)
