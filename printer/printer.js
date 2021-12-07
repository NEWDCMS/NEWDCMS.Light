import BillTypeEnum from '../models/typeEnum'
var util = require('../utils/util')
var toArrayBuffer = require('to-array-buffer');
var Buffer = require('buffer/').Buffer

const PrinterJobs = require('./printerjobs')
const printerUtil = require('./printerutil')
const app = getApp();

const printer = function () {
  this._events = {};
};


var __sto = setTimeout;
printer.prototype.setTimeout = function (callback, timeout, param) {
  var args = Array.prototype.slice.call(arguments, 2);
  var _cb = function () {
    callback.apply(null, args);
  }
  __sto(_cb, timeout);
}


/** 
 * 通用单据打印
 * billType： 单据类型
 * pd：单据数据
 * inactive：当前适配打印机
 */
printer.prototype.printBill = function (billType, pd, inactive) {
  return new Promise((resolve, reject) => {
    let printerJobs = new PrinterJobs();
    //console.log(pd);
    let remark = '本店出售商品质量合格，如果有误请在三日内联系，过期不负责任！'
    //单据类型
    switch (parseInt(billType)) {
      //调拨凭证 31
      case BillTypeEnum.AllocationBill: {
        //-----------------------------
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('调拨凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          //调拨单暂时去掉客户名称、客户电话、客户地址
          // .print(printerUtil.inline('客户名称:', pd.TerminalName))
          // .print(printerUtil.inline('客户电话:', pd.BossCall))
          // .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline4(`商品`, `数量`, `单位`, `金额`))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {
          if (util.sumStrLength(p.ProductName) > 12) {
            let arry = util.cutString(p.ProductName, 12)
            //console.log(arry)
            for (var i = 0; i < arry.length; i++) {
              if (i == 0) {
                printerJobs.print(printerUtil.inline4(arry[0], p.Quantity, p.UnitName, p.Subtotal, 4))
              } else {
                printerJobs.print(printerUtil.inline4(arry[i], '', '', '', 4))
                //最后一行换行
                if (i == (arry.length - 1))
                  printerJobs.print()
              }
            }
          } else {
            printerJobs.print(printerUtil.inline4(p.ProductName, p.Quantity, p.UnitName, p.Subtotal, 4))
          }
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('出货仓库:', pd.ShipmentWareHouseName))
          .print(printerUtil.inline('入货仓库:', pd.IncomeWareHouseName))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.MakeUserName))
          .print(printerUtil.inline('备注:', remark))
          .print()
          .print()
        //-----------------------------
        break;
      }
      //销售订单凭证 11
      case BillTypeEnum.SaleReservationBill: {
        //-----------------------------
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('销售订单凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          .print(printerUtil.inline('客户名称:', pd.TerminalName))
          .print(printerUtil.inline('客户电话:', pd.BossCall))
          .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('仓   库:', pd.WareHouseName))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline4(`商品`, `数量`, `单位`, `金额`))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {

          let subTotalStr = '' + p.Subtotal
          if (p.Subtotal == 0 && p.IsGifts) {
            subTotalStr = p.Remark == '' ? "赠品" : p.Remark;
          }

          if (util.sumStrLength(p.ProductName) > 12) {
            let arry = util.cutString(p.ProductName, 12)
            //console.log(arry)

            for (var i = 0; i < arry.length; i++) {
              if (i == 0) {
                printerJobs.print(printerUtil.inline4(arry[0], p.Quantity, p.UnitName, subTotalStr, 4))
              } else {
                printerJobs.print(printerUtil.inline4(arry[i], '', '', '', 4))
                //最后一行换行
                if (i == (arry.length - 1))
                  printerJobs.print()
              }
            }
          } else {
            printerJobs.print(printerUtil.inline4(p.ProductName, p.Quantity, p.UnitName, subTotalStr, 4))
          }
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('合计:', pd.SumAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.SumAmount)))

          .print(printerUtil.inline('优惠:', pd.PreferentialAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.PreferentialAmount)))

          .print(printerUtil.inline('欠款:', pd.OweCash))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.OweCash)))

          .print(printerUtil.inline('备注:', pd.Remark))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.BusinessUserName))
          .print(printerUtil.inline('签 名 栏:', ``))
          .print()
          .print()
          .print()
          .print()
        //-----------------------------
        break;
      }
      //销售单凭证 12 
      case BillTypeEnum.SaleBill: {
        //-----------------------------
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('销售单凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          .print(printerUtil.inline('客户名称:', pd.TerminalName))
          .print(printerUtil.inline('客户电话:', pd.BossCall))
          .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('仓   库:', pd.WareHouseName))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline4(`商品`, `数量`, `单位`, `金额`))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {
          let subTotalStr = '' + p.Subtotal
          if (p.Subtotal == 0 && p.IsGifts) {
            subTotalStr = p.Remark == '' ? "赠品" : p.Remark;
          }
          if (util.sumStrLength(p.ProductName) > 12) {
            let arry = util.cutString(p.ProductName, 12)
            //console.log(arry)

            for (var i = 0; i < arry.length; i++) {
              if (i == 0) {
                printerJobs.print(printerUtil.inline4(arry[0], p.Quantity, p.UnitName, subTotalStr, 4))
              } else {
                printerJobs.print(printerUtil.inline4(arry[i], '', '', '', 4))
                //最后一行换行
                if (i == (arry.length - 1))
                  printerJobs.print()
              }
            }
          } else {
            printerJobs.print(printerUtil.inline4(p.ProductName, p.Quantity, p.UnitName, subTotalStr, 4))
          }
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('合计:', pd.SumAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.SumAmount)))

          .print(printerUtil.inline('优惠:', pd.PreferentialAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.PreferentialAmount)))

          .print(printerUtil.inline('欠款:', pd.OweCash))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.OweCash)))

          .print(printerUtil.inline('备注:', pd.Remark))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.BusinessUserName))
          .print(printerUtil.inline('签 名 栏:', ``))
          .print()
          .print()
          .print()
          .print()
        //-----------------------------
        break;
      }
      //退货订单凭证 13
      case BillTypeEnum.ReturnReservationBill: {
        //-----------------------------
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('退货订单凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          .print(printerUtil.inline('客户名称:', pd.TerminalName))
          .print(printerUtil.inline('客户电话:', pd.BossCall))
          .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('仓   库:', pd.WareHouseName))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline4(`商品`, `数量`, `单位`, `金额`))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {
          let subTotalStr = '' + p.Subtotal
          if (p.Subtotal == 0 && p.IsGifts) {
            subTotalStr = p.Remark == '' ? "赠品" : p.Remark;
          }

          if (util.sumStrLength(p.ProductName) > 12) {
            let arry = util.cutString(p.ProductName, 12)
            //console.log(arry)

            for (var i = 0; i < arry.length; i++) {
              if (i == 0) {
                printerJobs.print(printerUtil.inline4(arry[0], p.Quantity, p.UnitName, subTotalStr, 4))
              } else {
                printerJobs.print(printerUtil.inline4(arry[i], '', '', '', 4))
                //最后一行换行
                if (i == (arry.length - 1))
                  printerJobs.print()
              }
            }
          } else {
            printerJobs.print(printerUtil.inline4(p.ProductName, p.Quantity, p.UnitName, subTotalStr, 4))
          }
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('合计:', pd.SumAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.SumAmount)))

          .print(printerUtil.inline('优惠:', pd.PreferentialAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.PreferentialAmount)))

          .print(printerUtil.inline('欠款:', pd.OweCash))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.OweCash)))

          .print(printerUtil.inline('备注:', pd.Remark))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.BusinessUserName))
          .print(printerUtil.inline('签 名 栏:', ``))
          .print()
          .print()
          .print()
          .print()
        //-----------------------------
        break;
      }
      //退货单凭证 14
      case BillTypeEnum.ReturnBill: {
        //-----------------------------
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('退货单凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          .print(printerUtil.inline('客户名称:', pd.TerminalName))
          .print(printerUtil.inline('客户电话:', pd.BossCall))
          .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('仓   库:', pd.WareHouseName))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline4(`商品`, `数量`, `单位`, `金额`))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {
          let subTotalStr = '' + p.Subtotal
          if (p.Subtotal == 0 && p.IsGifts) {
            subTotalStr = p.Remark == '' ? "赠品" : p.Remark;
          }

          if (util.sumStrLength(p.ProductName) > 12) {
            let arry = util.cutString(p.ProductName, 12)
            //console.log(arry)

            for (var i = 0; i < arry.length; i++) {
              if (i == 0) {
                printerJobs.print(printerUtil.inline4(arry[0], p.Quantity, p.UnitName, subTotalStr, 4))
              } else {
                printerJobs.print(printerUtil.inline4(arry[i], '', '', '', 4))
                //最后一行换行
                if (i == (arry.length - 1))
                  printerJobs.print()
              }
            }
          } else {
            printerJobs.print(printerUtil.inline4(p.ProductName, p.Quantity, p.UnitName, subTotalStr, 4))
          }
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('合计:', pd.SumAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.SumAmount)))

          .print(printerUtil.inline('优惠:', pd.PreferentialAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.PreferentialAmount)))

          .print(printerUtil.inline('欠款:', pd.OweCash))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.OweCash)))

          .print(printerUtil.inline('备注:', pd.Remark))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.BusinessUserName))
          .print(printerUtil.inline('签 名 栏:', ``))
          .print()
          .print()
          .print()
          .print()
        //-----------------------------
        break;
      }
      //收款凭证 41
      case BillTypeEnum.CashReceiptBill: {
        //-----------------------------
        //本次收款合计
        pd.SumAmount = util.sum(pd.Items, 'ReceivableAmountOnce').ReceivableAmountOnce ?? 0;
        //本次优惠合计
        pd.PreferentialAmount = util.sum(pd.Items, 'DiscountAmountOnce').DiscountAmountOnce ?? 0;
        //页头
        printerJobs
          .setLineSpacing(30)
          .setAlign('CT')
          .setSize(2, 2)
          .println('收款凭证')
          .print()
          .setLineSpacing(50)
          .setAlign('CT')
          .setSize(1, 1)
          .println(app.global.userInfo.StoreName)
          .print()
          .setAlign('LT')
          .setLineSpacing(70)

        //页头
        printerJobs.print(printerUtil.inline('单据编号:', pd.BillNumber))
          .print(printerUtil.inline('客户名称:', pd.TerminalName))
          .print(printerUtil.inline('客户电话:', pd.BossCall))
          .print(printerUtil.inline('客户地址:', pd.Address))
          .print(printerUtil.inline('交易时间:', pd.CreatedOnUtc))
          .print(printerUtil.inline('打印时间:', `${util.time()}`))
          .print(printerUtil.fillLine())
          .setAlign('LT')
          .setLineSpacing(70)
          .print(printerUtil.inline3(`单据号`, `本次优惠`, `本次收款`, 0))
          .print(printerUtil.fillLine())
          .setLineSpacing(70)

        //明细
        pd.Items.forEach(p => {
          printerJobs.print(printerUtil.inline3(p.BillNumber, p.DiscountAmountOnce, p.ReceivableAmountOnce, 4))
        });

        //页尾
        printerJobs.print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('合计:', pd.SumAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.SumAmount)))

          .print(printerUtil.inline('优惠:', pd.PreferentialAmount))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.PreferentialAmount)))

          .print(printerUtil.inline('欠款:', pd.OweCash))
          .print(printerUtil.inline('大写:', util.digitUppercase(pd.OweCash)))

          .print(printerUtil.fillLine())
          .setLineSpacing(70)
          .print(printerUtil.inline('业务员:', pd.BusinessUserName))
          .print(printerUtil.inline('签 名 栏:', ``))
          .print()
          .print()
          .print()
        //-----------------------------
        break;
      }
    }

    let buffer = printerJobs.buffer();
    //console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + util.ab2hex(buffer));
    // 1.并行调用多次会存在写失败的可能性
    // 2.建议每次写入不超过20字节
    // 分包处理，延时调用
    const maxChunk = 20;
    const delay = 20;
    for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
      let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
      setTimeout(this.writeBLECharacteristicValue, j * delay, subPackage, inactive);
      //触发回调
      //console.log('i == length', '' + i + '==' + length)
      //执行回调
      if ((i + 20) == length) {
        //console.log('InvokeEvent-> onCompleted')
        this.InvokeEvent('Completed', true)
        resolve('Completed')
      }
    }
  })

};

