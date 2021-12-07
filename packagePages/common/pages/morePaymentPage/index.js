const app = getApp()
const util = require('../../../../utils/util')
const accountingService = require('../../../../services/accounting.service')
import BillTypeEnum from '../../../../models/typeEnum'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            billTypeId: 0
        },
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
            Selectes: [{
                Default: true,
                Selected: true,
                Balance: 0,
                BalanceName: '',
                ParentId: 0,
            }]
        },
        payments: []
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: '选择支付方式'
        })
        if (!util.isNull(options)) {
            //console.log('billTypeId', options.billTypeId)
            this.setData({
                'parames.billTypeId': options.billTypeId
            })
        }

        let billTypeId = this.data.parames.billTypeId;
        let PaymentMethods = this.data.paymentMethods

        //获取指定单据类型的收付款方式
        await accountingService
            .getPaymentMethodsAsync(billTypeId)
            .then((result) => {

                //console.log('result:', result)

                //绑定Accounts
                let accounts = []
                switch (parseInt(billTypeId)) {
                    case BillTypeEnum.SaleBill: {
                        accounts = result?.map(a => {
                            return {
                                Default: a.isDefault,
                                AccountingOptionId: a.Id,
                                AccountCodeTypeId: a.accountCodeTypeId,
                                Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                                Name: a.name,
                                CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                                ParentId: a.parentId,
                                Id: a.number
                            };
                        });
                    }
                    break;
                case BillTypeEnum.SaleReservationBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.ReturnBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.ReturnReservationBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.CashReceiptBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.PaymentReceiptBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.AdvanceReceiptBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.AdvancePaymentBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.PurchaseBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            Balance: 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.PurchaseReturnBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id).length > 0,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.CostExpenditureBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            Name: a.name,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                case BillTypeEnum.FinancialIncomeBill: {
                    accounts = result?.map(a => {
                        return {
                            Default: a.isDefault,
                            AccountingOptionId: a.Id,
                            AccountCodeTypeId: a.accountCodeTypeId,
                            Name: a.name,
                            Selected: PaymentMethods.Selectes.filter(s => s.AccountCodeTypeId == a.number)[0]?.Selected ?? false,
                            CollectionAmount: PaymentMethods.Selectes.filter(s => s.AccountingOptionId == a.Id)[0]?.CollectionAmount ?? 0,
                            ParentId: a.parentId,
                            Id: a.number
                        };
                    });
                }
                break;
                }
                // //console.log('accounts:', accounts)

                //console.log('getTree:', this.getTree(accounts, 0))

                let tmps = {
                    id: -1,
                    name: "全部",
                    optionid: 0,
                    parentId: 0,
                    typeId: 0,
                    children: this.getTree(accounts, 0)
                }

                //console.log('tmps:', tmps)

                this.setData({
                    payments: [tmps]
                })
            });
    },

    //构造树
    getTree: function (data, pid) {
        let ctemps = []
        for (let i = 0; i < data.length; i++) {
            var node = data[i];
            if (node.ParentId == pid) {
                let cut = {
                    id: node.Id,
                    name: node.Name,
                    optionId: node.AccountingOptionId,
                    parentId: node.ParentId,
                    typeId: node.AccountCodeTypeId,
                    children: this.getTree(data, node.Id)
                }
                ctemps.push(cut)
            }
        }
        return ctemps;
    },

    //选择树
    getCheckboxData: function (checkbox) {
        //获取选择数据
        const selects = checkbox.detail.selectedValues

        //console.log('selects', selects)

        if (selects.length == 0) {
            wx.showToast({
                title: "请选择支付方式",
                icon: 'none'
            });
            return;
        }

        //分组
        let map = {};
        let group = [];
        for (var i = 0; i < selects.length; i++) {
            var ai = selects[i];
            if (!map[ai.parentId]) {
                group.push({
                    parentId: ai.parentId,
                    name: ai.name,
                    id: ai.id,
                    data: [ai]
                });
                map[ai.parentId] = ai;
            } else {
                for (var j = 0; j < group.length; j++) {
                    var dj = group[j];
                    if (dj.parentId == ai.parentId) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        ////console.log('groups', group)

        //验证规则
        //1.不同类型科目只能选择2种支付方式.
        //2.同类型科目子类只能选择一种支付方式.
        let rept = false;
        group.forEach(g => {
            if (g.data.length > 1) {
                rept = true;
                return;
            }
        })
        if (rept) {
            wx.showToast({
                title: "同科目子类型只能选择一种",
                icon: 'none'
            });
            return;
        }

        if (group.length > 2) {
            wx.showToast({
                title: "最多支持2种支付方式",
                icon: 'none'
            });
            return;
        }

        //回写数据
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];


        //这里规定标准返回格式 bill.Accountings
        /*
        Accountings: [{
                Name: '现金',
                AccountingOptionId: 0,
                CollectionAmount: 0,
                AccountCodeTypeId: 0,
                Number: 0
            }]
        */
        let returnData = selects.map((item) => {
            return {
                Name: item.name,
                AccountingOptionId: item.optionId,
                CollectionAmount: 0,
                AccountCodeTypeId: item.typeId,
                Number: item.id,
            };
        });

        ////console.log('returnData', returnData)

        prevPage.setData({
            'parames.Accountings': returnData
        })
        wx.navigateBack()
    }
})