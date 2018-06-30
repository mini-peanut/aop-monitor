<template>
  <div id="app">
    <button v-on:click="handleButtonAClick()">buttonA</button>
    <button v-on:click="handleButtonBClick(1232)">buttonB</button>
    <button v-on:click="handleButtonCClick()">buttonC</button>
  </div>
</template>

<script>
import monitor from "./utils/monitor";
import watchList from "./watchList";

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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
