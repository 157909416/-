import Vue from "vue";
// 导入vue-router
import VueRouter from "vue-router";
// 导入登录页
import login from "../views/login/login.vue";
// 导入首页
import index from "../views/index/index.vue";
// 导入首页中的用户列表
import chart from "../views/index/chart/chart.vue";
// 导入首页中的数据概览
import user from "../views/index/user/user.vue";
// 导入首页中的题库列表
import question from "../views/index/question/question.vue";
// 导入首页中的企业列表
import enterprise from "../views/index/enterprise/enterprise.vue";
// 导入首页中的学科列表
import subject from "../views/index/subject/subject.vue";
// 导入进度条插件
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 注册vue-router
Vue.use(VueRouter);
// 导入token
import { getToken, removeToken } from "../uitils/token";
// 用户信息获取接口
import { info } from "../api/index";
// element 按需导入message
import { Message } from "element-ui";
// 导入仓库
import store from '../store/index'
// 实例化vue-router
const router = new VueRouter({
  routes: [
    // 重定向
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: login,
      meta: {
        title: "黑马面面",
      }
    },
    {
      path: "/index",
      component: index,
      meta: {
        title: "首页",
      },
      // 嵌套路由
      children: [
        {
          // 路径不需要写 "/" 被解析为/index/chart
          path: "chart",
          component: chart,
          meta: {
            title: "数据概览",
          }
        },
        {
          // 路径不需要写 "/" 被解析为/index/user
          path: "user",
          component: user,
          meta: {
            title: "用户列表",
          }
        },
        {
          // 路径不需要写 "/" 被解析为/index/question
          path: "question",
          component: question,
          meta: {
            title: "题库列表",
          }
        },
        {
          // 路径不需要写 "/" 被解析为/index/enterprise
          path: "enterprise",
          component: enterprise,
          meta: {
            title: "企业列表",
          }
        },
        {
          // 路径不需要写 "/" 被解析为/index/subject
          path: "subject",
          component: subject,
          meta: {
            title: "学科列表",
          }
        }
      ]
    }
  ]
});

// 定义路由白名单
const whitePaths = ["/login"];
// 注册前置守卫(前置守卫, 回调函数)
// to 去的路由信息
// from 来的路由信息
// next 函数 必须要执行,才会向后走
router.beforeEach((to, from, next) => {
  // 必须next 如果不next 会在路由切换的时候直接卡住
  // 类似于 express的中间件 必须执行next
  NProgress.start();
  // 访问的页面是哪个
  window.console.log(to.path);
  // if(to.path!='/login') {
    // toLocaleLowerCase() 字符串大写字母转换为小写
  if (!(whitePaths.includes(to.path.toLocaleLowerCase()))) {
    // 需要判断登录状态
    // token的非空判断  如果为空
    if (getToken() == undefined) {
      Message.warning("小老弟,请先登录");
      // this不是vue的实例
      // this.$router.push("/login");
      next("/login");
      NProgress.done();
    } else {
      // 如果不为空 token的真假判断
      info().then(res => {
        // window.console.log(res);
        if (res.data.code === 206) {
          // 提示用户
          Message.warning("登录状态有误,请检查");
          // 删除token
          removeToken();
          // 返回登录页
          next("/login");
          NProgress.done();
        } else if (res.data.code === 200) {
          
          // 处理用户信息  用户的名字
          const userName=res.data.data.username;
          // 处理用户信息 用户的头像
          const userIcon = process.env.VUE_APP_URL + "/" + res.data.data.avatar;
          window.console.log(userIcon);
          window.console.log(userName);
          // 调用仓库方法
          store.commit("changeIcon",userIcon);
          store.commit("changeName",userName);
          // 获取成功
          next();
        }
      });
    }
  } else {
    next();
  }
});
//   注册导航守卫 (后置守卫,回调函数)
// to 取得路由信息
// from 来的路由信息
router.afterEach((to) => {
  window.document.title=to.meta.title;
  NProgress.done();
});
export default router;
