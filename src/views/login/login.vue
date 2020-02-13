<template>
  <!-- 整体容器 -->
  <div class="login">
    <div class="left-box">
      <div class="title-box">
        <img src="../../assets/login-logo.png" alt="" class="logo" />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <el-form
        ref="loginForm"
        :rules="rules"
        :model="loginForm"
        status-icon
        label-width="43px"
      >
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            show-password
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-row>
            <el-col :span="17">
              <el-input
                prefix-icon="el-icon-key"
                v-model="loginForm.code"
              ></el-input>
            </el-col>
            <el-col :span="6" class="code-col" :offset="1">
              <img
                :src="codeURL"
                class="captcha-img"
                alt=""
                @click="changeCode"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 用户协议 -->
        <el-form-item>
          <el-checkbox v-model="loginForm.isChecked">
            我已阅读并同意
            <el-link type="primary">用户协议</el-link>
            和
            <el-link type="primary">隐私条款</el-link>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            @click="submitForm('loginForm')"
            type="primary"
            >登录</el-button
          >
          <el-button class="login-btn" type="primary" @click="isShowRegister"
            >注册</el-button
          >
          <!-- </el-form-item>
        <el-form-item> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="rigt-box">
      <img src="../../assets/login_banner_ele.png" alt="" />
    </div>
    <registerDialog ref="registerDialog"></registerDialog>
  </div>
</template>

<script>
window.console.log(process.env.VUE_APP_URL);
// 导入对话框
import registerDialog from "./components/registerDialog";
import { checkPhone } from "@/uitils/validator";
import { login } from "@/api/login";
import { setToken } from "@/uitils/token";
export default {
  components: {
    registerDialog
  },
  name: "login",
  data() {
    return {
      loginForm: {
        // 手机号
        phone: "",
        // 密码
        password: "",
        // 验证码
        code: "",
        // 是否勾选
        isChecked: false
      },
      rules: {
        // name: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        //   { min: 8, max: 12, message: "长度在 8 到 12 个字符", trigger: "blur" }
        // ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          // trigger 触发是执行 validator设置的函数
          { validator: checkPhone, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "长度为4", trigger: "blur" }
        ]
      },
      // 验证码图片地址
      codeURL: process.env.VUE_APP_URL + "/captcha?type=login"
    };
  },
  methods: {
    changeCode() {
      // 随机数
      // this.codeURL = process.env.VUE_APP_URL+"/captcha?type=sendsms&"+Math.random()
      // 事件戳 用的更频繁
      // this.codeURL = process.env.VUE_APP_URL+"/captcha?type=sendsms&"+Date.now()
      // 如果要更为规范 t=或者其他的  键值都可以 t是time的缩写
      this.codeURL =
        process.env.VUE_APP_URL + "/captcha?type=login&t=" + Date.now();
    },
    submitForm(formName) {
      // 等同于 this.$refs['loginForm']相当于获取到了Element-ui的表单
      // this.$refs['loginForm']等同于 this.$refs.loginForm
      // validate这个方法是Element-ui的表单的方法
      this.$refs[formName].validate(valid => {
        if (valid) {
          login({
            phone: this.loginForm.phone,
            password: this.loginForm.password,
            code: this.loginForm.code
          }).then(res => {
            window.console.log(res);
            if(this.loginForm.isChecked==true) {

              if (res.data.code === 200) {
                this.$message.success("登录成功");
                // token 保存到哪里 localStorage(一直都在)
                setToken(res.data.data.token);
                // 跳转到首页
                this.$router.push("./index");
              } else if (res.data.code === 202) {
                this.$message.error(res.data.message);
              }
            }else {
              this.$message.error("请勾选用户协议")
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 显示注册对话框
    isShowRegister() {
      // this.$refs可以获取所有设置了ref属性的元素
      // 组件间的取值
      this.$refs.registerDialog.isShow = true;
    }
  }
};
</script>

<style lang="less">
.login {
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  /* 开启弹性布局 */
  display: flex;
  /* 上下居中 */
  align-items: center;
  justify-content: space-around;
  // 左侧盒子
  .left-box {
    padding-right: 43px;
    box-sizing: border-box;
    width: 478px;
    background-color: #f5f5f5;
    height: 550px;
    font-size: 12px;
    .title-box {
      display: flex;
      align-items: center;
      margin-top: 44px;
      margin-left: 48px;
      margin-bottom: 31px;
      .title {
        font-size: 24px;
        margin-left: 16px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        height: 28px;
        background-color: #c7c7c7;
      }
      .sub-title {
        font-size: 21px;
        margin-left: 12px;
      }
    }
    // 协议区域的布局

    .el-checkbox {
      align-items: center;
      text-align: center;
      display: flex;
      .el-checkbox__label {
        display: flex;
      }
    }
    // 登录按钮
    .login-btn {
      width: 100%;
      margin-left: 0;
      margin-bottom: 26px;
    }
    // 验证码 栅格
    .code-col {
      height: 40.8px;
      // 登录验证码图片
      .captcha-img {
        width: 100%;
        height: 40.8px;
      }
    }
  }
}
</style>