//打印收据
printer.prototype.printReceipt = function (paperType, pdata, name, inactive) {
  let printerJobs = new PrinterJobs();
  //console.log(pdata);

  //页头
  printerJobs
    .setLineSpacing(30)
    .setAlign('CT')
    .setSize(2, 2)
    .println(name)
    .print()
    .setLineSpacing(50)
    .setAlign('CT')
    .setSize(1, 1)
    .println(app.global.userInfo.StoreName)
    .print()
    .setAlign('LT')
    .setLineSpacing(70)
    .print(printerUtil.inline('打印时间:', `${util.time()}`))
    .print(printerUtil.fillLine())
    .setAlign('LT')
    .setLineSpacing(70)
    .print(printerUtil.inline(`客户名称`, `收款金额`))
    .print(printerUtil.fillLine())
    .setLineSpacing(70)

  //明细


  //页尾
  printerJobs.print(printerUtil.fillLine())
    .setLineSpacing(70)
    .print(printerUtil.inline('总额:', `0.00`))
    .print(printerUtil.inline('现金:', `0.00`))
    .print(printerUtil.fillLine())
    .setLineSpacing(70)
    .print(printerUtil.inline('业务员:', `小小陈(13002929017)`))
    .print()
    .print()
    .print()


  let buffer = printerJobs.buffer();
  //console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + util.ab2hex(buffer));
  // 1.并行调用多次会存在写失败的可能性
  // 2.建议每次写入不超过20字节
  // 分包处理，延时调用
  const maxChunk = 20;
  const delay = 20;
  for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
    let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
    setTimeout(this.writeBLECharacteristicValue, j * delay, subPackage, inactive);
  }
};


