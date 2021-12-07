const app = getApp()
const util = require('../../../../utils/util')
const printer = require('../../../../printer/printer')
const authenticationUtil = require('../../../../utils/authentication.util')
const financeReceiveAccountService = require('../../../../services/financeReceiveAccount.service')
const accountingService = require('../../../../services/accounting.service')
import BillTypeEnum from '../../../../models/typeEnum'
import PageTypeEnum from '../../../../models/pageTypeEnum'
import MenuEnum from '../../../../models/menuEnum'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lock: false,
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        disabledSubmit: true,
        checkedAll: false,
        totalCollectionAmount: 0,
        //业务员
        businessUsers: app.global.subUsers,
        //过滤条件
        filter: {
            BusinessUserId: 0,
            BusinessUserName: '选择员工...',
            Start: util.now(-365),
            End: util.now(0),
            Payeer: 0,
            AccountingOptionId: 0,
            BillNumber: ''
        },
        billType: 12,
        //账户
        accountings: [],
        data: {
            bills: []
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options)
        if (!util.isNull(options)) {

            let f = JSON.parse(options.filter)

            this.setData({
                filter: f,
                'parames.type': options.type,
                'parames.title': options.title,
            });

            wx.setNavigationBarTitle({
                title: options.title
            })
        }

        //获取传值
        let bill = wx.getStorageSync('reconciliation_bills')
        let bills = []

        //12
        if (bill.BillType == BillTypeEnum.SaleBill) {
            bills = bill.SaleBills
            bills.forEach(s => {
                s.guid = util.getGUID()
                s.checked = false
            })
        }
        //14
        else if (bill.BillType == BillTypeEnum.ReturnBill) {
            bills = bill.ReturnBills
            bills.forEach(s => {
                s.guid = util.getGUID()
                s.checked = false
            })
        }
        //41
        else if (bill.BillType == BillTypeEnum.CashReceiptBill) {
            bills = bill.ReceiptCashOweCashBills
            bills.forEach(s => {
                s.guid = util.getGUID()
                s.checked = false
            })
        }
        //43
        else if (bill.BillType == BillTypeEnum.AdvanceReceiptBill) {
            bills = bill.AdvanceReceiptBills
            bills.forEach(s => {
                s.guid = util.getGUID()
                s.checked = false
            })
        }
        //45
        else if (bill.BillType == BillTypeEnum.CostExpenditureBill) {
            bills = bill.CostExpenditureBills
            bills.forEach(s => {
                s.guid = util.getGUID()
                s.checked = false
            })
        }

        //console.log('bills', bills)

        if (bills.length > 0)
            this.disabled(false)

        this.setData({
            billType: bill.BillType,
            totalCollectionAmount: 0,
            'data.bills': bills,
        });
    },
    onShow: function () {
        this.setData({
            businessUsers: app.global.subUsers,
            'filter.BusinessUserId': app.global.userInfo.Id,
            'filter.BusinessUserName': app.global.userInfo.UserRealName,
        }, () => {
            this.onFilter();
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.setStorage({
            key: 'reconciliation_bills',
            data: ''
        })
        wx.setStorage({
            key: 'global_bills',
            data: ''
        })
    },

    clacTotal: function (selectBills) {
        let t = this.data.parames.type
        let tsum = 0
        if (t == 12) {
            tsum = util.sum(selectBills, 'SaleAmountSum').SaleAmountSum ?? 0
        } else if (t == 14) {
            tsum = util.sum(selectBills, 'ReturnAmountSum').ReturnAmountSum ?? 0
        } else if (t == 41) {
            tsum = util.sum(selectBills, 'ReceiptCashOweCashAmountSum').ReceiptCashOweCashAmountSum ?? 0
        } else if (t == 43) {
            tsum = util.sum(selectBills, 'AdvanceReceiptSum').AdvanceReceiptSum ?? 0
        } else if (t == 45) {
            tsum = util.sum(selectBills, 'CostExpenditureSum').CostExpenditureSum ?? 0
        }
        return tsum;
    },

    //单据复选
    changeBill: function (e) {
        let item = e.currentTarget.dataset.item;
        let bills = this.data.data.bills;
        bills.forEach(s => {
            if (s.guid == item.guid) {
                s.checked = !s.checked
            }
        })

        //获取选择单据
        let selectBills = bills.filter(s => {
            return s.checked === true
        });

        //console.log('bills', bills)
        //console.log('this.data.parames.type', this.data.parames.type)



        this.setData({
            totalCollectionAmount: this.clacTotal(selectBills),
            'data.bills': bills
        })
    },

    //选择全部
    checkedAll: function (e) {
        let state = this.data.checkedAll;
        this.setData({
            checkedAll: !state
        })
        state = this.data.checkedAll;

        let bills = this.data.data.bills;
        bills.forEach(s => {
            s.checked = state
        })

        //获取选择单据
        let selectBills = bills.filter(s => {
            return s.checked === true
        });

        this.disabled(false)

        this.setData({
            totalCollectionAmount: this.clacTotal(selectBills),
            'data.bills': bills
        })
    },

    //转向单据
    onRedict(e) {

        let item = e.currentTarget.dataset.item
        //console.log('item', item)

        //临时存储
        wx.setStorageSync({
            key: 'global_bills',
            data: item
        })

        let url = ''
        //12
        if (item.BillType == BillTypeEnum.SaleBill) {
            url = `/packagePages/bills/pages/saleBillPage/index?billType=${BillTypeEnum.SaleBill}&pageType=${PageTypeEnum.edit}&billId=${item.BillId}`
        }
        //14
        else if (item.BillType == BillTypeEnum.ReturnBill) {
            url = '/packagePages/bills/pages/returnBillPage/index?type=view&billId=' + item.BillId
        }
        //41
        else if (item.BillType == BillTypeEnum.CashReceiptBill) {
            url = '/packagePages/bills/pages/receiptBillPage/index?type=view&billId=' + item.BillId
        }
        //43
        else if (item.BillType == BillTypeEnum.AdvanceReceiptBill) {
            url = '/packagePages/bills/pages/advanceReceiptBillPage/index?type=view&billId=' + item.BillId
        }
        //45
        else if (item.BillType == BillTypeEnum.CostExpenditureBill) {
            url = '/packagePages/bills/pages/costExpenditureBillPage/index?type=view&billId=' + item.BillId
        }

        if (url != '') {
            wx.navigateTo({
                url: url
            });
        }
    },

    //获取选择项目
    selectItems: function () {
        //获取选择单据
        let bills = this.data.data.bills;
        let selectBills = bills.filter(s => {
            return s.checked === true
        });
        return selectBills;
    },
    //移除项目
    removeItems: function (guids) {
        let tmpbills = []
        let bills = this.data.data.bills;
        bills.forEach(s => {
            if (guids.indexOf(s.guid) < 0) {
                tmpbills.push(s)
            }
        });
        this.setData({
            totalCollectionAmount: util.sum(tmpbills, 'SaleAmount').SaleAmount ?? 0,
            'data.bills': tmpbills
        })
    },
    //打印
    onPrint: function () {
        //获取选择单据
        if (this.selectItems().length == 0) {
            wx.showToast({
                title: '请选择打印单据！',
                icon: 'none'
            });
            return false;
        }

        let pdata = this.selectItems();
        let inactive = app.global.inactive;
        //58/76/80MM 纸张类型
        if (util.isNull(inactive)) {
            wx.showToast({
                title: '请连接打印机',
                icon: 'error',
                duration: 1000
            })
            return;
        }
        print.printReceipt(80, pdata, '销售收款收据', inactive);
    },

    disabled: function (disabled) {
        this.setData({
            'disabledSubmit': disabled
        })
    },

    //确认上交
    onSubmit: async function (e) {
        let that = this;
        let {
            lock
        } = that.data;

        if (!lock) {
            this.release(true)

            this.disabled(true)

            if (this.data.filter.BusinessUserId == 0) {
                wx.showToast({
                    title: '请选择业务员！',
                    icon: 'none'
                });
                return false;
            }
            if (!authenticationUtil.checkPermission(MenuEnum.AccountReceivableSave)) {
                wx.showToast({
                    title: '您无权限上交',
                    icon: 'error',
                    duration: 5000
                })
                return false
            }
            //获取选择单据
            if (this.selectItems().length == 0) {
                wx.showToast({
                    title: '请选择上交单据！',
                    icon: 'none'
                });
                return false;
            }
            //上交单据 
            let postData = {
                Items: this.selectItems()
            }

            let removeIds = this.selectItems().map(s => s.guid)

            //console.log('postData', postData)

            await financeReceiveAccountService
                .submitAccountStatementAsync(postData)
                .then((res) => {

                    //console.log('submitAccountStatementAsync', res)

                    if (res.code >= 0 && res.success) {
                        wx.showToast({
                            title: '单据上交成功！',
                            icon: 'success'
                        });
                        //移除
                        if (removeIds.length > 0) {
                            this.removeItems(removeIds)
                        }
                    } else {
                        wx.showToast({
                            title: res.message,
                            icon: 'error'
                        });

                    }
                    this.release(false)
                });

            //不管是否提交成功，都刷新上一页
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 2]
            perpage.onLoad()

            this.disabled(false)
        }
    },
    release: function (lock) {
        this.setData({
            lock: lock
        });
    },
    //筛选业务员
    onFilter: async function () {
        let accountingOptionId = 0;
        let businessUserId = this.data.filter.BusinessUserId;
        let billNumber = '';
        let payeer = 0;

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
                if (this.data.billType == BillTypeEnum.SaleBill) {
                    var bill = {
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
                    wx.setStorageSync('reconciliation_bills', bill)
                } else if (this.data.billType == BillTypeEnum.ReturnBill) {
                    /* 退货款 */
                    var bill = {
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
                    wx.setStorageSync('reconciliation_bills', bill)
                } else if (this.data.billType == BillTypeEnum.CashReceiptBill) {
                    /* 收欠款 */
                    var bill = {
                        BType: BillTypeEnum.CashReceiptBill,
                        BillType: BillTypeEnum.CashReceiptBill,
                        BillTypeName: "收欠款",

                        TotalReceiptCashOweCashAmountSum: util.sum(cashReceipts, 'ReceiptCashOweCashAmountSum').ReceiptCashOweCashAmountSum ?? 0,
                        TotalReceiptCashReceivableAmount: util.sum(cashReceipts, 'ReceiptCashReceivableAmount').ReceiptCashReceivableAmount ?? 0,
                        TotalReceiptCashAdvanceReceiptAmount: util.sum(cashReceipts, 'ReceiptCashAdvanceReceiptAmount').ReceiptCashAdvanceReceiptAmount ?? 0,
                        ReceiptCashOweCashBillCount: cashReceipts.length ?? 0,
                        ReceiptCashOweCashBills: cashReceipts
                    };
                    wx.setStorageSync('reconciliation_bills', bill)
                } else if (this.data.billType == BillTypeEnum.AdvanceReceiptBill) {
                    /* 收预收款 */
                    var bill = {
                        BType: BillTypeEnum.AdvanceReceiptBill,
                        BillType: BillTypeEnum.AdvanceReceiptBill,
                        BillTypeName: "收预收款",

                        TotalAdvanceReceiptSum: util.sum(advanceReceipts, 'AdvanceReceiptSum').AdvanceReceiptSum ?? 0,
                        TotalAdvanceReceiptAmount: util.sum(advanceReceipts, 'AdvanceReceiptAmount').AdvanceReceiptAmount ?? 0,
                        TotalAdvanceReceiptOweCashAmount: util.sum(advanceReceipts, 'AdvanceReceiptOweCashAmount').AdvanceReceiptOweCashAmount ?? 0,
                        AdvanceReceiptBillCount: advanceReceipts.length ?? 0,
                        AdvanceReceiptBills: advanceReceipts
                    };
                    wx.setStorageSync('reconciliation_bills', bill)
                } else if (this.data.billType == BillTypeEnum.CostExpenditureBill) {
                    /* 费用支出 */
                    var bill = {
                        BType: BillTypeEnum.CostExpenditureBill,
                        BillType: BillTypeEnum.CostExpenditureBill,
                        BillTypeName: "费用支出",

                        TotalCostExpenditureSum: util.sum(costExpenditures, 'CostExpenditureSum').CostExpenditureSum ?? 0,
                        TotalCostExpenditureAmount: util.sum(costExpenditures, 'CostExpenditureAmount').CostExpenditureAmount ?? 0,
                        TotalCostExpenditureOweCashAmount: util.sum(costExpenditures, 'CostExpenditureOweCashAmount').CostExpenditureOweCashAmount ?? 0,
                        CostExpenditureBillCount: costExpenditures.length ?? 0,
                        CostExpenditureBills: costExpenditures
                    };
                    wx.setStorageSync('reconciliation_bills', bill)
                }

                //绑定
                this.onLoad();

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
            }, () => {
                this.onFilter();
            });
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
    }
})