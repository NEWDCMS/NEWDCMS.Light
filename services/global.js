const util = require('../utils/util')
import SessionStateEnum from '../models/sessionStateEnum'

/**
 * @description 全局变量
 * @property mode: 环境 dev:开发环境 prod：生产环境 
 * @property sysInfo: 系统信息
 * @property token：请求token
 * @property hasLoading： 用于存储当前http请求是否有调用loading效果
 */
export default class Global {
  constructor(mode) {
    this.mode = mode;
    this.sysInfo = wx.getSystemInfoSync();
    this.token = '';
    this.hasLoading = false;
    this.pageSize = 20;
    this.PAGE_WIDTH = 470;
    this.MAX_CHAR_COUNT_EACH_LINE = 46;
    this.storeId = 0;
    this.userId = 0;

    this.bd09_location = {};
    this.gcj02_location = {};
    this.locationRange = 5054930000;
    this.locationRanges = [{
        text: '距离',
        value: 5054930000
        // value: 0
      }, {
        text: '200米',
        value: 0.2
      },
      {
        text: '500米',
        value: 0.5
      },
      {
        text: '1公里',
        value: 1
      },
      {
        text: '5公里',
        value: 5
      },
      {
        text: '10公里',
        value: 10
      }
    ];
    this.districts = [];
    this.channels = [];
    this.lineTiers = [];
    this.ranks = [];
    this.businessUsers = [];
    this.subUsers = [];
    this.inactive = {
      deviceId: '',
      serviceId: '',
      characteristicId: '',
      name: ''
    };
    this.companySetting = {
      Value: '0_0',
      Text: '无'
    };

    //单据系统设置
    this.saleBill = {
      WareHouseId: 0,
      WarehouseName: ''
    };
    this.saleReservationBill = {
      WareHouseId: 0,
      WarehouseName: ''
    };
    this.returnBill = {
      WareHouseId: 0,
      WarehouseName: ''
    };
    this.returnReservationBill = {
      WareHouseId: 0,
      WarehouseName: ''
    };
    this.allocationBill = {};
    this.cashReceiptBill = {};

    //wss/https服务器地址 
    this.ipw = 'https://api.xxx.com/chatHub';
    this.limit = 0;
    //超时时间
    this.timeout = 5000;
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    //签收单据缓存key
    this.saleOrderBillSignStoragekey = 'saleOrderBillSignStoragekey';
    //小程序会话状态
    this.sessionState = SessionStateEnum.activating
  }

  //WSS回调
  callback(params) {}


  set ipw(value) {
    this._ipw = value;
  }
  get ipw() {
    return this._ipw;
  }

  set limit(value) {
    this._limit = value;
  }
  get limit() {
    return this._limit;
  }

  set timeout(value) {
    this._timeout = value;
  }
  get timeout() {
    return this._timeout;
  }

  set timeoutObj(value) {
    this._timeoutObj = value;
  }
  get timeoutObj() {
    return this._timeoutObj;
  }

  set serverTimeoutObj(value) {
    this._serverTimeoutObj = value;
  }
  get serverTimeoutObj() {
    return this._serverTimeoutObj;
  }


  set companySetting(value) {
    this._companySetting = value;
  }
  get companySetting() {
    return this._companySetting;
  }
  set bd09_location(value) {
    this._bd09_location = value;
  }
  get bd09_location() {
    return this._bd09_location;
  }

  set gcj02_location(value) {
    this._gcj02_location = value;
  }
  get gcj02_location() {
    return this._gcj02_location;
  }

  set locationRange(value) {
    this._locationRange = value;
  }
  get locationRange() {
    return this._locationRange;
  }

  set districts(value) {
    this._districts = value;
  }
  get districts() {
    return this._districts;
  }

  set channels(value) {
    this._channels = value;
  }
  get channels() {
    return this._channels;
  }

  set lineTiers(value) {
    this._lineTiers = value;
  }
  get lineTiers() {
    return this._lineTiers;
  }

  set ranks(value) {
    this._ranks = value;
  }
  get ranks() {
    return this._ranks;
  }

  set subUsers(value) {
    this._subUsers = value;
  }
  get subUsers() {
    return this._subUsers;
  }

  set saleOrderBillSignStoragekey(value) {
    this._saleOrderBillSignStoragekey = value;
  }
  get saleOrderBillSignStoragekey() {
    return this._saleOrderBillSignStoragekey;
  }

  //业务员选择
  set businessUsers(value) {
    this._businessUsers = value;
  }
  get businessUsers() {
    try {
      var users = wx.getStorageSync('businessUsers')
      if (users) {
        return users;
      }
    } catch (e) {
      return this._businessUsers;
    }
  }

