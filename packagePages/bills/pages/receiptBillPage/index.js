const app = getApp()
const util = require('../../../../utils/util')
const receiptCashService = require('../../../../services/receiptCashBill.service')
const terminalService = require('../../../../services/terminal.service')
import BillTypeEnum from '../../../../models/typeEnum'

Page({
    /*
     * 页面的初始数据
     */
    data: {
        lock: false,
        showkeyborad: false,
        targetInput: '',
        parames: {
            title: '',
            type: '',
            billId: '',
            navigatemark: '',

            Start: '',
            End: '',

            TerminalId: 0,
            TerminalName: '选择客户...',

            BusinessUserId: app.global.userId,
            BusinessUserName: app.global.userInfo.UserRealName
        },
        dialogConf: {},
        show: false,
        //l-arc-popup配置
        arccfg: {
            show: false,
            transition: true,
            zIndex: 99,
            locked: false,
            direction: 'bottom',
            arcRadius: 18,
            maxHeight: 800,
            minHeight: 600,
            opacity: 0.4
        },
        //业务员
        businessUsers: app.global.subUsers,
        //支付方式
        paymentMethods: {
            // 合计
            SubAmount: 0,
            // 本次收款
            CurrentCollectionAmount: 0,
            // 优惠金额
            PreferentialAmount: 0,
            PreferentialAmountShowFiled: true,
            // 欠款金额
            OweCash: 0,
            OweCashShowFiled: true,
            OweCashName: "欠款：",
            //支付方式
            Selectes: []
        },
        //汇总单据
        bills: [],
        //当前单据
        bill: {},
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
        }
    },

    onInit: function () {

        let businessUserId = this.data.parames.BusinessUserId

        var _bill = {
            Id: 0,
            BillTypeId: BillTypeEnum.CashReceiptBill,
            MakeUserId: app.global.userId,
            MakeUserName: app.global.userInfo.userRealName,
            CreatedOnUtc: util.now(0),
            BillNumber: util.getBillNumber(BillTypeEnum.properties[BillTypeEnum.CashReceiptBill].code, app.global.storeId ?? 0),
            TerminalId: 0,
            BusinessUserId: businessUserId ?? 0,
            Remark: '',
            /// 单据总金额
            TotalArrearsAmountOnce: 0,
            /// 单据当前总本次优惠金额
            TotalDiscountAmountOnce: 0,
            /// 单据当前总本次收款金额
            TotalReceivableAmountOnce: 0,
            /// 单据当前总收款后尚欠金额
            TotalAmountOwedAfterReceipt: 0,
            BeforArrearsAmount: 0,
            ReceivableAmount: 0,
            //预收款余额（客户余额）
            AdvanceAmountBalance: 0,
            //需要提交的项目明细
            Items: [],
            //每个收付款单据都必须携带账户科目
            Accountings: [{
                Name: '现金',
                AccountingTypeId: 0,
                AccountCodeTypeId: 0,
                AccountingOptionId: 0,
                AccountingOptionName: '现金',
                CollectionAmount: 0,
                BillId: 0,
                Number: 0,
            }]
        }
        this.setData({
            bills: [],
            bill: _bill
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: '收款单'
        })
        //console.log('options', options)

        if (!util.isNull(options)) {
            this.setData({
                'parames.type': options?.type ?? 0,
                'parames.billId': options?.billId ?? 0,
                'parames.TerminalId': options?.TerminalId ?? 0,
                'parames.TerminalName': options.TerminalName,
                'parames.BusinessUserId': app.global.userId,
                'parames.BusinessUserName': app.global.userInfo.UserRealName
            });
        }

        //初始化
        this.onInit()

        //获取初始收款方式
        await receiptCashService
            .GetInitDataAsync()
            .then((res) => {
                //console.log('GetInitDataAsync:', res)
                if (res != null) {
                    let cbas = res.CashReceiptBillAccountings;
                    let dpm = this.data.paymentMethods;
                    if (dpm.Selectes.length == 0) {
                        var defaultPaymentMethods = cbas.filter(a => {
                            return {
                                Name: a.Name,
                                AccountingOptionId: a.AccountingOptionId,
                                CollectionAmount: 0,
                                AccountCodeTypeId: a.AccountCodeTypeId,
                                Number: a.AccountCodeTypeId
                            };
                        });
                        dpm.Selectes = defaultPaymentMethods
                        this.setData({
                            'bill.Accountings': cbas,
                            paymentMethods: dpm
                        })
                    }
                }
            })

        let type = options?.type ?? ''
        if (type.toUpperCase() == 'VIEW') {
            await this.viewData()
        } else if (type.toUpperCase() == 'ADD') {
            await this.loadData()
        }
    },
    //预览单据
    viewData: async function () {

        let billId = this.data.parames.billId

        //console.log('parames.billId', billId)

        await receiptCashService
            .GetBillAsync(billId)
            .then((res) => {
                //console.log('GetBillAsync:', res)
                if (res != null) {
                    this.setData({
                        'parames.TerminalId': res.CustomerId,
                        'parames.TerminalName': res.CustomerName,
                        'parames.BusinessUserId': res.Payeer,
                        'parames.BusinessUserName': res.PayeerName,
                        bills: res.Items,
                        bill: res
                    })
                }
            });
    },
    //加载欠款
    loadData: async function () {

        //无条件不获取数据
        if (this.data.bill.TerminalId == 0)
            return;

        let businessUserId = this.data.bill.BusinessUserId
        let params = {
            terminalId: this.data.parames.TerminalId,
            billTypeId: 0,
            billNumber: '',
            remark: '',
            startTime: this.data.parames.Start,
            endTime: this.data.parames.End,
            pageIndex: 0,
            pageSize: 20
        }

        //获取单据
        await receiptCashService
            .GetOwecashBillsAsync(params, businessUserId)
            .then((res) => {
                //console.log('res:', res)
                if (res != null) {
                    let items = res.map(bill => {
                        return {
                            CashReceiptBillId: 0,
                            BillId: bill.BillId,
                            BillNumber: bill.BillNumber,
                            BillTypeId: bill.BillTypeId,
                            BillTypeName: bill.BillTypeName,
                            BillLink: bill.BillLink,
                            MakeBillDate: bill.MakeBillDate,
                            //单据金额
                            Amount: bill.Amount,
                            //优惠
                            DiscountAmount: bill.DiscountAmount,
                            //已收金额
                            PaymentedAmount: bill.PaymentedAmount,
                            //欠款金额
                            ArrearsAmount: bill.ArrearsAmount,
                            //本次优惠金额
                            DiscountAmountOnce: 0,
                            //本次收款金额
                            ReceivableAmountOnce: 0,
                            //收款后尚欠金额: 欠款金额
                            AmountOwedAfterReceipt: bill.ArrearsAmount,
                            //应收金额 = 欠款金额
                            AmountReceivable: bill.ArrearsAmount,
                            Remark: bill.Remark
                        }
                    });

                    //console.log('items:', items)

                    //绑定单据
                    this.setData({
                        'bills': items
                    })
                    this.calcUpdate(null, false)
                }
            });
    },

    //更多支付方式
    onMorePayment: function () {
        //必须携带参数billTypeId 指定获取相应单据的收付款方式
        wx.navigateTo({
            url: '/packagePages/common/pages/morePaymentPage/index?billTypeId=' + BillTypeEnum.CashReceiptBill
        });
    },

    //确认支付方式
    doPaymentConfrim(e) {
        //当前单据收款账户
        let accs = this.data.bill.Accountings;
        //本次收款
        let traAmount = this.data.bill.TotalReceivableAmountOnce
        //各收款账户合计金额
        let acaAmount = util.sum(accs, 'CollectionAmount').CollectionAmount ?? 0;
        //console.log('acaAmount', acaAmount)
        //console.log('traAmount', traAmount)
        if (acaAmount < traAmount) {
            wx.showToast({
                title: '各收款账户合计金额不等于本次收款',
                icon: 'none'
            });
            return;
        }
        this.setData({
            'arccfg.show': false
        });

        //如果有多个单据需要收款时，进行滚结处理
        this.calcUpdate(null, true)
    },

    //支付方式中编辑更改
    onBillChanged(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        // //console.log('value', value)
        // //console.log('tag', tag)
        if (util.checkMoney(value)) {
            let b = this.data.bill
            this.buildModel(b, 'bill', tag, value);
            this.setData({
                bill: b
            })
        }
    },

    //支付方式中金额更改时
    onPaymentChanged(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        let item = e.currentTarget.dataset.item;
        //console.log('value', value)
        //console.log('tag', tag)
        //console.log('item', item)

        //当前单据收款账户
        let accs = this.data.bill.Accountings;
        let curItem = accs.filter(s => {
            return s.AccountingOptionId === item.AccountingOptionId
        })[0];
        if (util.checkMoney(value)) {
            this.buildModel(curItem, '', tag, value);
            let acaAmount = util.sum(accs, 'CollectionAmount').CollectionAmount ?? 0;
            this.data.bill.TotalReceivableAmountOnce = acaAmount;
            this.setData({
                bill: this.data.bill
            })
        }
    },

    //编辑金额更改时
    onTextChanged(e) {
        setTimeout(() => {
            let value = e.detail.value;
            let tag = e.currentTarget.dataset.tag;
            let item = e.currentTarget.dataset.item;
            //console.log('value', value)
            //console.log('tag', tag)
            //console.log('item', item)

            let curItem = this.data.bills.filter(s => {
                return s.BillId === item.BillId
            })[0];
            //console.log('checkMoney', util.checkMoney(value))

            //必须是数字金额
            this.buildModel(curItem, '', tag, value);
            this.calcUpdate(curItem, false)
        }, 500);
    },

    //用于模型赋值
    buildModel: function (model, tag, key, value) {
        for (const i in model) {
            if (model[i] != null) {
                if (model[i].constructor == Object) {
                    this.buildModel(model[i], i, key, value);
                } else {

                    var fix = tag == '' ? i : tag + '.' + i;
                    if (key == fix) {
                        model[i] = value;
                    }
                    //console.log(fix + "\t" + model[i]);
                }
            }
        }
    },

    /* 更新计算 */
    calcUpdate: function (item, isRoll) {

        let billId = item?.BillId ?? 0;
        let bills = this.data.bills;
        let Bill = this.data.bill;

        //console.log('bills', bills)

        //console.log('----item---------', item)
        //计算当前尚欠金额 
        if (!isRoll && billId > 0) {
            //AmountReceivable
            if (item?.ReceivableAmountOnce ?? 0 == 0)
                item.ArrearsAmount = item.AmountReceivable
            //收款后尚欠金额:  欠款金额- 本次收款金额 - 本次优惠金额
            item.AmountOwedAfterReceipt = item?.ArrearsAmount - (item?.ReceivableAmountOnce ?? 0) - (item?.DiscountAmountOnce ?? 0);
        }
        //滚结
        else if (isRoll) {
            //1.获取总退额金额（负金额）
            let aoars = bills.filter(s => {
                return s.AmountOwedAfterReceipt < 0
            });
            let totalAOAR = util.sum(aoars, 'AmountOwedAfterReceipt').AmountOwedAfterReceipt ?? 0;

            //console.log('totalAOAR', totalAOAR)

            //收款确认金额
            let traAmount = this.data.bill.TotalReceivableAmountOnce
            //优惠确认金额
            let tdaAmount = this.data.bill.TotalDiscountAmountOnce

            //退额差
            let tempAmount = Math.abs(totalAOAR) + traAmount

            //console.log('tempAmount', tempAmount)

            //先收取退额
            bills.forEach((it) => {

                //console.log('it.AmountOwedAfterReceipt', it.AmountOwedAfterReceipt)

                //如果为退额则清帐：（本次收款 =  尚欠金额）
                if (it.AmountOwedAfterReceipt < 0) {
                    //本次收款 =  尚欠金额 
                    it.ReceivableAmountOnce = it.AmountOwedAfterReceipt;
                } else {
                    //如果退额差大于当前单据的尚欠金额时则清帐 （本次收款 =  尚欠金额）
                    if (tempAmount >= it.AmountOwedAfterReceipt) {
                        //本次收款 =  尚欠金额
                        it.ReceivableAmountOnce = it.AmountOwedAfterReceipt;
                        it.DiscountAmountOnce = tdaAmount
                        //递减退额差 =  退额差 - 尚欠金额 
                        tempAmount = tempAmount - it.AmountOwedAfterReceipt
                        tdaAmount = 0
                    }
                    //如果退额差小于尚欠金额时：本次收款 =  退额差
                    else {
                        it.ReceivableAmountOnce = tempAmount;
                        it.DiscountAmountOnce = tdaAmount
                        tempAmount = 0
                        tdaAmount = 0
                    }
                }
            })

            //重新换算
            bills.forEach((it) => {
                //收款后尚欠金额:  欠款金额- 本次收款金额 - 本次优惠金额
                it.AmountOwedAfterReceipt = it?.ArrearsAmount - (it?.ReceivableAmountOnce ?? 0) - (it?.DiscountAmountOnce ?? 0);
            })
        }

        //console.log('bills', bills)

        //本次单据应收合计
        Bill.TotalArrearsAmountOnce = util.sum(bills, 'ArrearsAmount').ArrearsAmount ?? 0;
        //本次单据尚欠合计
        Bill.TotalAmountOwedAfterReceipt = util.sum(bills, 'AmountOwedAfterReceipt').AmountOwedAfterReceipt ?? 0;
        //本次单据优惠合计 
        let daAmount = util.sum(bills, 'DiscountAmountOnce').DiscountAmountOnce ?? 0;
        if (this.data.paymentMethods.PreferentialAmount != daAmount)
            Bill.TotalDiscountAmountOnce = daAmount;
        else
            Bill.TotalDiscountAmountOnce = this.data.paymentMethods.PreferentialAmount;

        //本次单据收款合计
        let raAmount = util.sum(bills, 'ReceivableAmountOnce').ReceivableAmountOnce ?? 0;
        if (this.data.paymentMethods.CurrentCollectionAmount != raAmount)
            Bill.TotalReceivableAmountOnce = raAmount;
        else
            Bill.TotalReceivableAmountOnce = this.data.paymentMethods.CurrentCollectionAmount;

        //单据收款 
        Bill.ReceivableAmount = Bill.TotalArrearsAmountOnce ?? 0;
        //单据优惠 
        Bill.PreferentialAmount = Bill.TotalDiscountAmountOnce ?? 0;
        //单据欠款 OweCash
        let cbaAmount = util.sum(Bill.Accountings, 'CollectionAmount').CollectionAmount ?? 0;
        Bill.OweCash = Bill.ReceivableAmount - cbaAmount;

        //更新收款方式
        this.data.paymentMethods.SubAmount = Bill.TotalArrearsAmountOnce ?? 0;
        this.data.paymentMethods.PreferentialAmount = Bill.TotalDiscountAmountOnce ?? 0;
        this.data.paymentMethods.OweCash = Bill.TotalAmountOwedAfterReceipt ?? 0;

        //保证收款合计等于总的本次收款
        let first = this.data.paymentMethods.Selectes[0];
        if (first != null) {
            first.CollectionAmount = Bill.TotalReceivableAmountOnce ?? 0;
        }

        //更新收款账户
        Bill.Accountings = this.data.paymentMethods.Selectes;
        let accountings = this.data.paymentMethods.Selectes.map(a => {
            return {
                Name: a.Name,
                AccountingOptionId: a.AccountingOptionId,
                CollectionAmount: a.CollectionAmount,
                AccountCodeTypeId: a.AccountCodeTypeId,
                Number: a.Number
            };
        });
        Bill.Accountings = accountings;
        Bill.Items = bills

        //console.log('Bill', Bill)

        //更新变更单据和临时单据
        this.setData({
            'bill': Bill,
            'bills': bills
        })
    },

    //生命周期函数--监听页面初次渲染完成
    onReady: function () {},

    //生命周期函数--监听页面显示
    onShow: async function () {
        let BusinessUserId = app.global.userId
        let BusinessUserName = app.global.userInfo.UserRealName
        this.setData({
            'bill.TerminalId': this.data.parames.TerminalId,
            businessUsers: app.global.subUsers,
            'parames.BusinessUserId': BusinessUserId,
            'parames.BusinessUserName': BusinessUserName
        }, async () => {
            //预收款余额（客户余额）
            if (this.data.bill.TerminalId > 0) {
                await terminalService
                    .getTerminalBalanceAsync(this.data.bill.TerminalId)
                    .then((res) => {
                        if (res.code > 0) {
                            var aab = res.data?.AdvanceAmountBalance ?? 0
                            this.setData({
                                'bill.AdvanceAmountBalance': aab
                            })
                        }
                    });
            }
        })
        //加载
        await this.loadData()
    },

    //生命周期函数--监听页面隐藏
    onHide: function () {},
    //生命周期函数--监听页面卸载
    onUnload: function () {},
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    //页面上拉触底事件的处理函数
    onReachBottom: function () {},

    //支付方式
    onPayment: function () {
        const config = this.data.arccfg;
        config.show = true;
        this.setData({
            arccfg: config
        });
    },
    //提交单据
    onSubmit: async function () {
        let that = this;
        let {
            lock
        } = that.data;

        if (!lock) {
            this.release(true)
            try {
                let bill = this.data.bill

                if (bill.AuditedStatus) {
                    wx.showToast({
                        title: '已审核单据不能操作',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }
                if (util.isNullOrEmpty(bill.TerminalId) || bill.TerminalId == 0) {
                    wx.showToast({
                        title: '客户未指定',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }

                if (util.isNullOrEmpty(bill.BusinessUserId) || bill.BusinessUserId == 0) {
                    wx.showToast({
                        title: '业务员未指定',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }

                if (bill.Items.length == 0) {
                    wx.showToast({
                        title: '无收款单据信息',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }

                if (bill.Accountings.length == 0) {
                    wx.showToast({
                        title: '请选择支付方式',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }

                //AdvancesReceived = 24
                let advanceAmount = bill.Accountings
                    .filter(s => {
                        return s.AccountCodeTypeId == 24
                    })[0]?.CollectionAmount ?? 0;

                let amount = bill.TotalReceivableAmountOnce ?? 0
                if (amount <= 0) {
                    wx.showToast({
                        title: '没有收款哦',
                        icon: 'error'
                    });
                    this.release(false)
                    return;
                }

                var postData = {
                    BillNumber: bill.BillNumber,
                    CustomerId: bill.TerminalId,
                    Payeer: bill.BusinessUserId,
                    PreferentialAmount: bill.TotalDiscountAmountOnce ?? 0,
                    OweCash: bill.TotalAmountOwedAfterReceipt ?? 0,
                    ReceivableAmount: bill.TotalReceivableAmountOnce ?? 0,
                    Remark: bill.Remark,
                    Items: bill.Items,
                    Accounting: bill.Accountings,
                    //预收金额(收款中包含的预收部分)
                    AdvanceAmount: advanceAmount,
                    //预收款余额（客户余额）
                    AdvanceAmountBalance: bill.AdvanceAmountBalance
                };

                //console.log('postData', postData)

                let billId = bill.Id
                await receiptCashService
                    .CreateOrUpdateAsync(postData, billId)
                    .then((res) => {

                        //console.log('CreateOrUpdateAsync:', res)
                        if (res != null && res.code >= 0) {
                            //console.log(res?.data)
                            wx.showToast({
                                title: '单据提交成功！',
                                duration: 1000,
                            });
                            //刷新单据
                            this.setData({
                                'bill.CreatedOnUtc': util.now(0),
                                'bill.BillNumber': util.getBillNumber(BillTypeEnum.properties[BillTypeEnum.CashReceiptBill].code, app.global.storeId ?? 0)
                            })
                            this.loadData()
                        } else {
                            wx.showToast({
                                title: '服务器错误！'
                            });
                        }
                        this.release(false)
                    })
            } catch (error) {
                this.release(false)
                wx.showToast({
                    title: '系统错误！'
                });
            }
        }
    },
    release: function (lock) {
        this.setData({
            lock: lock
        });
    },
    //选择客户
    onSelectTerminal: function (e) {
        if (this.data.bill.AuditedStatus) {
            return;
        }

        wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=select&navigatemark=/packagePages/bills/pages/saleBillPage/index'
        });
    },
    //选择业务员
    async onSelectUser() {

        if (this.data.bill.AuditedStatus) {
            wx.showToast({
                title: '已经审核不能更改',
                icon: 'none'
            })
            return;
        }

        let bill = this.data.bill
        if (util.isNullOrEmpty(bill.TerminalId) || bill.TerminalId == 0) {
            wx.showToast({
                title: '客户未指定',
                icon: 'none'
            });
            return;
        }

        util.showActionSheet({
            itemList: this.data.businessUsers,
            showCancel: true
        }, async (item) => {
            this.setData({
                'parames.BusinessUserName': item.name,
                'bill.BusinessUserId': item.id,
            }, () => {
                this.loadData()
            });
        });
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
    //选择日期
    onSelectDate: function () {

        let bill = this.data.bill
        if (util.isNullOrEmpty(bill.TerminalId) || bill.TerminalId == 0) {
            wx.showToast({
                title: '客户未指定',
                icon: 'none'
            });
            return;
        }

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

    },
    //获取选择日期范围
    async selectCalender(e) {


        //console.log('e.detail:', e.detail)
        if (e.detail[0] == null || e.detail[1] == null) {
            return;
        }
        // //console.log('Start:', util.getDate(e.detail[0]))
        // //console.log('End:', util.getDate(e.detail[1]))
        this.setData({
            'parames.Start': util.getDate(e.detail[0]),
            'parames.End': util.getDate(e.detail[1]),
        });

        //加载
        await this.loadData()
    },
    //整单备注
    onShowRemark: function () {
        if (this.data.parames.type.toUpperCase() == 'VIEW') {
            return;
        }

        this.setData({
            dialogConf: {
                show: true,
                type: 'confirm',
                showTitle: true,
                title: '整单备注',
                content: '',
                confirmText: '确定',
                confirmColor: '#3683d6',
                cancelText: '取消',
                cancelColor: '#999'
            },
            mtype: 5
        })
    },
    onConfirmTap() {
        this.setData({
            'bill.Remark': this.data.bill.Remark
        })
    },
    onCancelTap() {
        this.setData({
            'bill.Remark': ''
        })
    },
    onRemarkChanged: function (e) {
        let value = e.detail.value;
        this.data.bill.Remark = value
    },

    //自定义键盘函数 
    boardShow: function (e) {
        let tag = e.currentTarget.dataset.tag;
        this.setData({
            targetInput: tag,
            showkeyborad: true,
        })
    },
    boardcancle: function (e) {
        this.setData({
            showkeyborad: false,
        })
    },
    //自定义键盘函数  确定按钮
    boardsubmit: function (e) {
        //console.log(e)
        var inputval = e.detail;
        this.setData({
            showkeyborad: false,
        })
    },
    //打印
    onPrint: function () {
        let that = this
        if (that.data.bill.items.length == 0) {
            wx.showToast({
                title: '无打印数据！',
                icon: 'none'
            });
            return false;
        }
        let bill = that.data.bill
        let inactive = app.global.inactive;
        //console.log('inactive', inactive)
        if (util.isNull(inactive)) {
            wx.showToast({
                title: '请适配打印机',
                icon: 'error',
                duration: 1000
            })
            return false;
        }
        //收款单测试
        // let test_41 = {
        //     BillNumber: 'SK2021034343434343',
        //     BossCall: '13958595599',
        //     TerminalName: '桃心岛商场',
        //     Address: '陕西省汉中市天汉大道',
        //     CreatedOnUtc: util.time(),
        //     SumAmount: 2323.88,
        //     PreferentialAmount: 0,
        //     OweCash: 0,
        //     Remark: '备注测试',
        //     BusinessUserName: '小李',
        //     Items: [{
        //         BillNumber: 'XS2021034343434343',
        //         DiscountAmountOnce: 3434.67,
        //         ReceivableAmountOnce: 455.66
        //     }]
        // }
        let items = bill.items.map(p => {
            return {
                BillNumber: p.BillNumber,
                DiscountAmountOnce: p.DiscountAmountOnce,
                ReceivableAmountOnce: p.ReceivableAmountOnce
            }
        })
        let billData = {
            BillNumber: bill.BillNumber,
            BossCall: bill.TerminalBossCall,
            TerminalName: bill.TerminalName,
            Address: bill.TerminalAddress,
            WareHouseName: bill.WareHouseName,
            CreatedOnUtc: bill.CreatedOnUtc,
            SumAmount: bill.paymentMethods.SumAmount,
            PreferentialAmount: bill.paymentMethods.PreferentialAmount,
            OweCash: bill.paymentMethods.OweCash,
            Remark: bill.Remark ?? '',
            BusinessUserName: bill.BusinessUserName ?? '',
            Items: items
        }
        //新方法打印 判断蓝牙状态并连接
        printMain.printBill(inactive, BillTypeEnum.CashReceiptBill, billData)
        return true
    },
})