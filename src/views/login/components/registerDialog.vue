<template>
  <el-dialog
    width="603px"
    center
    title="用户注册"
    :visible.sync="isShow"
    class="dialog"
  >
    <el-form status-icon :model="form" :rules="rules" ref="registerForm">
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          name="image"
        >
          <!-- imageURL有值就会显示图片,没有值就显示i标签 -->
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
        <el-input
          show-password
          v-model="form.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="图形码" :label-width="formLabelWidth" prop="code">
        <el-row>
          <el-col :span="16"
            ><el-input v-model="form.code" autocomplete="off"></el-input
          ></el-col>
          <el-col :span="7" class="img-box" :offset="1">
            <img :src="codeURL" class="dialog-img" alt="" @click="changeCode" />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- http://183.237.67.218:3002   获取短信的基地址 -->
      <el-form-item label="验证码" :label-width="formLabelWidth" prop="rcode">
        <el-row>
          <el-col :span="16"
            ><el-input v-model="form.rcode" autocomplete="off"></el-input
          ></el-col>
          <el-col :span="7" :offset="1">
            <el-button :disabled="delay != 0" @click="getSMS">
              {{ delay == 0 ? "点击获取验证码" : `还需等待${delay}秒` }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('registerForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('registerForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// 手机号验证
// const checkPhone = (rule, value, callback) => {
//   // 接收参数 value
//   // 定义正则表达式
//   const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
//   // 使用正则校验格式是否满足
//   if (reg.test(value) == true) {
//     // 对
//     callback();
//   } else {
//     // 错
//     callback(new Error("手机号格式不对哦，请检查"));
//   }
// };
// 邮箱验证
// const checkEmail = (rule, value, callback) => {
//   // 接收参数 value
//   // 定义正则表达式
//   const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
//   // 使用正则校验格式是否满足
//   if (reg.test(value) == true) {
//     // 对
//     callback();
//   } else {
//     // 错
//     callback(new Error("邮箱格式不对哦，请检查"));
//   }
// };
// import axios from "axios";
import { sendsms, register } from "@/api/ergister";
import { checkPhone, checkEmail} from '@/uitils/validator'
export default {
  data() {
    return {
      isShow: false,
      form: {
        // 昵称
        username: "",
        // 密码
        password: "",
        // 手机号
        phone: "",
        // 图形验证码
        code: "",
        // 用户头像地址
        avatar: "",
        // 短信验证码
        rcode: "",
        // 邮箱
        email: ""
      },
      rules: {
        avatar: [
          { required: true, message: "用户头像不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "change"
          }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在  到 10 个字符",
            trigger: "change"
          }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          // trigger 触发是执行 validator设置的函数
          { validator: checkPhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          // trigger 触发是执行 validator设置的函数
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      // 本地头像预览地址
      imageUrl: "",
      // 头像上传的接口地址
      uploadUrl: process.env.VUE_APP_URL + "/uploads",
      formLabelWidth: "62px",
      // 倒计时时间
      delay: 0,
      // 验证码图片地址
      codeURL: process.env.VUE_APP_URL + "/captcha?type=sendsms"
    };
  },
  methods: {
    cancel(formName) {
      window.console.log(formName) 
       // 关闭对话框
            this.isShow = false;
            // 清空数据
            this.$refs[formName].resetFields();
            // 认为清空 图片
            this.imageUrl='';
    },
    // 表单提交
    submitForm(formName) {
      // 等同于 this.$refs['loginForm']相当于获取到了Element-ui的表单
      // this.$refs['loginForm']等同于 this.$refs.loginForm
      // validate这个方法是Element-ui的表单的方法
      this.$refs[formName].validate(valid => {
        if (valid) {
           register({
          username: this.form.username,
          phone: this.form.phone,
          email: this.form.email,
          avatar: this.form.avatar,
          password: this.form.password,
          rcode: this.form.rcode
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success("恭喜你,注册成功啦");
            // 关闭对话框
            this.isShow = false;
            // 清空数据
            this.$refs[formName].resetFields();
            // 认为清空 图片
            this.imageUrl='';
          } else if (res.data.code === 201) {
            this.$message.error(res.data.message);
          }
        })
        } else {
          this.$message.error("验证失败");
          return false;
        }
      });
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      //   res id
      // file是文件对象
      window.console.log(res);
      window.console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
      // window.console.log(URL.createObjectURL(file.raw));
      // 保存服务器返回的图片地址
      this.form.avatar = res.data.file_path;
      // 表单 头像字段的校验
      this.$refs.registerForm.validateField("avatar");
    },
    //   file 是文件对象
    // 上传前
    beforeAvatarUpload(file) {
      window.console.log(file);
      const isJPG = file.type === "image/jpeg" || "image/png" || "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像只能是图片");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    changeCode() {
      // 随机数
      // this.codeURL = process.env.VUE_APP_URL+"/captcha?type=sendsms&"+Math.random()
      // 事件戳 用的更频繁
      // this.codeURL = process.env.VUE_APP_URL+"/captcha?type=sendsms&"+Date.now()
      // 如果要更为规范 t=或者其他的  键值都可以 t是time的缩写
      this.codeURL =
        process.env.VUE_APP_URL + "/captcha?type=login&t=" + Date.now();
    },
    // 获取短信验证码
    getSMS() {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(this.form.phone != true)) {
        this.$message.error("手机号格式不对,请重新输入");
        return;
      }
      // 图片验证码校验
      if (this.form.code.length != 4) {
        this.$message.error("图片验证码的长度不够,请检查");
        return;
      }
      if (this.delay == 0) {
        this.delay = 60;
        const interId = setInterval(() => {
          this.delay--;
          if (this.delay == 0) {
            // 清除定时器
            clearInterval(interId);
          }
        }, 1);
        // 调用接口
        sendsms({
          phone: this.form.phone,
          code: this.form.code
        }).then(res => {
          //成功回调
          window.console.log(res);
          if (res.data.code === 200) {
            this.$message.success("获取成功" + res.data.data.captcha);
          } else if (res.data.code === 0) {
            this.$message.error(res.data.message);
            // this.delay=0
          }
          window.console.log(res);
        });
      }
    }
  }
};
</script>

<style lang="less">
.dialog {
  // 文件上传
  .avatar-uploader {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .img-box {
    height: 41px;
    .dialog-img {
      width: 143px;
      height: 41px;
    }
  }
  .el-dialog__header {
    background: linear-gradient(to right, #01c5fb, #2a8ddd);
    .el-dialog__title {
      color: #fffeff;
    }
  }
}
</style>
