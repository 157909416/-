<template>
  <el-container class="my-container">
    <el-header class="my-header">
      <div class="left">
        <i class="el-icon-s-fold" @click="isCollapse = !isCollapse"></i>
        <img src="../../assets/login-logo.png" alt="" />
        <span>黑马面面</span>
      </div>
      <div class="right">
        <img :src="$store.state.userIcon" alt="" />
        <span class="name">{{ $store.state.userName }},您好</span>
        <el-button type="primary" size="mini" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- :default-active="$route.path"  刷新高亮模式 -->
      <el-aside width="auto" class="my-aside">
        <el-menu
          :collapse="isCollapse"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item index="/index/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/index/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/index/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/index/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/index/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="my-main">
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {logout} from "@/api/index";
import { removeToken } from "@/uitils/token";
export default {
  name: "index",
  data() {
    return {
      // username: "",
      // userIcon: "",
      isCollapse: false
    };
  },
  methods: {
    logout() {
      this.$confirm("您确定要离开", "友情提示", {
        confirmButtonText: "狠心离开",
        cancelButtonText: "继续看看",
        type: "warning"
      })
        .then(() => {
          logout().then(res => {
            if (res.data.code === 200) {
              removeToken();
              // 移除头像
              this.$store.commit('changeName','')
              // 移除用户名
              this.$store.commit('changeIcon','')
              // 去登录页
              this.$router.push("./login");
            }
          });
        })
        .catch(() => {
          // 点击取消
        });
    }
  },
  beforeCreate() {
    // window.console.log(getToken());
    // if (getToken() == undefined) {
    //   this.$message.warning("小老弟,请先登录");
    //   this.$router.push("/login");
    // }
  },
  created() {
    // info().then(res => {
    //   window.console.log(res);
    //   this.username = res.data.data.username;
    //   this.userIcon = process.env.VUE_APP_URL + "/" + res.data.data.avatar;
    // });
    // window.console.log(this.$route.path);
  }
};
</script>

<style lang="less">
.my-container {
  // margin: 0;
  // padding: 0;
  height: 100%;
  .my-header {
    // background: hotpink;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      i {
        font-size: 24px;
        margin-right: 22px;
      }
      img {
        width: 33px;
        height: 28px;
        margin-right: 11px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        border-radius: 50%;
        margin-right: 9px;
      }
      span.name {
        font-size: 14px;
        margin-right: 38px;
      }
    }
  }
  .my-aside {
    //   c3中的transition(过渡), 需要有开始和结束的值
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
  }
  .my-main {
    background: #0094ff;
  }
}
</style>
