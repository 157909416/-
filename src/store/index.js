// 导入vue
import Vue from "vue";
// 导入vuex
import Vuex from "vuex";
// use一下  注册
Vue.use(Vuex);
// 创建仓库对象
const store = new Vuex.Store({
  state: {
    // 用户头像
    userIcon: "",
    userName: ""
  },
  mutations: {
    changeIcon(state, newIcon) {
      state.userIcon = newIcon;
    },
    changeName(state, newName) {
      state.userName = newName;
    }
  }
});
// 暴露出去
export default store;
