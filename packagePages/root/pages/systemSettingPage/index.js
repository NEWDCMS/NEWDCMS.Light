const util = require('../../../../utils/util')
const app = getApp();
const wareHousesService = require('../../../../services/wareHouses.Service')
import BillTypeEnum from '../../../../models/typeEnum'

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
        warehouses: [],
        printConfigs: [{
            id: 12,
            value: 1,
            name: '销售单'
        }, {
            id: 11,
            value: 1,
            name: '销售订单'
        }, {
            id: 14,
            value: 1,
            name: '退货单'
        }, {
            id: 13,
            value: 1,
            name: '退货订单'
        }, {
            id: 31,
            value: 1,
            name: '调拨单'
        }, {
            id: 41,
            value: 1,
            name: '收款单'
        }],

        //开单默认仓库/打印配置
        saleBill: app.global.saleBill,
        saleReservationBill: app.global.saleReservationBill,
        returnBill: app.global.returnBill,
        returnReservationBill: app.global.returnReservationBill,
        allocationBill: app.global.allocationBill,
        cashReceiptBill: app.global.cashReceiptBill
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "开单设置"
        })
        this.init()
    },
    onUnload: function () {

    },

    //计数器
    onTapChange: function (e) {
        let count = e.detail.count
        ////console.log('count', count)
        let item = e.currentTarget.dataset.item;
        ////console.log('onTapChange', item)

        switch (parseInt(item.id)) {
            case BillTypeEnum.SaleBill: {
                let b = app.global.saleBill
                b.PrintNum = count
                ////console.log('saleBill:', b)
                app.global.saleBill = b
                break;
            }
            case BillTypeEnum.SaleReservationBill: {
                let b = app.global.saleReservationBill
                b.PrintNum = count
                ////console.log('saleReservationBill:', b)
                app.global.saleReservationBill = b
                break;
            }
            case BillTypeEnum.ReturnBill: {
                let b = app.global.returnBill
                b.PrintNum = count
                ////console.log('returnBill:', b)
                app.global.returnBill = b
                break;
            }
            case BillTypeEnum.ReturnReservationBill: {
                let b = app.global.returnReservationBill
                b.PrintNum = count
                ////console.log('returnReservationBill:', b)
                app.global.returnReservationBill = b
                break;
            }
            case BillTypeEnum.AllocationBill: {
                let b = app.global.allocationBill
                b.PrintNum = count
                ////console.log('allocationBill:', b)
                app.global.allocationBill = b
                break;
            }
            case BillTypeEnum.CashReceiptBill: {
                let b = app.global.cashReceiptBill
                b.PrintNum = count
                ////console.log('cashReceiptBill:', b)
                app.global.cashReceiptBill = b
                break;
            }
        }

        let pcs = this.data.printConfigs
        pcs.forEach(s => {
            if (s.id == parseInt(item.id)) {
                s.value = count
                return;
            }
        });
        this.setData({
            printConfigs: pcs
        })
    },
    //初始数据
    init: function () {

        this.setData({
            saleBill: app.global.saleBill
        });
        this.setData({
            saleReservationBill: app.global.saleReservationBill
        });
        this.setData({
            returnBill: app.global.returnBill
        });
        this.setData({
            returnReservationBill: app.global.returnReservationBill
        });
        this.setData({
            allocationBill: app.global.allocationBill
        });
        this.setData({
            cashReceiptBill: app.global.cashReceiptBill
        });

        let pcs = this.data.printConfigs
        pcs.forEach(s => {
            switch (parseInt(s.id)) {
                case BillTypeEnum.SaleBill: {
                    let b = app.global.saleBill
                    s.value = b.PrintNum
                    break;
                }
                case BillTypeEnum.SaleReservationBill: {
                    let b = app.global.saleReservationBill
                    s.value = b.PrintNum
                    break;
                }
                case BillTypeEnum.ReturnBill: {
                    let b = app.global.returnBill
                    s.value = b.PrintNum
                    break;
                }
                case BillTypeEnum.ReturnReservationBill: {
                    let b = app.global.returnReservationBill
                    s.value = b.PrintNum
                    break;
                }
                case BillTypeEnum.AllocationBill: {
                    let b = app.global.allocationBill
                    s.value = b.PrintNum
                    break;
                }
                case BillTypeEnum.CashReceiptBill: {
                    let b = app.global.cashReceiptBill
                    s.value = b.PrintNum
                    break;
                }
            }
        });
        this.setData({
            printConfigs: pcs
        })
    },

    //选择仓库
    async getSelectStock(e) {
        let billType = e.currentTarget.dataset.type;
        //加载仓库信息
        await wareHousesService
            .getWareHousesAsync(billType)
            .then(res => {
                ////console.log('ware', res)
                let tempWare = [{
                    id: 0,
                    name: '请选择仓库'
                }]
                if (res.success == true) {
                    let rapeList = res.data.map(t => {
                        return {
                            id: t.Id,
                            name: t.Name
                        };
                    });
                    var warehouses = tempWare.concat(rapeList)
                    util.showActionSheet({
                        itemList: warehouses,
                        showCancel: true
                    }, (item) => {

                        ////console.log('item:', item)

                        let b = {
                            WareHouseId: item.id,
                            WarehouseName: item.name
                        }
                        ////console.log('b:', b)
                        ////console.log('billType:', billType)

                        switch (parseInt(billType)) {
                            case BillTypeEnum.SaleBill:
                                app.global.saleBill = b
                                //console.log('saleBill:', app.global.saleBill)
                                break;
                            case BillTypeEnum.SaleReservationBill:
                                app.global.saleReservationBill = b
                                //console.log('saleReservationBill:', app.global.saleReservationBill)
                                break;
                            case BillTypeEnum.ReturnBill:
                                app.global.returnBill = b
                                //console.log('returnBill:', app.global.returnBill)
                                break;
                            case BillTypeEnum.ReturnReservationBill:
                                app.global.returnReservationBill = b
                                //console.log('returnReservationBill:', app.global.returnReservationBill)
                                break;
                        }

                        this.init()
                    });
                }
            })
    },
    togggleActionSheet() {
        this.setData({
            show: true
        });
    },
    lincancel() {
        wx.showToast({
            title: '取消',
            icon: 'none'
        });
    },
    lintapItem(e) {
        wx.showToast({
            title: e.detail.item.name,
            icon: 'none'
        });
    },
})