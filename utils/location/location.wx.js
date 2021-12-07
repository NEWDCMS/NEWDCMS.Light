const locationUtil = require('./location.util')
const app = getApp()
const myGetWxLocation = async () =>{
    try {
      await getWxLocation()//等待
    } catch (error) {
      Model({
        title: '温馨提示',
        tip: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
        showCancel: true,
        confirmText: '前往设置',
        cancelText: '取消',
        sureCall() {
          toSetting()
        },
        cancelCall() {}
      })
      return
    }
  }
  
  const getWxLocation = ()=> {
    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    return new Promise((resolve, reject) => {
      let _locationChangeFn = (res) => {
        //console.log('location change', res)

        
        app.global.gcj02_location = res;
        app.global.bd09_location = locationUtil.GCJ02Tobd09II({
        "lon": res.longitude,
        "lat": res.latitude
      });
      //console.log(app.global.bd09_location);

        wx.hideLoading()
        wx.offLocationChange(_locationChangeFn)
      }
      wx.startLocationUpdate({
        success: (res) => {
          //console.log('开启定位成功',res);
          wx.onLocationChange(_locationChangeFn)
          resolve()
        },
        fail: (err) => {
          //console.log('获取当前位置失败', err)
          wx.hideLoading()
          reject()
        }
      })
    })
  }
  const toSetting = ()=> {
    wx.openSetting({
      success(res) {
        //console.log(res)
        if (res.authSetting["scope.userLocation"]) {
          // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
          myGetWxLocation()
        }
      }
    })
  }

  module.exports = {
    myGetWxLocation,
  }