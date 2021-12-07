const app = getApp()
const terminalService = require('../../../../services/terminal.service')
const locationUtil = require('../../../../utils/location/location.util')
const locationUtilWx = require('../../../../utils/location/location.wx')
const settingService = require('../../../../services/setting.service')
const FormData = require('../../../../utils/wx-formdata/formData')
const util = require('../../../../utils/util')

import drawQrcode from '../../../../utils/weapp.qrcode.esm.js'
import BillTypeEnum from '../../../../models/typeEnum'
import PageTypeEnum from '../../../../models/pageTypeEnum'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parames: {
      title: '',
      type: '',
      navigatemark: ''
    },
    currentConf: {
      show: false,
      animation: 'show',
      zIndex: 99,
      contentAlign: 'center',
      locked: false,
    },
    userName: app.global.userInfo.UserRealName,
    signInFlag: false,
    terminalData: {},
    terminalBalance: {},
    lastVisitInfo: {},
    visitStoreInfo: {},
    doorheadPhotos: [],
    displayPhotos: [],
    remark: '',
    currentSigninDateTimeStr: '请签到'
  },
  clear() {
    this.setData({
      clear: true
    });
  },
  onClearTap(e) {
    if (e.detail) {
      wx.lin.showToast({
        title: '清除图片成功',
        icon: 'success',
        duration: 2000,
        iconStyle: 'color:#7ec699; size: 60'
      });
    }
  },
  onChangeTap(e) {
    const count = e.detail.current.length;
    wx.lin.showToast({
      title: `添加${count}张图片~`,
      icon: 'picture',
      duration: 2000,
      iconStyle: 'color:#7ec699; size: 60'
    });
  },
  onRemoveTap(e) {
    const index = e.detail.index;
    wx.lin.showMessage({
      type: 'error',
      content: `删除下标为${index}图片~`,
      duration: 1500,
      icon: 'warning'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: "拜访门店"
    })
    //必须传递terminalId参数
    if (!util.isNull(options)) {
      if (util.isNull(options.terminalId)) {
        wx.showToast({
          title: '参数错误',
          icon: 'error'
        })
        return false
      }

      let terminalId = options.terminalId;

      //店铺二维码
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: terminalId
      })

      //加载拜访未签退数据
      await terminalService.getOutVisitStoreAsync().then(res => {
        //console.log('getOutVisitStoreAsync', res)
        if (util.isEmpty(res) || res.code <= 0) {
          wx.showToast({
            title: '加载拜访数据失败，请重新拜访',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 3000);

          return false
        }
        if (res.data.Id > 0) {
          //存在未签退
          terminalId = res.data.TerminalId
          res.data.currentSigninDateTimeStr = util.moment("yyyy-MM-dd hh:mm:ss", res.data.SigninDateTime)
          this.setData({
            visitStoreInfo: res.data,
            currentSigninDateTimeStr: res.data.currentSigninDateTimeStr,
            signInFlag: true
          })
          //加载缓存照片
          try {
            var value = wx.getStorageSync('visitTerminalInfo')
            if (value) {
              if (res.data.Id == value.Id) {
                this.setData({
                  doorheadPhotos: value.doorheadPhotos,
                  displayPhotos: value.displayPhotos
                })
              }
            }
          } catch (e) {
            //console.log(e)
          }
        }
      });
      //加载终端信息
      await terminalService.getTerminalAsync({
        terminalId: terminalId
      }).then(res => {
        //console.log('terminal', res)
        if (util.isEmpty(res.data.DoorwayPhoto)) {
          res.data.DoorwayPhoto = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ynshangji.com%2F00user%2Fproduct0_24%2F2015-8-8%2F447961-16283365.jpg&refer=http%3A%2F%2Fpic.ynshangji.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636615696&t=bf76c224ef3fc3645bf8b117689098aa'
        } else if (!res.data.DoorwayPhoto.startsWith('http')) {
          res.data.DoorwayPhoto = `${app.config['resourceDownloadApi']}${res.data.DoorwayPhoto}`
        } else {
          res.data.DoorwayPhotos = [res.data.DoorwayPhoto]
        }
        this.setData({
          terminalData: res.data
        })
      })
      //获取余额
      await terminalService.getTerminalBalanceAsync(terminalId).then(res => {
        //console.log('getTerminalBalanceAsync', res)
        this.setData({
          terminalBalance: res.data
        })
      })

      //获取上次拜访信息
      await terminalService.getLastVisitStoreAsync({
        terminalId: terminalId
      }).then(res => {
        //console.log('getLastVisitStoreAsync', res)
        //计算距离上传时间
        if (!util.isEmpty(res.data)) {

          if (!util.isEmpty(res.data.SigninDateTime) && res.data.SigninDateTime != 0 && !res.data.SigninDateTime.startsWith('0001')) {
            res.data.SigninDateTimeString = util.calcDateDistanceString(res.data.SigninDateTime, new Date()) + '前'
          } else {
            res.data.SigninDateTimeString = '未拜访'
          }
          if (!util.isEmpty(res.data.LastPurchaseDate) && res.data.LastPurchaseDate != 0) {
            res.data.LastPurchaseDateString = util.calcDateDistanceString(res.data.LastPurchaseDate, new Date()) + '前'
          } else {
            res.data.LastPurchaseDateString = '未采购'
          }
        }
        this.setData({
          lastVisitInfo: res.data
        })
      })
    } else {
      wx.navigateBack()
    }
  },
  onShow: function () {
    this.setData({
      userName: app.global.userInfo.UserRealName,
    })
  },
  openVisitRecords(res) {
    wx.navigateTo({
      url: `/packagePages/market/pages/visitRecordsPage/index?terminalId=${this.data.terminalData.Id}&terminalName=${this.data.terminalData.Name}`,
    })
  },
  doorHeadPhotoChange(res) {
    //console.log('doorHeadPhotoChange', res)
    if (!this.data.signInFlag) {
      wx.showToast({
        title: '请先签到',
        icon: 'error'
      });
      return false;
    }
    let imageTemp = res.detail.current[0]
    //console.log('photoChange', imageTemp)
    //new一个FormData对象
    let formData = new FormData();
    //调用它的append()方法来添加字段或者调用appendFile()方法添加文件
    formData.appendFile("file", imageTemp);
    let data = formData.getData();
    //添加完成后调用它的getData()生成上传数据，之后调用小程序的wx.request提交请求
    wx.request({
      method: 'POST',
      url: `${app.config['resourceUploadApi']}${app.global.storeId}`,
      header: {
        'Authorization': `${app.global.token ? 'Bearer '+app.global.token : 'Basic 123123'}`,
        'content-type': data.contentType
      },
      data: data.buffer,
      success: res => {
        //console.log('up success', res)
        let tempPhotos = this.data.doorheadPhotos;
        if (!util.isEmpty(res) && res.statusCode == 200 && res.data.success == true) {
          let resData = res.data.data
          if (!util.isEmpty(resData) && !util.isEmpty(resData.Id)) {
            tempPhotos.push({
              url: `${app.config['resourceDownloadApi']}${resData.Id}`,
              name: resData.Id
            })
            this.setData({
              doorheadPhotos: tempPhotos
            })
            let visitTerminalInfo = {
              Id: this.data.visitStoreInfo.Id,
              doorheadPhotos: tempPhotos,
              displayPhotos: this.data.displayPhotos
            };
            wx.setStorage({
              key: 'visitTerminalInfo',
              data: visitTerminalInfo
            })
          } else {
            this.setData({
              doorheadPhotos: this.data.doorheadPhotos
            })
            wx.showToast({
              title: '上传照片失败',
              icon: 'none'
            });
          }

        } else {
          this.setData({
            doorheadPhotos: this.data.doorheadPhotos
          })
          wx.showToast({
            title: '上传照片失败' + res.errMsg ?? '',
            icon: 'none'
          });
        }
      },
      fail: res => {
        //console.log('up fail', res)
        this.setData({
          doorheadPhotos: this.data.doorheadPhotos
        })
        wx.showToast({
          title: '上传照片失败' + res.errMsg ?? '',
          icon: 'none'
        });

      }

    });
  },
  doorHeadPhotoRemove(e) {
    //console.log('doorHeadPhotoRemove', e)
    let tempPhotos = this.data.doorheadPhotos;
    tempPhotos.forEach((item, index, arr) => {
      if (item.url == e.detail.current) {
        arr.splice(index, 1);
      }
    });
    this.setData({
      doorheadPhotos: tempPhotos
    })
    let visitTerminalInfo = {
      Id: this.data.visitStoreInfo.Id,
      doorheadPhotos: tempPhotos,
      displayPhotos: this.data.displayPhotos
    };
    wx.setStorage({
      key: 'visitTerminalInfo',
      data: visitTerminalInfo
    })
  },
  displayHeadPhotoChange(res) {
    //console.log('displayHeadPhotoChange', res)
    if (!this.data.signInFlag) {
      wx.showToast({
        title: '请先签到',
        icon: 'error'
      });
      return false;
    }
    let imageTemp = res.detail.current[0]
    //console.log('photoChange', imageTemp)
    //new一个FormData对象
    let formData = new FormData();
    //调用它的append()方法来添加字段或者调用appendFile()方法添加文件
    formData.appendFile("file", imageTemp);
    let data = formData.getData();
    //添加完成后调用它的getData()生成上传数据，之后调用小程序的wx.request提交请求
    wx.request({
      method: 'POST',
      url: `${app.config['resourceUploadApi']}${app.global.storeId}`,
      header: {
        'Authorization': `${app.global.token ? 'Bearer '+app.global.token : 'Basic 123123'}`,
        'content-type': data.contentType
      },
      data: data.buffer,
      success: res => {
        //console.log('up success', res)
        let tempPhotos = this.data.displayPhotos;
        if (!util.isEmpty(res) && res.statusCode == 200 && res.data.success == true) {
          let resData = res.data.data
          if (!util.isEmpty(resData) && !util.isEmpty(resData.Id)) {
            tempPhotos.push({
              url: `${app.config['resourceDownloadApi']}${resData.Id}`,
              name: resData.Id
            })
            this.setData({
              displayPhotos: tempPhotos
            })
            let visitTerminalInfo = {
              Id: this.data.visitStoreInfo.Id,
              doorheadPhotos: this.data.doorheadPhotos,
              displayPhotos: tempPhotos
            };
            wx.setStorage({
              key: 'visitTerminalInfo',
              data: visitTerminalInfo
            })
          } else {
            this.setData({
              displayPhotos: tempPhotos
            })
            wx.showToast({
              title: '上传照片失败',
              icon: 'none'
            });
          }
        } else {
          this.setData({
            displayPhotos: tempPhotos
          })
          wx.showToast({
            title: '上传照片失败' + res.errMsg ?? '',
            icon: 'none'
          });
        }
      },
      fail: res => {
        this.setData({
          displayPhotos: this.data.displayPhotos
        })
        wx.showToast({
          title: '上传照片失败' + res.errMsg ?? '',
          icon: 'none'
        });
      }

    })
  },
  displayHeadPhotoRemove(e) {
    //console.log('displayHeadPhotoRemove', e)
    let tempPhotos = this.data.displayPhotos;
    tempPhotos.forEach((item, index, arr) => {
      if (item.url == e.detail.current) {
        arr.splice(index, 1);
      }
    });
    this.setData({
      displayPhotos: tempPhotos
    })
    let visitTerminalInfo = {
      Id: this.data.visitStoreInfo.Id,
      doorheadPhotos: this.data.doorheadPhotos,
      displayPhotos: tempPhotos
    };
    wx.setStorage({
      key: 'visitTerminalInfo',
      data: visitTerminalInfo
    })
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  regulateLocation() {
    wx.chooseLocation({
      success: (res) => {
        //console.log('success', res)
        let bd09 = locationUtil.GCJ02Tobd09II({
          "lon": res.longitude,
          "lat": res.latitude
        })
        //console.log(bd09)
        terminalService.updateTerminalAsync(this.data.terminalData.Id, bd09.lat, bd09.lon).then(updateRes => {
          //console.log('updateTerminalAsync', updateRes)
          if (!util.isEmpty(updateRes) && updateRes.success == true && updateRes.data.Success == true) {
            this.setData({
              'terminalData.Location_Lat': bd09.lat,
              'terminalData.Location_Lng': bd09.lon
            })
            wx.showToast({
              title: '位置校正成功',
              icon: 'success'
            })
          } else {
            let message = ''
            if (!util.isEmpty(updateRes.message)) {
              message = updateRes.message
            }
            wx.showToast({
              title: '校正位置失败' + message,
              icon: 'none',
              duration: 5000
            })
          }
        })

      },
      complete: (res) => {
        //console.log('complete', res)
      }
    })
  },
  async signIn(e) {
    //判断距离
    await locationUtilWx.myGetWxLocation().then((res) => {
      var dis = locationUtil.getDistance(this.data.terminalData.Location_Lat, this.data.terminalData.Location_Lng, app.global.bd09_location.lat, app.global.bd09_location.lon);
      this.setData({
        'terminalData.Distance': dis
      })
      //console.log('dis', this.data.terminalData)
    });
    //console.log(app.global)
    if (this.data.terminalData.Distance * 1000 > 20) {
      await wx.lin.showDialog({
        type: 'confirm',
        title: '警告',
        content: '你确定要在' + (this.data.terminalData.Distance * 1000).toFixed(2) + '米外签到吗？',
        confirmText: '校准位置',
        confirmColor: '#3683d6',
        cancelText: '继续签到',
        cancelColor: '#999',
        success: (res) => {
          if (res.confirm) {
            this.regulateLocation()
          } else if (res.cancel) {
            this.submitSignIn({
              Abnormal: true,
              Distance: (this.data.terminalData.Distance * 1000).toFixed(2)
            })
          }
        }
      });
    } else {
      this.submitSignIn()
    }
  },
  async submitSignIn(res) {

    let params = {
      Id: 0,
      TerminalId: this.data.terminalData.Id,
      TerminalName: this.data.terminalData.Name,
      StoreId: app.global.storeId,
      BusinessUserId: app.global.userInfo.Id,
      BusinessUserName: app.global.userInfo.UserRealName,
      ChannelId: this.data.terminalData.ChannelId,
      DistrictId: this.data.terminalData.DistrictId,
      SigninDateTimeEnable: true,
      SigninDateTime: util.time(),
      SignOutDateTime: util.time(),
      VisitTypeId: 2,
      SignTypeId: 1,
      SignType: 1,
      Remark: 'LocationAddress',
      Latitude: app.global.bd09_location.lat,
      Longitude: app.global.bd09_location.lon
    };
    if (res) {
      params.Distance = res.Distance;
      params.Abnormal = res.Abnormal;
    }
    console.log('params', params)
    await terminalService.signInVisitStoreAsync(params).then((res) => {
      //console.log('post signIn', res)
      if (res.Return == 0 && res.success == true && res.data.TerminalId > 0 && res.data.Id > 0) {
        wx.showToast({
          title: '签到成功',
          icon: 'success'
        });
        res.data.currentSigninDateTimeStr = util.moment("yyyy-MM-dd hh:mm:ss", res.data.SigninDateTime)
        this.setData({
          visitStoreInfo: res.data,
          currentSigninDateTimeStr: res.data.currentSigninDateTimeStr,
          signInFlag: true
        })
      } else {
        wx.showToast({
          title: '签到失败' + res?.data?.Message ?? '',
          icon: 'none'
        });
      }
    })

  },
  async signOut(e) {

    if (this.data.visitStoreInfo.Id <= 0) {
      await wx.showToast({
        title: '请先签到',
        icon: 'error'
      });
      return;
    }

    if (this.data.doorheadPhotos.length <= 0) {
      await wx.showToast({
        title: '请拍摄门头照片',
        icon: 'error'
      });
      return;
    }

    if (this.data.displayPhotos.length <= 0) {
      await wx.showToast({
        title: '请拍摄陈列照片',
        icon: 'error'
      });
      return;
    }
    let visitTimeFlag = await settingService.getCompanySettingAsync().then(
      res => {
        //console.log('setting', res)
        if (res.Return == 0 && res.success == true) {

          let doorheadPhotoNum = 0
          if (!util.isEmpty(res.data.DoorheadPhotoNum)) {
            doorheadPhotoNum = res.data.DoorheadPhotoNum
          }
          let displayPhotoNum = 0
          if (!util.isEmpty(res.data.DisplayPhotoNum)) {
            displayPhotoNum = res.data.DisplayPhotoNum
          }
          if (doorheadPhotoNum > 0 && this.data.doorheadPhotos.length < doorheadPhotoNum) {
            wx.showToast({
              title: `门头照片必须大于等于${doorheadPhotoNum}张照片`,
              icon: 'none'
            });
            return false;
          }
          if (displayPhotoNum > 0 && this.data.displayPhotos.length < displayPhotoNum) {
            wx.showToast({
              title: `陈列照片必须大于等于${displayPhotoNum}张照片`,
              icon: 'none'
            });
            return false;
          }


          var new_date = new Date();
          var old_date = new Date(this.data.visitStoreInfo.SigninDateTime);
          var difftime = (new_date - old_date) / 60000;
          //console.log('difftime', difftime);
          if (res.data.OnStoreStopSeconds > 0 && difftime < res.data.OnStoreStopSeconds) {
            wx.showToast({
              title: `拜访时间必须大于${res.data.OnStoreStopSeconds}分钟`,
              icon: 'none'
            });
            return false;
          }
          return true;
        }
      }
    );
    if (!visitTimeFlag) {
      return
    }
    let params = {
      Id: this.data.visitStoreInfo.Id,
      Remark: this.data.remark,
      DisplayPhotos: this.data.displayPhotos.map(item => {
        return {
          DisplayPath: item.url
        }
      }),
      DoorheadPhotos: this.data.doorheadPhotos.map(item => {
        return {
          StoragePath: item.url
        }
      })
    }
    //console.log('params', params);
    // DisplayPhotos DoorheadPhotos DisplayPath
    await terminalService.signOutVisitStoreAsync(params).then(res => {
      //console.log('out', res)
      if (res.Return == 0 && res.success == true) {
        wx.showToast({
          title: '签退成功',
          icon: 'success',
          complete: () => {
            wx.switchTab({
              url: '/pages/navigator/index/index'
            });
          }
        });
      } else {
        wx.showToast({
          title: '签退失败' + res?.data?.Message ?? '',
          icon: 'none'
        });
      }
    })

  },
  onRemarkInput(e) {
    //console.log('remark', e)
    this.setData({
      remark: e.detail.value
    })
  },
  async openSaleBill(e) {
    //console.log('openSaleBill', e)
    if (!this.data.signInFlag) {
      await wx.showToast({
        title: '请先签到',
        icon: 'error'
      });
      return false;
    }
    if (e.currentTarget.dataset.billtype == 12) {
      wx.navigateTo({
        url: `/packagePages/bills/pages/saleBillPage/index?billType=${BillTypeEnum.SaleBill}&pageType=${PageTypeEnum.add}&terminalId=${this.data.terminalData.Id}&terminalName=${this.data.terminalData.Name}`
      });
    } else if (e.currentTarget.dataset.billtype == 14) {
      wx.navigateTo({
        url: `/packagePages/bills/pages/returnBillPage/index?billType=${BillTypeEnum.ReturnBill}&pageType=${PageTypeEnum.add}&terminalId=${this.data.terminalData.Id}&terminalName=${this.data.terminalData.Name}`
      });
    }

  },
  //跳转
  onRedirect: function (e) {
    var url = e.currentTarget.dataset.key
    wx.navigateTo({
      url: url
    });
  },
  //店铺管家
  onOpenStore: function (e) {
    this.setData({
      currentConf: {
        show: true,
        animation: 'show',
        zIndex: 99,
        contentAlign: 'center',
        locked: false,
      }
    });
  },
})