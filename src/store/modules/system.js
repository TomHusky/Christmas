const state = {
  windowWidth: null,
  windowHeight: null,
}
const mutations = {
  setWindowWidth(state, value) {
    state.windowWidth = value;
  },
  setwindowHeight(state, value) {
    state.windowHeight = value;
  }
}

const actions = {
}
const getters = {
}


export default {
  namespaced: true,
  // namespaced: true 的方式使其成为带命名空间的模块。保证在变量名一样的时候，添加一个父级名拼接。
  // 例： SET_NAME => user/SET_NAME
  state,
  mutations,
  actions,
  getters,
}