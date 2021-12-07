const app = getApp();
import sessionStateEnum from '../models/sessionStateEnum'
// 默认请求设置
const defaultSetting = (setting) => {
  if (typeof (setting.useApi) === 'undefined') {
    setting.useApi = app.statusenum.apiType.a;
  }
  if (typeof (setting.loading) === 'undefined') {
    setting.loading = true;
  }
}
/**
 * @description get请求
 * @method GET
 * @param {*} url 请求接口
 * @param {*} params 请求参数
 * @param {*} setting 额外配置
 */
const get = (url, params, showloading = true, setting = {
  useApi: 'api'
}) => {
  defaultSetting(setting)
  return new Promise((resolve, reject) => {
    //console.log('request url:', url)
    request(url, params, setting, 'GET', showloading).then(res => {
      resolve(res)
    })
  })
}
/**
 * @description post请求
 * @method POST
 * @param {*} url 请求接口
 * @param {*} params 请求参数
 * @param {*} setting 额外配置
 */
const post = (url, params = {}, showloading = true, setting = {
  useApi: 'api'
}) => {
  defaultSetting(setting)
  return new Promise((resolve, reject) => {
    request(url, params, setting, 'POST', showloading).then(res => {
      resolve(res)
    })
  })
}

const request = (url, data, setting, method, showloading = true) => {
  const header = {
    'content-type': 'application/json',
    'sysname': 'P',
    'sysversion': '1.0.0'
  }
  let httpUrl;

  //#region 请求头参数，根据实际需求添加
  Object.assign(header, {
    'Authorization': `${app.global.token ? 'Bearer '+app.global.token : ''}`,
  });

  if (!app.utils.startWith(url, 'http')) {
    httpUrl = `${app.config[setting.useApi]}${url}`;
  } else {
    httpUrl = url;
  }

  if (showloading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: httpUrl,
      data,
      header,
      method,
      success: res => {
        if (setting.loading || app.global.hasLoading) {
          wx.hideLoading()
          app.global.hasLoading = false;
        }

        //console.log('http', res)
        /**
         * 请求成功，使用拦截器，统一处理错误信息
         * 默认接口返回统一数据体格式为 {code: [0|1], data: {}, msg: ''}
         * code == 0: 业务逻辑成功  code == 1: 业务逻辑失败
         */
        if (res.statusCode == 200) {
          if (typeof (res.data.code) !== 'undefined' && res.data.code != 0) { //列表接口没有返回code ， code: 0：成功，1：失败
            requestFailedHandle(res)
          }
          resolve(res.data);
        } else {
          let currentSessionState = app.global.sessionState
          if (res.statusCode == 401 && currentSessionState != sessionStateEnum.activating) {
            app.global.sessionState = sessionStateEnum.activating
            //请求接口拒绝访问，重新启动登录
            wx.showToast({
              title: '请重新登录',
              icon: 'error',
              complete: (res) => {
                console.log('showToast debugger', res)
                console.log('check', app.global.token)
                app.global.token = '';
                app.global.userInfo = {}
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/login/index',
                    complete: (res) => {}
                  })
                }, 100);
              }
            })
          } else {
            const errmsg = requestFailedHandle(res);
            resolve({
              code: 2,
              msg: errmsg
            }); //前端自定义code 2，服务器返回的code只有1跟0，2代表前端自定义，表示接口返回不是200状态
          }
        }
      },
      fail: e => {
        if (setting.loading || app.global.hasLoading) {
          wx.hideLoading()
          app.global.hasLoading = false;
        }
        app.native.toast('请求出错，无法请求后台接口');
        resolve({
          code: 2,
          msg: e
        });
      }
    })
  })
}

// 错误类型
const requestFailedHandle = (err) => {
  let errmsg = null;
  if (err.statusCode == 404) {
    errmsg = `未找到请求地址(${err.statusCode})`;
  } else if (err.statusCode == 401) {
    errmsg = `请重新登录(${err.statusCode})`;
  } else if (err.statusCode == 500) {
    errmsg = `服务器出错，请稍后再试(${err.statusCode})`;
  } else if (err.statusCode == 200) {} else {
    errmsg = `系统维护中，请稍后重试(${err.statusCode})`;
  }
  if (errmsg) {
    app.native.toast(errmsg);
    return errmsg;
  }
  return null
}
module.exports = {
  post,
  get
}