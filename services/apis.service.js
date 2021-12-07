import http from './http';
const app = getApp();
// const statusenum = app.statusenum;
/**
 * @description 统一存放api请求接口
 */
module.exports = {
  // 模拟请求，非真实可用接口
  testRequest(params) {
    return http.get('auth/user/login', params);
  }
}
