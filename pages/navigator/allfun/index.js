import tabbar from '../../tabbar';
import BillTypeEnum from '../../../models/typeEnum'
import PageTypeEnum from '../../../models/pageTypeEnum'
const settingService = require('../../../services/setting.service')

const moduledata = [{
    id: 39,
    atype: 0,
    active: true,
    navigation: '/packagePages/bills/pages/saleOrderBillPage/index',
    name: '销售订单',
    icon: 'cart',
    color: '#53a245',
    selected: true
  },
  {
    id: 41,
    atype: 0,
    active: true,
    navigation: `/packagePages/bills/pages/saleBillPage/index?billType=${BillTypeEnum.SaleBill}&pageType=${PageTypeEnum.add}`,
    name: '销售单',
    icon: 'shopping-cart',
    color: '#53a245',
    selected: true,
  },
  {
    id: 40,
    atype: 0,
    active: false,
    navigation: 'returnorderbillpage',
    name: '退货订单',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false
  },
  {
    id: 42,
    atype: 0,
    active: true,
    navigation: '/packagePages/bills/pages/returnBillPage/index',
    name: '退货单',
    icon: 'balance-list',
    color: '#53a245',
    selected: true

  },
  {
    id: 81,
    atype: 0,
    active: true,
    navigation: 'allocationbillpage',
    name: '调拨单',
    icon: 'umbrella-circle',
    color: '#53a245',
    selected: false

  },
  {
    id: 46,
    atype: 0,
    active: false,
    navigation: 'trackallocationbillpage',
    name: '装车调拨',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,
  },
  {
    id: 46,
    atype: 0,
    active: false,
    navigation: 'backstockbillpage',
    name: '回库调拨',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 105,
    atype: 0,
    active: true,
    navigation: '/packagePages/bills/pages/receiptBillPage/index',
    name: '收款单',
    icon: 'gold-coin',
    color: '#53a245',
    selected: true,

  },
  {
    id: 109,
    atype: 0,
    active: false,
    navigation: 'costexpenditurebillpage',
    name: '费用支出',
    icon: 'bill',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 107,
    atype: 0,
    active: false,
    navigation: 'advancereceiptbillpage',
    name: '预收款单',
    icon: 'bill',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 110,
    atype: 0,
    active: false,
    navigation: 'costcontractbillpage',
    name: '费用合同',
    icon: 'bill',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 72,
    atype: 0,
    active: false,
    navigation: 'purchaseorderbillpage',
    name: '采购单',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 86,
    atype: 0,
    active: false,
    navigation: 'inventoryopbillpage',
    name: '盘点单',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 89,
    atype: 2,
    active: false,
    navigation: 'inventoryreportpage',
    name: '库存上报',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 51,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=51&title=客户排行榜',
    name: '客户排行榜 ',
    icon: 'medal',
    color: '#53a245',
    selected: true,
  },
  {
    id: 52,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=52&title=业务销售排行',
    name: '业务销售排行',
    icon: 'label',
    color: '#53a245',
    selected: true,
    permissioncodes: {

    }
  },
  {
    id: 55,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=55&title=品牌销量汇总',
    name: '品牌销量汇总',
    icon: 'goods-collect',
    color: '#53a245',
    selected: true,

  },
  {
    id: 61,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=61&title=热销排行榜',
    name: '热销排行榜',
    icon: 'hot-sale',
    color: '#53a245',
    selected: true,

  },
  {
    id: 62,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=62&title=销量走势图',
    name: '销量走势图',
    icon: 'youzan-shield',
    color: '#53a245',
    selected: true,

  },
  {
    id: 90,
    atype: 3,
    active: false,
    navigation: 'stockquerypage',
    name: '库存查询',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: true,

  },
  {
    id: 98,
    atype: 1,
    active: false,
    navigation: 'unsalablepage',
    name: '库存滞销报表',
    icon: 'warning',
    color: '#bbbbbb',
    selected: false,
  },
  {
    id: 147,
    atype: 2,
    active: true,
    navigation: '/packagePages/reporting/pages/receivablesPage/index',
    name: '应收款',
    icon: 'column',
    color: '#53a245',
    selected: true,

  },
  {
    id: 163,
    atype: 2,
    active: true,
    navigation: '/packagePages/home/pages/visitingRatePage/index',
    name: '客户拜访分析',
    icon: 'graphic',
    color: '#53a245',
    selected: true,

  },
  {
    id: 116,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=116&title=销售利润排行',
    name: '销售利润排行',
    icon: 'thumb-circle',
    color: '#53a245',
    selected: true,

  },
  {
    id: 64,
    atype: 1,
    active: true,
    navigation: '/packagePages/home/pages/salesRatePage/index',
    name: '销售额分析',
    icon: 'balance-list',
    color: '#53a245',
    selected: true,

  },
  {
    id: 162,
    atype: 2,
    active: true,
    navigation: '/packagePages/home/pages/newCustomersPage/index',
    name: '新增客户分析',
    icon: 'new',
    color: '#53a245',
    selected: true,

  },
  {
    id: 161,
    atype: 2,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=161&title=客户拜访排行',
    name: '客户拜访排行',
    icon: 'good-job',
    color: '#53a245',
    selected: true,

  },
  {
    id: 157,
    atype: 2,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=157&title=客户活跃度',
    name: '客户活跃度',
    icon: 'friends',
    color: '#53a245',
    selected: true,

  },
  {
    id: 66,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=66&title=热定排行榜',
    name: '热定排行榜',
    icon: 'hot',
    color: '#53a245',
    selected: true,

  },
  {
    id: 65,
    atype: 1,
    active: true,
    navigation: '/packagePages/reporting/pages/reportViewPage/index?type=65&title=订单额分析',
    name: '订单额分析',
    icon: 'todo-list',
    color: '#53a245',
    selected: true,

  },
  {
    id: 1866,
    atype: 1,
    active: false,
    navigation: 'myreportingpage',
    name: '我的报表',
    icon: 'orders-o',
    color: '#bbbbbb',
    selected: false,

  },
  {
    id: 44,
    atype: 0,
    active: true,
    navigation: 'reconciliationorreceivablespage',
    name: '收款对账 ',
    icon: 'orders-o',
    color: '#53a245',
    selected: false,

  },
  {
    id: 154,
    atype: 2,
    active: true,
    navigation: '/packagePages/market/pages/visitRecordsPage/index',
    name: '业务员拜访记录',
    icon: 'shop-collect',
    color: '#53a245',
    selected: true
  },
  {
    id: 155,
    atype: 2,
    active: true,
    navigation: '/packagePages/market/pages/invitationPage/index',
    name: '拜访达成',
    icon: 'invitation',
    color: '#53a245',
    selected: true
  },
  {
    id: 1861,
    atype: 0,
    active: true,
    navigation: '/packagePages/order/pages/viewBillPage/index?type=12&title=我的单据',
    name: '我的单据',
    icon: 'bookmark',
    color: '#53a245',
    selected: true,
  },
  {
    id: 1862,
    atype: 0,
    active: true,
    navigation: '/packagePages/order/pages/billSummaryPage/index?type=12&title=单据汇总',
    name: '单据汇总',
    icon: 'more',
    color: '#53a245',
    selected: true,

  },
  {
    id: 122,
    atype: 3,
    active: true,
    navigation: '/packagePages/archive/pages/productArchivesPage/index',
    name: '商品档案',
    icon: 'card',
    color: '#53a245',
    selected: true,

  },
  {
    id: 130,
    atype: 3,
    active: true,
    navigation: '/packagePages/market/pages/customerArchivesPage/index',
    name: '客户档案',
    icon: 'vip-card',
    color: '#53a245',
    selected: true,

  },
  {
    id: 67,
    atype: 2,
    active: false,
    navigation: '/packagePages/market/pages/visitStorePage/index',
    name: '拜访门店',
    icon: 'shop',
    color: '#53a245',
    selected: false,
    permissioncodes: {

    }
  },
  {
    id: 42,
    atype: 0,
    active: true,
    navigation: '/packagePages/delivery/pages/deliveryReceiptPageindex',
    name: '送货签收',
    icon: 'bag',
    color: '#53a245',
    selected: true,

  },
  {
    id: 1864,
    atype: 0,
    active: false,
    navigation: 'exchangebillpage',
    name: '换货单',
    icon: 'sort',
    color: '#bbbbbb',
    selected: false,

  }
];

