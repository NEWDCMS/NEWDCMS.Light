import tabbar from '../../tabbar';
import BillTypeEnum from '../../../models/typeEnum'
import PageTypeEnum from '../../../models/pageTypeEnum'
import {
  isDef,
  isNumber,
  isPlainObject,
  isPromise
} from '../../../dist/common/validator';


const util = require('../../../utils/util')
const app = getApp();
const authUtil = require('../../../utils/authentication.util')
const reportingService = require('../../../services/reporting.service')
const terminalService = require('../../../services/terminal.service')
const settingService = require('../../../services/setting.service')
const Chart = require('../../../components/chartjs/Chart.umd.min')
const FormData = require('../../../utils/wx-formdata/formData')

const appDatasDefault = [{
  id: 67,
  image: 'shop',
  text: '门店拜访',
  appModuleId: 0,
  navigateMark: '/packagePages/market/pages/visitStorePage/index'
}, {
  id: 154,
  image: 'shop-collect',
  text: '拜访记录',
  appModuleId: 1,
  navigateMark: '/packagePages/market/pages/visitRecordsPage/index'
}, {
  id: 41,
  image: 'shopping-cart',
  text: '销售单',
  appModuleId: 2,
  navigateMark: `/packagePages/bills/pages/saleBillPage/index?billType=${BillTypeEnum.SaleBill}&pageType=${PageTypeEnum.add}`
}, {
  id: 39,
  image: 'cart',
  text: '销售订单',
  appModuleId: 3,
  navigateMark: `/packagePages/bills/pages/saleOrderBillPage/index?billType=${BillTypeEnum.SaleReservationBill}&pageType=${PageTypeEnum.add}`
}, {
  id: 42,
  image: 'balance-list',
  text: '退货单',
  appModuleId: 4,
  navigateMark: `/packagePages/bills/pages/returnBillPage/index?billType=${BillTypeEnum.ReturnBill}&pageType=${PageTypeEnum.add}`
}, {
  id: 81,
  image: 'umbrella-circle',
  text: '调拨单',
  appModuleId: 5,
  navigateMark: '/packagePages/bills/pages/allocationBillPage/index'
}, {
  id: 44,
  image: 'gold-coin',
  text: '收款对账',
  appModuleId: 6,
  navigateMark: '/packagePages/reconciliation/pages/reconciliationORreceivablesPage/index'
}, {
  id: 105,
  image: 'bill',
  text: '收款单',
  appModuleId: 7,
  navigateMark: '/packagePages/bills/pages/receiptBillPage/index'
}, {
  id: 44,
  image: 'column',
  text: '应收款',
  appModuleId: 8,
  navigateMark: '/packagePages/reporting/pages/receivablesPage/index'
}]