  //当前适配打印设备
  set inactive(value) {
    this._inactive = value;
  }
  get inactive() {
    try {
      var print = wx.getStorageSync('inactive')
      if (print) {
        return print;
      }
    } catch (e) {
      return this._inactive;
    }
  }

  /* 经销商标识 */
  set storeId(value) {
    this._storeId = value;
  }

  get storeId() {
    try {
      var context = wx.getStorageSync('workContext')
      ////console.log('----------------workContext-------------------------------')
      ////console.log(context)
      if (context) {
        return this._storeId == 0 ? context.storeId : this._storeId;
      }
    } catch (e) {
      return this._storeId;
    }
  }

  /* 用户标识 */
  set userId(value) {
    this._userId = value;
  }
  get userId() {
    try {
      var context = wx.getStorageSync('workContext')
      if (context) {
        return this._userId == 0 ? context.Id : this._userId;
      }
    } catch (e) {
      return this._userId;
    }
  }

  set mode(value) {
    this._mode = value;
  }
  get mode() {
    return this._mode;
  }


  set sysInfo(value) {
    this._sysInfo = value;
  }
  get sysInfo() {
    return this._sysInfo;
  }

  set token(value) {
    this._token = value;
  }
  get token() {
    return this._token
  }

  set hasLoading(value) {
    this._hasLoading = value;
  }
  get hasLoading() {
    return this._hasLoading;
  }
  set userInfo(value) {
    this._userInfo = value;
  }
  get userInfo() {
    return this._userInfo;
  }

  set pageSize(value) {
    this._pageSize = value;
  }
  get pageSize() {
    return this._pageSize;
  }
  set sessionState(value) {
    this._sessionState = value;
  }
  get sessionState() {
    return this._sessionState;
  }

  //默认打印纸张大小
  set PAGE_WIDTH(value) {
    this._PAGE_WIDTH = value;
  }
  get PAGE_WIDTH() {
    return this._PAGE_WIDTH == 0 ? 470 : this._PAGE_WIDTH;
  }

  //默认打印单行最大字符
  set MAX_CHAR_COUNT_EACH_LINE(value) {
    this._MAX_CHAR_COUNT_EACH_LINE = value;
  }
  get MAX_CHAR_COUNT_EACH_LINE() {
    return this._MAX_CHAR_COUNT_EACH_LINE == 0 ? 46 : this._MAX_CHAR_COUNT_EACH_LINE;
  }



  /* 销售单 */
  set saleBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_SALEBILL', value)
    this._saleBill = value;
  }
  get saleBill() {
    try {
      var b = wx.getStorageSync('SETTING_SALEBILL')
      return util.isNull(b) ? this._saleBill : b;
    } catch (e) {
      return this._saleBill;
    }
  }


  /* 销售订单 */
  set saleReservationBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_SALERESERVATIONBILL', value)
    this._saleReservationBill = value;
  }
  get saleReservationBill() {
    try {
      var b = wx.getStorageSync('SETTING_SALERESERVATIONBILL')
      return util.isNull(b) ? this._saleReservationBill : b;
    } catch (e) {
      return this._saleReservationBill;
    }
  }

  /* 退货单 */
  set returnBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_RETURNBILL', value)
    this._returnBill = value;
  }
  get returnBill() {
    try {
      var b = wx.getStorageSync('SETTING_RETURNBILL')
      return util.isNull(b) ? this._returnBill : b;
    } catch (e) {
      return this._returnBill;
    }
  }

  /* 退货订单 */
  set returnReservationBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_RETURNRESERVATIONBILL', value)
    this._returnReservationBill = value;
  }
  get returnReservationBill() {
    try {
      var b = wx.getStorageSync('SETTING_RETURNRESERVATIONBILL')
      return util.isNull(b) ? this._returnReservationBill : b;
    } catch (e) {
      return this._returnReservationBill;
    }
  }

  /* 调拨单 */
  set allocationBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_ALLOCATIONBILL', value)
    this._allocationBill = value;
  }
  get allocationBill() {
    try {
      var b = wx.getStorageSync('SETTING_ALLOCATIONBILL')
      return util.isNull(b) ? this._allocationBill : b;
    } catch (e) {
      return this._allocationBill;
    }
  }

  /* 收款单 */
  set cashReceiptBill(value) {
    if (!util.isNull(value))
      wx.setStorageSync('SETTING_CASHRECEIPTBILL', value)
    this._cashReceiptBill = value;
  }
  get cashReceiptBill() {
    try {
      var b = wx.getStorageSync('SETTING_CASHRECEIPTBILL')
      return util.isNull(b) ? this._cashReceiptBill : b;
    } catch (e) {
      return this._cashReceiptBill;
    }
  }
}
