const app = getApp();
const authService = require('../../services/authentication.service')
const util = require('../../utils/util')
import sessionStateEnum from '../../models/sessionStateEnum'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: app.version,
    currentConf: {},
    model: {},
    isSubmitValidate: true,
    loginForm: {
      //模拟
      loginFormLoginId: '',
      loginFormPassword: '',
      loginIdRules: [{
        type: 'string',
        required: true,
        message: '请输入用户名',
        trigger: 'change'
      }, {
        pattern: '^1(2|3|4|5|6|7|8|9)\\d{9}$',
        message: '手机号不正确，请重新输入'
      }],
      passwordRules: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '密码长度在6-20个字符之间',
          trigger: 'blur'
        },
        {
          pattern: '^(?![A-Za-z]+$)(?!\\d+$)(?![\\W_]+$)',
          message: '密码必须由数字字母和符号组成',
          trigger: 'blur'
        }
      ],
    }
  },
  loginIdInput(e) {
    this.setData({
      'loginForm.loginFormLoginId': e.detail.value
    });
  },
  passwordInput(e) {
    this.setData({
      'loginForm.loginFormPassword': e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    wx.lin.initValidateForm(this);

    //验证token是否有效
    //console.log(app.global.token)
    if (app.global.token != null && app.global.token != '') {
      wx.switchTab({
        url: '/pages/navigator/index/index'
      });
    }
  },

  // 账户登录
  async signIn(e) {

    // //console.log('-----------');
    // //console.log(e.detail.isValidate);
    // //console.log(this.data.loginForm.loginFormLoginId);
    // //console.log(this.data.loginForm.loginFormPassword);

    if ((e?.detail?.isValidate) ?? false) {
      await authService.loginAsync({
        'userName': this.data.loginForm.loginFormLoginId,
        'password': this.data.loginForm.loginFormPassword
      }).then((res) => {
        //console.log('login-->', res)
        if (res.code == 1 && res.Return == 0 && res.success == true) {
          app.global.sessionState = sessionStateEnum.valid
          //用户token
          app.global.token = res.data.AccessToken;
          //用户登录信息
          app.global.userInfo = res.data;
          //存储工作域上下文
          wx.setStorage({
            key: 'workContext',
            data: res.data
          })
          //console.log('token', app.global.token);
          wx.switchTab({
            url: '/pages/navigator/index/index'
          });

        } else {
          wx.showToast({
            title: '用户凭证或者身份无效！',
            icon: 'none',
            duration: 3000
          });
        }
      });
    }
  },

  // 模拟账户登录
  async signInMock(e) {
    this.setData({
      currentConf: {
        show: true,
        animation: 'show',
        zIndex: 99,
        contentAlign: 'center',
        locked: false,
      }
    });

    await util.sleep(4000);
    //await testService.getTest({})
    //以下模拟登录
    this.data.currentConf.show = false;
    this.setData({
      currentConf: this.data.currentConf
    });

    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });

    wx.switchTab({
      url: '/pages/navigator/index/index'
    });
  }

});