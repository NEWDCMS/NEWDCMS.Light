const util = require('../../../../utils/util')
const app = getApp();
const queuedMessageService = require('../../../../services/queuedMessage.service')


export const mssageConfigs = [];
Page({
  data: {
    isBusy: true,
    mssageConfigs: [{
        icon: 'comment',
        title: '审批',
        desc: '无待办信息'
      },
      {
        icon: 'gold-coin',
        title: '收款',
        desc: '无待办信息'
      },
      {
        icon: 'balance-list',
        title: '交账',
        desc: '无待办信息'
      }
    ]
  },

  onLoad: async function () {

    wx.setNavigationBarTitle({
      title: "待办任务"
    })

    let mTypeIds = [0, 1, 2, 3]
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