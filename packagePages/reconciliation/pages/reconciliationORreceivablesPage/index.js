const app = getApp()
const util = require('../../../../utils/util')
const financeReceiveAccountService = require('../../../../services/financeReceiveAccount.service')
const accountingService = require('../../../../services/accounting.service')
const userService = require('../../../../services/user.service')
import BillTypeEnum from '../../../../models/typeEnum'

Page({
    data: {
        lock: false,
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        disabledSubmit: true,
        //业务员
        businessUsers: app.global.subUsers,
        //过滤条件
        filter: {
            BusinessUserId: app.global.userInfo.Id,
            BusinessUserName: app.global.userInfo.UserRealName,
            Start: util.now(-365),
            End: util.now(0),
            Payeer: 0,
            AccountingOptionId: 0,
            BillNumber: ''
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
            defaultDate: [util.now(-7), util.now(0)],
            minSelect: '',
            maxSelect: '',
            type: 'range',
            title: '选择日期范围'
        },
        dialogConf: {},
        menusConf: {},
        sale: {
            BType: BillTypeEnum.SaleBill,
            BillType: BillTypeEnum.SaleBill,
            BillTypeName: "销售收款",

            TotalSaleAmountSum: 0,
            TotalSaleAmount: 0,
            TotalSaleAdvanceReceiptAmount: 0,
            TotalSaleOweCashAmount: 0,
            SaleBillCount: 0,
            SaleBills: []
        },
        returnb: {
            BType: BillTypeEnum.ReturnBill,
            BillType: BillTypeEnum.ReturnBill,
            BillTypeName: "退货款",

            TotalReturnAmountSum: 0,
            TotalReturnAmount: 0,
            TotalReturnAdvanceReceiptAmount: 0,
            TotalReturnOweCashAmount: 0,
            ReturnBillCount: 0,
            ReturnBills: []
        },
        cashReceipt: {
            BType: BillTypeEnum.CashReceiptBill,
            BillType: BillTypeEnum.CashReceiptBill,
            BillTypeName: "收欠款",

            TotalReceiptCashOweCashAmountSum: 0,
            TotalReceiptCashReceivableAmount: 0,
            TotalReceiptCashAdvanceReceiptAmount: 0,
            ReceiptCashOweCashBillCount: 0,
            ReceiptCashOweCashBills: []
        },
        advanceReceipt: {
            BType: BillTypeEnum.AdvanceReceiptBill,
            BillType: BillTypeEnum.AdvanceReceiptBill,
            BillTypeName: "收预收款",

            TotalAdvanceReceiptSum: 0,
            TotalAdvanceReceiptAmount: 0,
            TotalAdvanceReceiptOweCashAmount: 0,
            AdvanceReceiptBillCount: 0,
            AdvanceReceiptBills: []
        },
        costExpenditure: {
            BType: BillTypeEnum.CostExpenditureBill,
            BillType: BillTypeEnum.CostExpenditureBill,
            BillTypeName: "费用支出",

            TotalCostExpenditureSum: 0,
            TotalCostExpenditureAmount: 0,
            TotalCostExpenditureOweCashAmount: 0,
            CostExpenditureBillCount: 0,
            CostExpenditureBills: []
        },
        //总待交金额
        totalCollectionAmount: 0,
        //总待交单据
        totalBillCount: 0,
        //默认价格方案
        defalutPlanPrice: {},
        //账户
        accountings: [],
        //商品汇总
        summeryCounts: [{
            type: 0,
            name: '销售商品',
            count: 0
        }, {
            type: 1,
            name: '赠送商品',
            count: 0
        }, {
            type: 2,
            name: '退货商品',
            count: 0
        }],
        saleProducts: [],
        giftProducts: [],
        returnProducts: []
    },

    disabled: function (disabled) {
        this.setData({
            'disabledSubmit': disabled
        })
    },
    //单据明细
    onRedict(e) {
        let item = e.currentTarget.dataset.item
        let type = e.currentTarget.dataset.type
        //console.log('item', item)
        wx.navigateTo({
            url: '/packagePages/reconciliation/pages/reconciliationDetailPage/index?title=' + e.currentTarget.dataset.key + '&type=' + type + '&filter=' + JSON.stringify(this.data.filter)
        });
        wx.setStorage({
            key: 'reconciliation_bills',
            data: item
        })
    },
    //商品汇总明细
    clickListItem(e) {
        let item = e.currentTarget.dataset.key
        wx.navigateTo({
            url: '/packagePages/reconciliation/pages/reconciliationProductsPage/index?title=' + item.name + '&type=' + item.type + '&filter=' + JSON.stringify(this.data.filter)
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "收款对账"
        })

        //获取默认收款方式
        await accountingService
            .getDefaultAccountingAsync(BillTypeEnum.FinanceReceiveAccount)
            .then((accounts) => {
                //console.log('accounts:', accounts)
                let payments = accounts.Item3.map(s => {
                    return {
                        AccountingOptionId: s.Id,
                        CollectionAmount: 0,
                        Name: s.Name
                    };
                });
                this.setData({
                    accountings: payments
                })
            });

        //获取汇总
        await financeReceiveAccountService
            .getFinanceReceiveAccounts(
                this.data.filter.Start,
                this.data.filter.End,
                this.data.filter.BusinessUserId,
                this.data.filter.Payeer,
                this.data.filter.AccountingOptionId,
                this.data.filter.BillNumber,
                0,
                50)
            .then((summeries) => {

                ////console.log('summeries:', summeries)

                var sales = summeries.filter(s => {
                    return s.BillType === BillTypeEnum.SaleBill
                });

                var returns = summeries.filter(s => {
                    return s.BillType === BillTypeEnum.ReturnBill
                });

                var cashReceipts = summeries.filter(s => {
                    return s.BillType === BillTypeEnum.CashReceiptBill
                });

                var advanceReceipts = summeries.filter(s => {
                    return s.BillType === BillTypeEnum.AdvanceReceiptBill
                });

                var costExpenditures = summeries.filter(s => {
                    return s.BillType === BillTypeEnum.CostExpenditureBill
                });

                // //console.log('sales:', sales)
                // //console.log('returns:', returns)
                // //console.log('cashReceipts:', cashReceipts)
                // //console.log('advanceReceipts:', advanceReceipts)
                // //console.log('costExpenditures:', costExpenditures)

                /* 销售收款 */
                var sale = {
                    BType: BillTypeEnum.SaleBill,
                    BillType: BillTypeEnum.SaleBill,
                    BillTypeName: "销售收款",

                    TotalSaleAmountSum: util.sum(sales, 'SaleAmountSum').SaleAmountSum ?? 0,
                    TotalSaleAmount: util.sum(sales, 'SaleAmount').SaleAmount ?? 0,
                    TotalSaleAdvanceReceiptAmount: util.sum(sales, 'SaleAdvanceReceiptAmount').SaleAdvanceReceiptAmount ?? 0,
                    TotalSaleOweCashAmount: util.sum(sales, 'SaleOweCashAmount').SaleOweCashAmount ?? 0,
                    SaleBillCount: sales.length,
                    SaleBills: sales
                };

                /* 退货款 */
                var returnb = {
                    BType: BillTypeEnum.ReturnBill,
                    BillType: BillTypeEnum.ReturnBill,
                    BillTypeName: "退货款",

                    TotalReturnAmountSum: util.sum(returns, 'ReturnAmountSum').ReturnAmountSum ?? 0,
                    TotalReturnAmount: util.sum(returns, 'ReturnAmount').ReturnAmount ?? 0,
                    TotalReturnAdvanceReceiptAmount: util.sum(returns, 'ReturnAdvanceReceiptAmount').ReturnAdvanceReceiptAmount ?? 0,
                    TotalReturnOweCashAmount: util.sum(returns, 'ReturnOweCashAmount').ReturnOweCashAmount ?? 0,
                    ReturnBillCount: returns.length ?? 0,
                    ReturnBills: returns
                };

                /* 收欠款 */
                var cashReceipt = {
                    BType: BillTypeEnum.CashReceiptBill,
                    BillType: BillTypeEnum.CashReceiptBill,
                    BillTypeName: "收欠款",

                    TotalReceiptCashOweCashAmountSum: util.sum(cashReceipts, 'ReceiptCashOweCashAmountSum').ReceiptCashOweCashAmountSum ?? 0,
                    TotalReceiptCashReceivableAmount: util.sum(cashReceipts, 'ReceiptCashReceivableAmount').ReceiptCashReceivableAmount ?? 0,
                    TotalReceiptCashAdvanceReceiptAmount: util.sum(cashReceipts, 'ReceiptCashAdvanceReceiptAmount').ReceiptCashAdvanceReceiptAmount ?? 0,
                    ReceiptCashOweCashBillCount: cashReceipts.length ?? 0,
                    ReceiptCashOweCashBills: cashReceipts
                };

                /* 收预收款 */
                var advanceReceipt = {
                    BType: BillTypeEnum.AdvanceReceiptBill,
                    BillType: BillTypeEnum.AdvanceReceiptBill,
                    BillTypeName: "收预收款",

                    TotalAdvanceReceiptSum: util.sum(advanceReceipts, 'AdvanceReceiptSum').AdvanceReceiptSum ?? 0,
                    TotalAdvanceReceiptAmount: util.sum(advanceReceipts, 'AdvanceReceiptAmount').AdvanceReceiptAmount ?? 0,
                    TotalAdvanceReceiptOweCashAmount: util.sum(advanceReceipts, 'AdvanceReceiptOweCashAmount').AdvanceReceiptOweCashAmount ?? 0,
                    AdvanceReceiptBillCount: advanceReceipts.length ?? 0,
                    AdvanceReceiptBills: advanceReceipts
                };

                /* 费用支出 */
                var costExpenditure = {
                    BType: BillTypeEnum.CostExpenditureBill,
                    BillType: BillTypeEnum.CostExpenditureBill,
                    BillTypeName: "费用支出",

                    TotalCostExpenditureSum: util.sum(costExpenditures, 'CostExpenditureSum').CostExpenditureSum ?? 0,
                    TotalCostExpenditureAmount: util.sum(costExpenditures, 'CostExpenditureAmount').CostExpenditureAmount ?? 0,
                    TotalCostExpenditureOweCashAmount: util.sum(costExpenditures, 'CostExpenditureOweCashAmount').CostExpenditureOweCashAmount ?? 0,
                    CostExpenditureBillCount: costExpenditures.length ?? 0,
                    CostExpenditureBills: costExpenditures
                };


                // //console.log('sale:', sale)
                // //console.log('returnb:', returnb)
                // //console.log('cashReceipt:', cashReceipt)
                // //console.log('advanceReceipt:', advanceReceipt)
                // //console.log('costExpenditure:', costExpenditure)

                let countsum = (sales.length ?? 0 + returns.length ?? 0 + cashReceipts.length ?? 0 + advanceReceipts.length ?? 0 + costExpenditures.length ?? 0)

                this.setData({
                    totalBillCount: countsum,
                    sale: sale,
                    returnb: returnb,
                    cashReceipt: cashReceipt,
                    advanceReceipt: advanceReceipt,
                    costExpenditure: costExpenditure
                })

                if (countsum > 0) {
                    this.disabled(false)
                }

                /* 合计收款金额 */
                let allAccounts = []
                summeries.forEach(s => {
                    //console.log("Accounts:", s.Accounts)
                    s.Accounts.forEach(sa => {
                        allAccounts.push(sa)
                    })
                })
                ////console.log("allAccounts:", allAccounts)

                let accs = this.data.accountings;
                accs.forEach(pay => {
                    var alls = allAccounts.filter(s => {
                        return s.AccountingOptionId === pay.AccountingOptionId
                    });
                    var totalAmount = util.sum(alls, 'CollectionAmount').CollectionAmount ?? 0;
                    //
                    pay.CollectionAmount = totalAmount;
                });

                this.setData({
                    totalCollectionAmount: util.sum(accs, 'CollectionAmount').CollectionAmount ?? 0,
                    accountings: accs
                })


                /* 合计商品 */
                let spc = []
                let gpc = []
                let rpc = []
                summeries.forEach(s => {

                    //销售商品
                    //console.log("SaleProducts:", s.SaleProducts)
                    s.SaleProducts.forEach(p => {
                        let ps = spc.map(s => {
                            return {
                                ProductId: s.ProductId
                            };
                        });
                        if (!ps.includes(p.ProductId)) {
                            spc.push(p)
                        }
                    })

                    //赠送商品
                    //console.log("GiftProducts:", s.GiftProducts)
                    s.GiftProducts.forEach(p => {
                        let ps = gpc.map(s => {
                            return {
                                ProductId: s.ProductId
                            };
                        });
                        if (!ps.includes(p.ProductId)) {
                            gpc.push(p)
                        }
                    })

                    //退货商品
                    //console.log("ReturnProducts:", s.ReturnProducts)
                    s.ReturnProducts.forEach(p => {
                        let ps = rpc.map(s => {
                            return {
                                ProductId: s.ProductId
                            };
                        });
                        if (!ps.includes(p.ProductId)) {
                            rpc.push(p)
                        }
                    })
                })

                let summeryCounts = [];
                summeryCounts.push({
                    type: 0,
                    name: '销售商品',
                    count: spc.length
                });
                summeryCounts.push({
                    type: 1,
                    name: '赠送商品',
                    count: gpc.length
                });
                summeryCounts.push({
                    type: 2,
                    name: '退货商品',
                    count: rpc.length
                });

                this.setData({
                    summeryCounts: summeryCounts,
                    saleProducts: spc,
                    giftProducts: gpc,
                    returnProducts: rpc
                })
                wx.setStorageSync('saleProducts', spc)
                wx.setStorageSync('giftProducts', gpc)
                wx.setStorageSync('returnProducts', rpc)
            });
    },
    onReady: function () {},
    onShow: function () {
        //this.onLoad();
        this.setData({
            businessUsers: app.global.subUsers,
            'filter.BusinessUserId': app.global.userInfo.Id,
            'filter.BusinessUserName': app.global.userInfo.UserRealName,
        })
    },
    onHide: function () {},
    onUnload: function () {

    },
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
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
                    name: '30天未交',
                    id: 0,
                    icon: 'label'
                }, {
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

        switch (m.id) {
            //30天未交
            case 0: {
                this.setData({
                    'filter.Start': util.now(-30),
                    'filter.End': util.now(0),
                });
                break;
            }
            //今日
            case 1: {
                this.setData({
                    'filter.Start': util.now(0),
                    'filter.End': util.now(0),
                });
                break;
            }
            //昨日
            case 2: {
                this.setData({
                    'filter.Start': util.now(-1),
                    'filter.End': util.now(0),
                });
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
            //上交历史
            case 4: {
                wx.navigateTo({
                    url: '/packagePages/reconciliation/pages/reconciliationHistoryPage/index?filter=' + JSON.stringify(this.data.filter)
                });
                return;
            }
        }
        //刷新
        this.onLoad();
    },

    //选择日期范围
    selectCalender(e) {
        ////console.log('e.detail:', e.detail)
        if (e.detail[0] == null || e.detail[1] == null) {
            return;
        }
        // //console.log('Start:', util.getDate(e.detail[0]))
        // //console.log('End:', util.getDate(e.detail[1]))
        this.setData({
            'filter.Start': util.now(-1),
            'filter.End': util.now(0),
        });
        //刷新
        this.onLoad();
    },

    // 确认
    onConfirmTap() {},

    // 取消确认
    onCancelTap() {},

    //全部上缴
    async onSubmit() {

        let that = this;
        let {
            lock
        } = that.data;

        if (!lock) {
            this.release(true)

            let bills = [];

            if (this.data.sale.SaleBills.length > 0)
                this.data.sale.SaleBills.forEach(s => {
                    bills.push(s)
                })

            if (this.data.returnb.ReturnBills.length > 0)
                this.data.returnb.ReturnBills.forEach(s => {
                    bills.push(s)
                })

            if (this.data.cashReceipt.ReceiptCashOweCashBills.length > 0)
                this.data.cashReceipt.ReceiptCashOweCashBills.forEach(s => {
                    bills.push(s)
                })

            if (this.data.advanceReceipt.AdvanceReceiptBills.length > 0)
                this.data.advanceReceipt.AdvanceReceiptBills.forEach(s => {
                    bills.push(s)
                })

            if (this.data.costExpenditure.CostExpenditureBills.length > 0)
                this.data.costExpenditure.CostExpenditureBills.forEach(s => {
                    bills.push(s)
                })

            if (bills.length <= 0) {
                wx.showToast({
                    title: '无可提交单据',
                    icon: 'none'
                });
                return false;
            }

            //console.log('bills', bills)

            let postData = {
                Items: bills
            }

            wx.lin.showDialog({
                type: 'confirm',
                title: '',
                content: '确定要全部提交吗？',
                confirmText: '是',
                confirmColor: '#3683d6',
                cancelText: '否',
                cancelColor: '#999',
                success: async (res) => {
                    if (res.confirm) {
                        await financeReceiveAccountService
                            .submitAccountStatementAsync(postData)
                            .then((res) => {

                                //console.log('submitAccountStatementAsync', res)

                                if (res.code >= 0 && res.success) {
                                    wx.showToast({
                                        title: '单据上交成功！',
                                        icon: 'success'
                                    });
                                    //刷新
                                    this.onLoad();
                                } else {
                                    wx.showToast({
                                        title: res.message,
                                        icon: 'error'
                                    });
                                }

                                this.release(false)
                            });

                    } else if (res.cancel) {
                        this.release(false)
                    }
                }
            });
        }
    },
    release: function (lock) {
        this.setData({
            lock: lock
        });
    },
    //选择业务员
    onSelectUser() {
        util.showActionSheet({
            itemList: this.data.businessUsers,
            showCancel: true
        }, (item) => {
            this.setData({
                'filter.BusinessUserName': item.name,
                'filter.BusinessUserId': item.id,
            });
            //刷新
            this.onLoad();
        }, () => {
            this.setData({
                'filter.BusinessUserName': '',
                'filter.BusinessUserId': 0,
            });
        });
    },
    togggleActionSheet() {
        this.setData({
            show: true
        });
    },
    lincancel() {
        //console.log('lincancel')
    },
    lintapItem(e) {
        wx.showToast({
            title: e.detail.item.name,
            icon: 'none'
        });
    }
})