Page({

  data: {
    isBusy: true,
    list: tabbar,
    moduledata1: [],
    moduledata2: [],
    moduledata3: [],
    moduledata4: [],

    module_show_1: false,
    module_show_2: false,
    module_show_3: false,
    module_show_4: false
  },

  onLoad: function () {},
  onShow: async function () {
    await settingService.getAppFeatures().then(res => {
      console.log('getAppFeatures', res)
      if (res.code > 0) {
        let serviceModules = res.data.appDatas
        setTimeout(() => {
          let moduledata1 = []
          let moduledata2 = []
          let moduledata3 = []
          let moduledata4 = []
          moduledata.forEach((m, index) => {
            //m.locationId = m.id+`${index}`
            if (m.atype === 0 && serviceModules.findIndex(sm => sm.Id == m.id) >= 0) {
              moduledata1.push(m)
            } else if (m.atype === 1 && serviceModules.findIndex(sm => sm.Id == m.id) >= 0) {
              moduledata2.push(m)
            } else if (m.atype === 2 && serviceModules.findIndex(sm => sm.Id == m.id) >= 0) {
              moduledata3.push(m)
            } else if (m.atype === 3 && serviceModules.findIndex(sm => sm.Id == m.id) >= 0) {
              moduledata4.push(m)
            }
          })
          this.setData({
            isBusy: false,
            module_show_1: true,
            moduledata1: moduledata1,
            module_show_2: true,
            moduledata2: moduledata2,
            module_show_3: true,
            moduledata3: moduledata3,
            module_show_4: true,
            moduledata4: moduledata4,
          })
        }, 500);
      } else {
        wx.showToast({
          title: '发送错误',
          icon: 'none'
        })
      }
    })
  },
  //导航跳转
  clickGrid(e) {
    var cell = e.detail.cell;

    if (cell.active) {
      wx.navigateTo({
        url: cell.navigation
      });
    } else {
      wx.showToast({
        title: "功能完善中！",
        icon: 'none'
      });
    }
  }
});