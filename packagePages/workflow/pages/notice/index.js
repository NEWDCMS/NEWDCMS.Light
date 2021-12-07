const util = require('../../../../utils/util')
const app = getApp();
const queuedMessageService = require('../../../../services/queuedMessage.service')

export const mssageConfigs = [];
Page({
  data: {
    isBusy: true,
    mssageConfigs: [{
        icon: 'chat',
        title: '审核完成',
        desc: '无数据内容',
        componentsPath: 'index?type=审核完成'
      },
      {
        icon: 'chat',
        title: '调度完成',
        desc: '无数据内容',
        componentsPath: 'index?type=调度完成'
      },
      {
        icon: 'chat',
        title: '盘点完成',
        desc: '无数据内容',
        componentsPath: 'index?type=盘点完成'
      },
      {
        icon: 'chat',
        title: '转单／签收完成',
        desc: '无数据内容',
        componentsPath: 'index?type=转单签收完成'
      },
      {
        icon: 'chat',
        title: '库存预警',
        desc: '无数据内容',
        componentsPath: 'index?type=库存预警'
      },
      {
        icon: 'chat',
        title: '签收异常',
        desc: '无数据内容',
        componentsPath: 'index?type=签收异常'
      },
      {
        icon: 'chat',
        title: '客户流失预警',
        desc: '无数据内容',
        componentsPath: 'index?type=客户流失预警'
      },
      {
        icon: 'chat',
        title: '开单异常',
        desc: '无数据内容',
        componentsPath: 'index?type=开单异常'
      },
      {
        icon: 'chat',
        title: '交账完成／撤销',
        desc: '无数据内容',
        componentsPath: 'index?type=交账完成撤销'
      }
    ]
  },
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: "系统通知"
    })

    
    let mTypeIds = [4, 5, 6, 7, 8, 9, 10, 11, 12]
    let params = {
      storeId: app.global.storeId,
      toUser: app.global.userInfo.MobileNumber,
      sentStatus: false,
      orderByCreatedOnUtc: true,
      maxSendTries: 0,
      startTime: util.now(-365),
      endTime: util.now(0),
      pageIndex: 0,
      pageSize: 50
    }
    await queuedMessageService
      .getQueuedMessagesAsync(mTypeIds, params)
      .then((res) => {
        //console.log('getQueuedMessagesAsync', res)
      });

    this.setData({
      isBusy: false
    });
  }
});