//写入字符集
printer.prototype.writeBLECharacteristicValue = function (buffer, inactive) {
  let {
    deviceId,
    serviceId,
    characteristicId
  } = inactive

  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: characteristicId,
    value: buffer,
    success(res) {
      ////console.log('writeBLECharacteristicValue success', res)
    },
    fail(res) {
      ////console.log('writeBLECharacteristicValue fail', res)
    }
  })
};

//添加事件侦听
printer.prototype.addEventListener = function (type, listener, capture) {
  if (typeof type !== "string" || typeof listener !== "function") return;
  var list = this._events[type];
  if (typeof list === "undefined") list = (this._events[type] = []);
  if (!!capture) list.push(listener);
  else list.insert(0, listener);
  return this;
};

//移除事件侦听
printer.prototype.removeEventListener = function (type, listener, capture) {

  if (typeof type !== "string" || typeof listener !== "function") return this;

  var list = this._events[type];

  if (typeof list === "undefined") return this;

  for (var i = 0, len = list.length; i < len; i++) {
    if (list[i] == listener) {
      list.remove(i);
      break;
    }
  }
  return this;
};

//触发事件
printer.prototype.InvokeEvent = function (type, e) {
  this["on" + type.toLowerCase()] && this["on" + type.toLowerCase()].call(this, e);
  var list = this._events[type];
  if (!list || list.length <= 0) return this;
  for (var i = 0, len = list.length; i < len; i++) {
    //console.log('list[i]', list[i])
    if (list[i].call(this, e) === false) break;
  }
  return this;
};

//插入项
Array.prototype.insert = function (index, value) {
  if (index > this.length) index = this.length;
  if (index < -this.length) index = 0;
  if (index < 0) index = this.length + index;
  for (var i = this.length; i > index; i--) {
    this[i] = this[i - 1];
  }
  this[index] = value;
  return this;
};

//移除项
Array.prototype.remove = function (index) {
  if (isNaN(index) || index > this.length) return;
  this.splice(index, 1);
};


module.exports = printer;