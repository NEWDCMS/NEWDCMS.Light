const app = getApp()
const util = require('../../../../utils/util')

const saleReservationService = require('../../../../services/saleReservationBill.service')
const saleService = require('../../../../services/saleBill.service')
const returnReservationService = require('../../../../services/returnReservationBill.service')
const returnService = require('../../../../services/returnBill.service')
const allocationService = require('../../../../services/allocation.service')
const cashReceiptService = require('../../../../services/receiptCashBill.service')
const costContractService = require('../../../../services/costContractBill.service')
const costExpenditureService = require('../../../../services/costExpenditureBill.service')
const advanceReceiptService = require('../../../../services/advanceReceiptBill.service')

//import integer from '../../../../dist/common/async-validator/validator/integer'
import BillTypeEnum from '../../../../models/typeEnum'
import PageTypeEnum from '../../../../models/pageTypeEnum'

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            terminalId: 0
        },
        //过滤条件
        filter: {
            Start: util.now(-31) + " 00:00:00",
            End: util.now(0) + " 23:59:59",
            pageIndex: 0,
            pageSize: 50,
            BusinessUserId: 0,
            BusinessUserName: '员工',
            TerminalId: 0,
            TerminalName: '',
            ShowDistrict: false,
            ShowTime: false,
            ShowBusinessUser: true
        },
        calenderShow: false,
        defaultDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
        ).getTime(),
        minSelect: '',
        maxSelect: '',
        type: 'single',
        color: '',
        maxDate: '',
        minDate: '',
        title: '',
        confirmText: '',
        formatter: '',
        base_range: {
            defaultDate: [util.now(-31), util.now(0)],
            minSelect: '',
            maxSelect: '',
            type: 'range',
            title: '选择日期范围'
        },
        billTypes: [{
            billType: BillTypeEnum.SaleReservationBill,
            name: '销售订单',
            count: 0
        }, {
            billType: BillTypeEnum.SaleBill,
            name: '销售单',
            count: 0
        }, {
            billType: BillTypeEnum.ReturnReservationBill,
            name: '退货订单',
            count: 0
        }, {
            billType: BillTypeEnum.ReturnBill,
            name: '退货单',
            count: 0
        }, {
            billType: BillTypeEnum.AllocationBill,
            name: '调拨单',
            count: 0
        }, {
            billType: BillTypeEnum.CashReceiptBill,
            name: '收款单',
            count: 0
        }, {
            billType: BillTypeEnum.CostContractBill,
            name: '费用合同',
            count: 0
        }, {
            billType: BillTypeEnum.CostExpenditureBill,
            name: '费用支出',
            count: 0
        }, {
            billType: BillTypeEnum.AdvanceReceiptBill,
            name: '预收款单',
            count: 0
        }],
        data: {
            bills: []
        },
        currentBillType: {},
        totalCollectionAmount: 0,
        businessUsers: []
    },

    //单据明细
    onRedict(e) {
        //console.log('onRedict', e)
        if (this.data.currentBillType == BillTypeEnum.SaleBill) {
            wx.navigateTo({
                url: `/packagePages/bills/pages/saleBillPage/index?billType=${BillTypeEnum.SaleBill}&pageType=${PageTypeEnum.edit}&billId=${e.currentTarget.dataset.billid}`
            });
        } else if (this.data.currentBillType == BillTypeEnum.AllocationBill) {
            wx.navigateTo({
                url: `/packagePages/bills/pages/allocationBillPage/index?billType=${BillTypeEnum.AllocationBill}&pageType=${PageTypeEnum.edit}&billId=${e.currentTarget.dataset.billid}`
            });
        } else if (this.data.currentBillType == BillTypeEnum.ReturnBill) {
            wx.navigateTo({
                url: `/packagePages/bills/pages/returnBillPage/index?billType=${BillTypeEnum.ReturnBill}&pageType=${PageTypeEnum.edit}&billId=${e.currentTarget.dataset.billid}`
            });
        } else if (this.data.currentBillType == BillTypeEnum.SaleReservationBill) {
            wx.navigateTo({
                url: `/packagePages/bills/pages/saleOrderBillPage/index?billType=${BillTypeEnum.SaleReservationBill}&pageType=${PageTypeEnum.edit}&billId=${e.currentTarget.dataset.billid}`
            });
        }
    },

    //切换Tab
    linchange: async function (e) {
        //console.log('e.detail.activeKey', e.detail.activeKey)
        //参数
        this.setData({
            'data.bills': [],
            'filter.pageIndex': 0,
            totalCollectionAmount: 0,
            currentBillType: e.detail.activeKey
        }, res => {
            this.loadData()
        })


    },
    async loadData() {
        //筛选条件
        let filter = this.data.filter
        switch (parseInt(this.data.currentBillType)) {

            //销售订单
            case BillTypeEnum.SaleReservationBill: {
                let params = {
                    makeuserId: app.global.userInfo.Id,
                    terminalId: this.data.filter.TerminalId,
                    terminalName: '',
                    businessUserId: this.data.filter.BusinessUserId,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pagenumber: 0,
                    pageSize: 30
                }

                await saleReservationService
                    .GetBillsAsync(params)
                    .then((res) => {
                        //console.log('GetBillsAsync', res)
                        if (res.code > 0) {
                            //这里赋值当当前单据列表
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });

                break;
            }
            //销售单
            case BillTypeEnum.SaleBill: {
                let params = {
                    makeuserId: app.global.userInfo.Id,
                    terminalId: this.data.filter.TerminalId,
                    terminalName: '',
                    businessUserId: this.data.filter.BusinessUserId,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pageIndex: filter.pageIndex,
                    pageSize: filter.pageSize
                }

                await saleService
                    .GetBillsAsync(params)
                    .then((res) => {
                        //console.log('res', res)
                        if (res.code > 0 && res.success == true) {
                            let bills = res.data;
                            let totalCollectionAmount = 0
                            if (!util.isEmpty(bills)) {
                                bills.forEach(b => {
                                    totalCollectionAmount += b.SumAmount
                                })
                            }
                            this.setData({
                                'data.bills': bills,
                                totalCollectionAmount: totalCollectionAmount
                            })
                        } else {
                            wx.showToast({
                                title: '获取数据失败' + res.message,
                                icon: 'none'
                            })
                        }
                    });

                break;
            }
            //退货订单
            case BillTypeEnum.ReturnReservationBill: {
                let params = {
                    makeuserId: app.global.userInfo.Id,
                    terminalId: this.data.filter.TerminalId,
                    terminalName: '',
                    businessUserId: this.data.filter.BusinessUserId,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pagenumber: filter.pageIndex,
                    pageSize: filter.pageSize
                }

                await returnReservationService
                    .GetBillsAsync(params)
                    .then((res) => {
                        if (res.Code > 0) {
                            //这里赋值当当前单据列表
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });


                break;
            }
            //退货单
            case BillTypeEnum.ReturnBill: {
                let params = {
                    makeuserId: app.global.userInfo.Id,
                    terminalId: this.data.filter.TerminalId,
                    terminalName: '',
                    businessUserId: this.data.filter.BusinessUserId,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pageIndex: filter.pageIndex,
                    pageSize: filter.pageSize,
                    businessId: 0,
                    paymentMethodType: '',
                    billSourceType: ''
                }

                await returnService
                    .GetBillsAsync(params)
                    .then((res) => {
                        if (res.code > 0 && res.success == true) {
                            let bills = res.data;
                            let totalCollectionAmount = 0
                            if (!util.isEmpty(bills)) {
                                bills.forEach(b => {
                                    totalCollectionAmount += b.SumAmount
                                })
                            }
                            this.setData({
                                'data.bills': bills,
                                totalCollectionAmount: totalCollectionAmount
                            })
                        } else {
                            wx.showToast({
                                title: '获取数据失败' + res.message,
                                icon: 'none'
                            })
                        }
                    });


                break;
            }
            //调拨单
            case BillTypeEnum.AllocationBill: {
                let params = {
                    billNumber: '',
                    remark: '',
                    auditedStatus: false,
                    startTime: filter.Start,
                    endTime: filter.End,
                    showReverse: '',
                    sortByAuditedTime: '',
                    businessId: this.data.filter.BusinessUserId,
                    makeuserId: app.global.userInfo.Id,
                    outWareId: 0,
                    inWareId: 0,
                    pageIndex: filter.pageIndex,
                    pageSize: filter.pageSize
                }
                await allocationService
                    .getAllocationsAsync(params)
                    .then((res) => {
                        //console.log('getAllocationsAsync', res)
                        if (res.code > 0) {
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });


                break;
            }
            //收款单
            case BillTypeEnum.CashReceiptBill: {
                let params = {
                    makeuserId: app.global.userInfo.Id,
                    terminalId: this.data.filter.TerminalId,
                    terminalName: '',
                    businessUserId: this.data.filter.BusinessUserId,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: '',
                    showReverse: '',
                    showReturn: '',
                    handleStatus: '',
                    sign: '',
                    pagenumber: filter.pageIndex,
                    pageSize: filter.pageSize
                }
                await cashReceiptService
                    .GetBillsAsync(0, 0, params)
                    .then((res) => {
                        if (!util.isEmpty(res) && res.code > 0) {
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });


                break;
            }
            //费用合同
            case BillTypeEnum.CostContractBill: {

                let params = {
                    makeuserId: 0,
                    terminalId: 0,
                    terminalName: '',
                    businessUserId: 0,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pagenumber: 0,
                    pageSize: 30
                }


                await costContractService
                    .GetBillsAsync(params)
                    .then((res) => {
                        if (res.Code > 0) {
                            //这里赋值当当前单据列表
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });


                break;
            }
            //费用支出
            case BillTypeEnum.CostExpenditureBill: {

                let params = {
                    makeuserId: 0,
                    terminalId: 0,
                    terminalName: '',
                    businessUserId: 0,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pagenumber: 0,
                    pageSize: 30
                }


                await costExpenditureService
                    .GetBillsAsync(params)
                    .then((res) => {
                        if (res.Code > 0) {
                            //这里赋值当当前单据列表
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });


                break;
            }
            //预收款单
            case BillTypeEnum.AdvanceReceiptBill: {
                let params = {
                    makeuserId: 0,
                    terminalId: 0,
                    terminalName: '',
                    businessUserId: 0,
                    districtId: 0,
                    deliveryUserId: 0,
                    wareHouseId: 0,
                    billNumber: '',
                    remark: '',
                    startTime: filter.Start,
                    endTime: filter.End,
                    auditedStatus: false,
                    sortByAuditedTime: false,
                    showReverse: false,
                    showReturn: false,
                    handleStatus: false,
                    sign: '',
                    pagenumber: 0,
                    pageSize: 30
                }
                await advanceReceiptService
                    .GetBillsAsync(params)
                    .then((res) => {
                        if (res.Code > 0) {
                            //这里赋值当当前单据列表
                            let bills = res.data;
                            this.setData({
                                'data.bills': bills
                            })
                        }
                    });
                break;
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options)
        if (!util.isNull(options)) {
            let currentKey = BillTypeEnum.SaleReservationBill
            if (!util.isEmpty(options.defaultPageKey)) {
                currentKey = options.defaultPageKey
            }
            wx.setNavigationBarTitle({
                title: options.title
            })
            let terminalId = 0
            if (!util.isEmpty(options.terminalId)) {
                terminalId = options.terminalId
            }
            this.setData({
                'parames.title': options.title,
                'filter.TerminalId': terminalId,
                currentBillType: currentKey
            }, res => {
                this.loadData()
            })

        }
    },
    onReady: function () {

    },
    onShow: function () {
        this.setData({
            businessUsers: app.global.businessUsers,
        })
        if (this.data.parames.TerminalId > 0) {
            let terminalId = this.data.parames.TerminalId
            let terminalName = this.data.parames.TerminalName
            this.setData({
                'filter.TerminalId': terminalId,
                'filter.TerminalName': terminalName,
                'parames.TerminalId': 0,
                'parames.TerminalName': ''
            }, () => {
                this.loadData()
            })
        } else {
            this.loadData()
        }
    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function (e) {
        //console.log('**********', e)
    },
    onReachBottom: function (e) {
        //console.log('**********', e)
    },
    onShareAppMessage: function () {},
    //溢出菜单
    onShowPopupMenus(e) {
        this.setData({
            menusConf: {
                show: true,
                animation: 'show',
                zIndex: 99,
                contentAlign: 'left',
                locked: false,
                menus: [{
                    name: '今日',
                    id: 1,
                    icon: 'label'
                }, {
                    name: '昨日',
                    id: 2,
                    icon: 'label'
                }, {
                    name: '其它',
                    id: 3,
                    icon: 'label'
                }, {
                    name: this.data.filter.BusinessUserName == '' ? '员工' : this.data.filter.BusinessUserName,
                    id: 4,
                    icon: 'label'
                }, {
                    name: this.data.filter.TerminalName == '' ? '终端' : this.data.filter.TerminalName,
                    id: 5,
                    icon: 'label'
                }]
            }
        });
    },

    //菜单选择
    clickMenuItem(e) {
        const m = e.currentTarget.dataset.item;
        //关闭菜单
        this.data.menusConf = false;
        this.setData({
            menusConf: {
                show: false
            }
        })
        if (m.id == 1 || m.id == 2 || m.id == 3) {
            let start = util.now(-31) + ' 00:00:00'
            let end = util.now(0) + ' 23:59:59'
            switch (m.id) {
                //今日
                case 1: {
                    start = util.now(0) + ' 00:00:00'
                    end = util.now(0) + ' 23:59:59'
                    break;
                }
                //昨日
                case 2: {
                    start = util.now(-1) + ' 00:00:00'
                    end = util.now(-1) + ' 23:59:59'
                    break;
                }
                //其它
                case 3: {
                    const {
                        defaultDate,
                        minSelect,
                        maxSelect,
                        type,
                        title,
                        color = '',
                        minDate = '',
                        maxDate = '',
                        confirmText = '确定',
                        formatter
                    } = this.data['base_range'];
                    this.setData({
                        calenderShow: true,
                        defaultDate,
                        minSelect,
                        maxSelect,
                        type,
                        title,
                        color,
                        maxDate,
                        minDate,
                        confirmText,
                        formatter
                    });
                    return;
                }
            }
            this.setData({
                'filter.Start': start,
                'filter.End': end,
            }, () => {
                this.loadData()
            });
        } else if (m.id == 4) {
            this.onSelectUser()
        } else if (m.id == 5) {
            this.onSelectTerminal()
        }
    },

    //选择日期范围
    selectCalender(e) {
        //console.log('selectCalender', e)
        if (e.detail[0] == null || e.detail[1] == null) {
            wx.showToast({
                title: '选择时间段不正确',
                icon: 'none'
            })
            return false;
        }
        //console.log('Start:', util.getDate(e.detail[0]))
        //console.log('End:', util.getDate(e.detail[1]))
        this.setData({
            'filter.Start': util.getDate(e.detail[0]) + ' 00:00:00',
            'filter.End': util.getDate(e.detail[1]) + ' 23:59:59',
        }, () => {
            this.loadData()
        });

    },
    //ActionSheet菜单
    _showActionSheet({
        itemList,
        showCancel = false,
        title = '',
        locked = false
    }, callback) {
        wx.lin.showActionSheet({
            itemList: itemList,
            showCancel: showCancel,
            title: title,
            locked,
            success: (res) => {
                callback(res.item)
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },
    //选择业务员
    onSelectUser() {
        this._showActionSheet({
            type: 'businessUsers',
            itemList: this.data.businessUsers,
            showCancel: true
        }, (item) => {
            this.setData({
                'filter.BusinessUserId': item.id,
                'filter.BusinessUserName': item.name,
            }, () => {
                this.loadData()
            });
        });
    },
    onSelectTerminal() {
        wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=select'
        });
    }
})