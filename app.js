import versionUtil from './utils/version-util';
import Global from './services/global';
const util = require('./utils/util')
const environment = require('./utils/environment');
const locationUtil = require('./utils/location/location.util')
const Hub = require("./utils/signalR")

App({
  version: versionUtil.version(),
  // 设置开发环境 dev: 开发环境  prod：生产环境
  global: new Global('dev'),
  // 环境配置信息，根据开发模式 mode 判断
  config: {},
  //连接Hub
  hubConnect: {},
  //客户端连接
  connectionId: '',
  isFirstLogin: true,

  statusenum: require('./utils/statusenum.js'),
  native: require('./utils/native.js'),
  utils: require('./utils/util.js'),

  onLaunch: function () {
    try {
      this.hubConnect = new Hub.HubConnection();
      var context = wx.getStorageSync('workContext')
      if (context) {
        this.global.token = context.AccessToken;
        this.global.userInfo = context;
        this.linkHub();
      }
    } catch (e) {
      //console.log(e)
    }

    //获取位置信息
    wx.startLocationUpdate({
      success: (res) => {
        //console.log(res)
      },
      fail: (res) => {
        //console.log(res)
        wx.showToast({
          title: '请转到设置，打开定位权限以便更好体验',
          icon: 'none',
          duration: 3000
        });

      }
    })
    wx.onLocationChange((res) => {
      this.global.gcj02_location = res;
      this.global.bd09_location = locationUtil.GCJ02Tobd09II({
        "lon": res.longitude,
        "lat": res.latitude
      });
      //console.log(this.global.bd09_location);
      wx.stopLocationUpdate({
        success: (res) => {
          //console.log('位置停止成功');
        },
      })
    });

    this.config = Object.assign(environment.defaultConfig, environment[this.global.mode]);
    //console.log(`=== 当前开发环境 ${this.global.mode} ===`);
    // 检查更新
    versionUtil.checkUpdate();
    //------
  },

  //用户存在时建立连接
  linkHub() {
    var that = this
    this.hubConnect.start(that.global.ipw, {});
    //绑定事件
    that.initEventHandle()
  },

  //绑定事件
  initEventHandle() {
    var that = this
    //成功开启连接时
    this.hubConnect.onOpen = res => {
      //console.log('onOpen', res)
      //调用服务端注册在线用户
      this.hubConnect.send("Login", {
        StoreId: this.global.storeId,
        UserId: this.global.userInfo.Id,
        Name: this.global.userInfo.UserRealName,
        Avatar: this.global.userInfo.FaceImage,
        MobileNumber: this.global.userInfo.MobileNumber
      });
      //重置状态
      that.reset()
      //开始心跳
      that.start()
    }

    //连接成功时
    this.hubConnect.on("UserConnected", res => {
      //user
      //console.log('用户加入：', res)

    })

    //断开连接时
    this.hubConnect.on("UserDisconnected", res => {
      //user
      //console.log('用户退出：', res)

    })

    //确认登录
    this.hubConnect.on("MakeLogin", connectionId => {
      //console.log('MakeLogin', connectionId)
      //非第一次登录时
      if (!that.isFirstLogin) {
        that.hubConnect.invoke("CheckLogin", that.connectionId);
      } else {
        that.isFirstLogin = false;
      }
      that.connectionId = connectionId
    })

    //连接关闭时
    this.hubConnect.onClose = res => {
      //console.log('onClose', res)
      //重新连接
      that.reconnect()
    }

    //连接出错时
    this.hubConnect.onError = res => {
      //console.log('onError', res)
      //重新连接
      that.reconnect()
    }

    //接收心跳消息
    this.hubConnect.on("OnHeartbeat", res => {
      //console.log('OnHeartbeat', res)
      //回调
      if (!util.isEmpty(that.global.token))
        that.global.callback(res)
    })


    //接收服务端消息
    this.hubConnect.on("Receive", res => {
      //强制注销
      if (res.toUpperCase() == 'SIGNOUT') {
        wx.showToast({
          title: '您账号权限变更请重新进入小程序',
          icon: 'error',
          duration: 5000
        })
        this.global.token = '';
        this.global.userInfo = {}
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/login/index',
            complete: (res) => {}
          })
        }, 3000);
      }
      //通告
      else {
        wx.lin.showDialog({
          type: 'alert',
          title: '消息提示~',
          content: res,
          success: (res) => {
            if (res.confirm) {}
          }
        })
      }
    })

  },

  //重新连接
  reconnect() {
    var that = this;
    if (that.lockReconnect) return;
    that.lockReconnect = true;
    clearTimeout(that.timer)
    //连接10次后不再重新连接
    if (that.global.limit < 10) {
      that.timer = setTimeout(() => {
        //重新连接
        that.linkHub();
        that.lockReconnect = false;
        //console.log("次数:" + that.global.limit)
      }, 5000); //每隔5秒连接一次
      that.global.limit = that.global.limit + 1
    }
  },

  //重置心跳
  reset: function () {
    var that = this;
    clearTimeout(that.global.timeoutObj);
    clearTimeout(that.global.serverTimeoutObj);
    return that;
  },

  //开始心跳
  start: function () {
    var that = this;
    that.global.timeoutObj = setTimeout(() => {
      //console.log("心跳开始发送ping");
      this.hubConnect.send("SendHeartbeat", 'ping');
    }, that.global.timeout);
  }
});