Page({
  data: {
    isBusy: true,
    hotSaleRanking: false,
    businessAnalysis: false,
    userInfo: {},
    businessUsers: [],
    dashboardData: {
      TodayAddTerminalQuantity: 0,
      TodayOrderQuantity: 0,
      TodaySaleAmount: 0,
      TodayVisitQuantity: 0,
      YesterdayAddTerminalQuantity: 0,
      YesterdayOrderQuantity: 0,
      YesterdaySaleAmount: 0,
      YesterdayVisitQuantity: 0
    },
    list: tabbar,
    topToolbarList: [{
      type: 0,
      url: '/packagePages/root/pages/scanBarcodePage/index',
      icon: 'scan',
      name: '扫一扫'
    }, {
      type: 1,
      url: '/packagePages/root/pages/scanBarcodePage/index',
      icon: 'photograph',
      name: '门头识别'
    }, {
      type: 2,
      url: '/packagePages/root/pages/scanBarcodePage/index',
      icon: 'setting',
      name: '设置'
    }],
    lineChart: {},
    barChart: {},
    currentConfig: {
      show: false,
      transition: true,
      showClose: true,
      zIndex: 99,
      locked: false,
      direction: 'bottom',
      arcRadius: 18,
      maxHeight: 600,
      minHeight: 200,
      opacity: 0.4
    },
    appDatas: []
  },
  touchLineHandler(e) {
    this.lineChart.instance.touchHandler(e);
  },
  touchBarHandler(e) {
    this.barChart.instance.touchHandler(e);
  },

  onLoad: async function () {
    this.setData({
      isBusy: true
    });

    //检测登录状态
    let is_login = await authUtil.checkLogin();
    if (!is_login) {
      return
    }
    authUtil.getBasicData();

    //初始化
    this.setData({
      userInfo: app.global.userInfo
    });
    //统计面板
    await this.getDashboardReport()
    await this.getHotSaleRankingAsync()
    await this.getBusinessAnalysis()

    this.setData({
      isBusy: false
    });
  },

  async getHotSaleRankingAsync() {
    //热销排行榜
    this.barChart = {};
    let terminalId = 0;
    let businessUserId = 0;
    let brandId = 0;
    let categoryId = 0;
    let startTime = util.now(-30);
    let endTime = util.now(0);
    await reportingService.getHotSaleRankingAsync({
        terminalId: terminalId,
        businessUserId: businessUserId,
        brandId: brandId,
        categoryId: categoryId,
        startTime: startTime,
        endTime: endTime
      }, false)
      .then((results) => {
        ////console.log('getHotSaleRankingAsync:', results)
        if (results.length > 0) {
          this.setData({
            hotSaleRanking: true
          })

          let labels = results.sort(function (a, b) {
              return b.TotalSumNetQuantity - a.TotalSumNetQuantity
            })
            .slice(0, 9)
            .map(s => {
              return s.ProductName;
            });

          let datas = results.sort(function (a, b) {
              return b.TotalSumNetQuantity - a.TotalSumNetQuantity
            })
            .slice(0, 9)
            .map(s => {
              return s.TotalSumNetQuantity ?? 0;
            });

          //////console.log('labels:', labels)
          let barConfig = {
            type: 'horizontalBar',
            data: {
              labels: labels,
              datasets: [{
                data: datas,
                backgroundColor: [
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998',
                  '#3B5998'
                ],
                hoverBackgroundColor: [
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245',
                  '#53a245'
                ],
                label: '销量'
              }]
            },
            options: {
              responsive: true,
              legend: false,
              tooltips: {
                mode: 'index',
                intersect: false,
              }
            }
          }
          this.barChart.config = barConfig;
          this.barChart.instance = new Chart('hotBarChart', this.barChart.config);
        }
      });
  },

  async getBusinessAnalysis() {
    //业务统计
    this.lineChart = {};
    //今日 1  昨天 3 前天 4 本月 8
    let type = 8;
    await reportingService.getBusinessAnalysis(type, false)
      .then((results) => {
        if (results != null) {

          this.setData({
            businessAnalysis: true
          })

          let lineConfig = {
            type: 'line',
            data: {
              labels: results.UserNames,
              datasets: [{
                label: '拜访',
                backgroundColor: 'transparent',
                borderColor: 'rgba(242, 71, 80, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(242, 71, 80, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                data: results.VistCounts,
                fill: false,
              }, {
                label: '销售数',
                fill: false,
                backgroundColor: 'transparent',
                borderColor: 'rgba(41, 191, 118, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(41, 191, 118, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                data: results.SaleCounts,
              }, {
                label: '新增数',
                fill: false,
                backgroundColor: 'transparent',
                borderColor: 'rgba(242, 71, 80, 1)',
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgba(242, 71, 80, 1)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                data: results.NewAddCounts,
              }]
            },
            options: {
              responsive: true,
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              scales: {
                xAxes: [{
                  display: true,
                  ticks: {
                    minRotation: 45
                  },
                  position: 'bottom'
                }],
                yAxes: [{
                  display: true
                }]
              }
            }
          }
          this.lineChart.config = lineConfig;
          this.lineChart.instance = new Chart('statLineChart', this.lineChart.config);
        }
      });
  },

  async getDashboardReport() {
    await reportingService
      .getDashboardReportAsync()
      .then((res) => {
        //console.log('dashboardData', res)
        if (res.code > 0) {
          this.setData({
            dashboardData: res.data
          })
        }
      });
  },

  onShow: async function () {


    await settingService.getAppFeatures().then(res => {
      console.log('getAppFeatures', res)
      if (res.code > 0) {
        let serviceModules = res.data.appDatas
        let moduledata = []
        appDatasDefault.forEach(m => {
          if (serviceModules.findIndex(sm => sm.Id == m.id) >= 0) {
            moduledata.push(m)
          }
        })
        this.setData({
          appDatas: moduledata,
        })
      } else {
        wx.showToast({
          title: '发送错误',
          icon: 'none'
        })
      }
    })

    app.global.callback = async function (res) {
      await authUtil.getBasicData();
    }
    //统计面板
    this.getDashboardReport()
    await this.getHotSaleRankingAsync()
    await this.getBusinessAnalysis()
  },

  //应用导航
  async clickGrid(e) {
    var cell = e.detail.cell;
    //拜访
    if (cell.appModuleId == 0) {
      await terminalService.getOutVisitStoreAsync().then(res => {
        ////console.log('getOutVisitStoreAsync', res)
        let d = res.data
        if (d.Id > 0) {
          wx.navigateTo({
            url: '/packagePages/market/pages/visitStorePage/index?terminalId=' + d.TerminalId
          });
        } else {
          wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=visit&navigatemark=' + '/packagePages/market/pages/visitStorePage/index'
          });
        }
      });

    } else if ([1, 2, 3, 4].includes(cell.appModuleId)) {
      wx.navigateTo({
        url: cell.navigateMark
      });
    } else if ([5, 6, 7, 8].includes(cell.appModuleId)) {
      wx.navigateTo({
        url: cell.navigateMark + '?type=add'
      });
    } else {
      wx.showToast({
        title: "功能完善中！",
        icon: 'none'
      });
    }
  },
  //统计面板跳转
  clickDashboard(e) {
    var url = e.currentTarget.dataset.key
    wx.navigateTo({
      url: url
    });
  },
  onPopupTap() {
    wx.showToast({
      title: '请点击按钮取消！',
      icon: 'none'
    });
  },
  //工具栏
  onToolClick(e) {
    const tool = e.currentTarget.dataset.item;
    //console.log('tool', tool)
    //使用原生接口扫码
    if (tool.type == 0) {
      util.scanCode(tool.type, (data) => {
        //console.log('scanCode', data)
      }, (res) => {
        //console.log('res', res)
      })
    }
    //门头识别
    else if (tool.type == 1) {
      this.recognizePoiName()
    }
  },
  // 显示Popup
  onShowPopupTap(e) {
    this.setData({
      panelClass: `l-panel-class-tool`
    });

    this.setData({
      currentConfig: {
        show: true,
        transition: true,
        zIndex: 99,
        locked: false,
        direction: 'top',
        arcRadius: 12,
        maxHeight: 600,
        minHeight: 200,
        opacity: 0.4
      }
    });
  },
  //选择排除
  pickExclude(obj, keys) {
    if (!isPlainObject(obj)) {
      return {};
    }
    return Object.keys(obj).reduce((prev, key) => {
      if (!keys.includes(key)) {
        prev[key] = obj[key];
      }
      return prev;
    }, {});
  },
  //门头识别
  recognizePoiName() {
    this.setData({
      currentConfig: {
        show: false
      }
    });
    wx.navigateTo({
      url: '/packagePages/common/pages/clipperPage/index?path='
    });
    /*
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        if (util.isNull(res)) {
          return false;
        }
        wx.setStorageSync('DCMS_RECOGNIZEPOINAME', res)
        let rurl = '/packagePages/common/pages/clipperPage/index?path=' + res.tempFilePaths
        wx.navigateTo({
          url: rurl
        });
      },
      complete: (res) => {
        this.setData({
          currentConfig: {
            show: false
          }
        });
      }
    });
    */
  }
});