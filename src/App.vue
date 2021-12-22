<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    window.fullHeight = document.documentElement.clientHeight;
    window.fullWidth = document.documentElement.clientWidth;
    this.$store.commit("system/setWindowWidth", window.fullWidth);
    this.$store.commit("system/setwindowHeight", window.fullHeight);
    // //阻止F5刷新
    // this.stopF5Refresh();
    // //监听刷新事件
    // window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
  },
  data() {
    return {
      showRegister: true,
      moveDataelse: {
        x: null,
        y: null,
      },
    };
  },
  methods: {
  },
};
</script>
<style lang="stylus" >
#app {
  height: 100%;
}

.scrollbar {
  overflow: hidden;
}

.scrollbar:hover {
  overflow-y: auto;
  /* 设置滚动条不占空间 */
  overflow-y: overlay;
}

.selectNone {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
<style lang="stylus" scoped></style>
