
// 导入 axios
import axios from 'axios'
// 导入工具函数
import {getToken} from '../uitils/token'
// 为了更方便的设置每个模块的请求 一般会通过create创建 新的axios
// 创建的对象 和axios功能一样, 但是 可以单独的为他设置自己的属性
const indexRequest = axios.create({
    // 基地址
    baseURL:process.env.VUE_APP_URL,
    // 是否跨域携带cookie 默认是false
    withCredentials: true,
})

// 用户信息 接口
export function info() {
  return indexRequest({
    url:  '/info',
    method: 'get',
    headers:{
        token:getToken()
    }
  });
}
// 用户退出 接口
export function logout() {
    return indexRequest({
      url:  '/logout',
      method: 'get',
      headers:{
          token:getToken()
      }
    });
  }