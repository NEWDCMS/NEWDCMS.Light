const app = getApp()
const util = require('../../../../utils/util')
const wareHousesService = require('../../../../services/wareHouses.Service')
const terminalService = require('../../../../services/terminal.service')
const returnBillService = require('../../../../services/returnBill.service')
const authenticationUtil = require('../../../../utils/authentication.util')
import BillTypeEnum from '../../../../models/typeEnum'
import AccountingCodeEnum from '../../../../models/accountingCodeEnum'
import PageTypeEnum from '../../../../models/pageTypeEnum'
import MenuEnum from '../../../../models/menuEnum'
const printer = require('../../../../printer/printer')
const printMain = require('../../../../printer/print-main')

//单据缓存KEY
const cacheKey = 'CACHE_RETURNBILLADD'

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            products: [],
            editProducts: [],
            deleteProducts: [],
            billType: BillTypeEnum.ReturnBill,
            pageType: PageTypeEnum.add,
            cacheKey: '',
            Accountings: []
        },
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
        dialogConf: {},
        menusConf: {},
        bill: {
            BillTypeId: BillTypeEnum.ReturnBill,
            MakeUserId: app.global.userId,
            DeliveryUserId: app.global.userId,
            MakeUserName: app.global.userInfo.userRealName,
            CreatedOnUtc: util.time(),
            BillNumber: util.getBillNumber(BillTypeEnum.properties[BillTypeEnum.ReturnBill].code, app.global.storeId ?? 0),
            WareHouseId: '0',
            TerminalId: 0,
            TerminalName: '',
            WareHouseName: '',
            TerminalBossCall: '',
            TerminalAddress: '',
            items: [],
            //每个收付款单据都必须携带账户科目
            Accountings: [{
                Name: '现金',
                AccountingOptionId: 0,
                CollectionAmount: 0,
                AccountCodeTypeId: 0,
                Number: 0
            }],
        },
        rushRemark: '',
        terminalBalance: {
            TotalOweCashShow: '0.00'
        },
        //默认价格方案
        defalutPlanPrice: {},
        warehouses: [],
        saleDefaultAmounts: [],
        menuData: {},
        removeMenu: [],
        menus: [{
            name: '历史单据',
            id: 0,
            icon: 'label'
        }, {
            name: '默认售价',
            id: 1,
            icon: 'label'
        }, {
            name: '支付方式',
            id: 2,
            icon: 'label'
        }, {
            name: '欠款',
            id: 3,
            icon: 'label'
        }, {
            name: '优惠',
            id: 4,
            icon: 'label'
        }, {
            name: '备注',
            id: 5,
            icon: 'label'
        }, {
            name: '审核',
            id: 6,
            icon: 'label'
        }, {
            name: '冲改',
            id: 7,
            icon: 'label'
        }, {
            name: '清空单据',
            id: 8,
            icon: 'clear'
        }, {
            name: '打印',
            id: 9,
            icon: 'printer'
        }],
        billCanEdit: true
    },
    onLoad: async function (options) {
        //console.log('*********** returnbill on load ***********', options)
        wx.setNavigationBarTitle({
            title: "退货单"
        })
        let billId = 0;
        if (!util.isEmpty(options.billId)) {
            billId = options.billId
        }
        let terminalId = 0;
        if (!util.isEmpty(options.terminalId)) {
            terminalId = options.terminalId
        }
        let terminalName = '选择客户...';
        if (!util.isEmpty(options.terminalName)) {
            terminalName = options.terminalName
        }
        this.setData({
            'parames.billType': options.billType,
            'parames.pageType': options.pageType,
            'parames.billId': billId,
            'parames.terminalId': terminalId,
            'parames.terminalName': terminalName
        }, () => {
            this.initBill()
        })
        //加载仓库信息
        await wareHousesService
            .getWareHousesAsync(BillTypeEnum.ReturnBill)
            .then(res => {
                //console.log('ware', res)
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
                    this.setData({
                        warehouses: tempWare.concat(rapeList)
                    })
                }
            })
    },
    //初始化单据
    async initBill(clear = false) {
        let pms = this.data.parames
        let bt = BillTypeEnum.ReturnBill
        let stb = app.global.returnBill
        //临时bill
        let bill = {}
        bill.BillTypeId = bt
        bill.MakeUserId = app.global.userId
        bill.DeliveryUserId = app.global.userId
        bill.MakeUserName = app.global.userInfo.userRealName
        bill.CreatedOnUtc = util.time(),
            bill.BillNumber = util.getBillNumber(BillTypeEnum.properties[bt].code, app.global.storeId ?? 0)
        bill.TerminalId = pms.terminalId
        bill.TerminalName = pms.terminalName
        bill.TerminalBossCall = ''
        bill.TerminalAddress = ''
        bill.WareHouseId = 0
        bill.WareHouseName = ''
        bill.items = []
        bill.paymentMethods = {}
        bill.paymentMethods.SumAmount = 0
        bill.paymentMethods.PreferentialAmount = 0
        bill.paymentMethods.OweCash = 0
        bill.paymentMethods.selects = []
        let removeMenuIds = []


        let resultCheck = await authenticationUtil.checkBusinessTime(BillTypeEnum.ReturnBill)
        this.setData({
            billCanEdit: resultCheck.isBillTime
        })
        if (!resultCheck.isBillTime) {
            removeMenuIds = removeMenuIds.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            wx.showModal({
                title: '特别提示',
                content: `请在业务时间${resultCheck.startTime}-${resultCheck.endTime}之间开单，当前时间仅支持查看单据`,
            })
        }

        //添加明细回传
        if (pms.billType == bt && pms.pageType == PageTypeEnum.add) {
            removeMenuIds = removeMenuIds.concat([6, 7])

            //从缓存获取单据
            let cache = {}
            cache = wx.getStorageSync(cacheKey)
            if (cache) {
                //console.log('******load cacheBill', cache)
                wx.setStorage({
                    key: cacheKey,
                    data: {}
                })
            }
            if (pms.terminalId > 0 && pms.terminalId != cache.TerminalId) {
                cache = {}
            }

            if (!util.isEmpty(cache.BillNumber) && !clear && cache.BillTypeId == bt) {
                bill = cache
            }
            bill.BusinessUserId = app.global.userInfo.Id
            bill.CreatedOnUtc = util.time()
        }
        //编辑明细回传
        else if (pms.billType == bt && (pms.pageType == PageTypeEnum.edit || pms.pageType == PageTypeEnum.check) && !clear) {
            removeMenuIds = removeMenuIds.concat([0])
            if (!util.isEmpty(pms.billId) && pms.billId > 0) {
                await returnBillService.GetBillAsync(pms.billId).then((res) => {
                    //console.log('res:', res);
                    if (res.code >= 0) {
                        bill = res.data
                        if (util.isEmpty(bill.AuditedStatus) || bill.AuditedStatus == false) {
                            removeMenuIds = removeMenuIds.concat([7])
                        }
                        if (!util.isEmpty(bill.AuditedStatus) && bill.AuditedStatus == true) {
                            removeMenuIds = removeMenuIds.concat([1, 2, 3, 4, 5, 6, 8])
                        }
                        if (!util.isEmpty(bill.ReversedStatus) && bill.ReversedStatus == true) {
                            removeMenuIds = removeMenuIds.concat([1, 2, 3, 4, 5, 6, 7, 8])
                        }
                        let items = []
                        if (!util.isEmpty(res.data.Items)) {
                            res.data.Items.forEach(p => {
                                let temp = {};
                                temp.uuid = util.genUUID()
                                temp.unitId = p.UnitId
                                temp.unitName = p.UnitName
                                temp.productId = p.ProductId
                                temp.productName = p.ProductName
                                temp.storeId = res.storeId
                                temp.quantity = p.Quantity
                                temp.price = p.Price
                                temp.amount = p.Amount
                                temp.remark = p.Remark
                                temp.bigUnitId = p.BigUnitId
                                temp.smallUnitId = p.SmallUnitId
                                temp.isGifts = p.IsGifts
                                temp.subtotal = p.Amount
                                items.push(temp)
                            })
                            bill.items = items
                        }
                        let payment = {}
                        if (!util.isEmpty(res.data)) {
                            payment = this.toPayment(res.data)
                            if (!util.isEmpty(payment)) {
                                bill.paymentMethods = payment
                            }
                        }
                    } else {
                        wx.showToast({
                            title: '获取单据信息失败' + res.message,
                        })
                    }
                })
            }
        }

        this.setData({
            'parames.cacheKey': cacheKey
        })
        let menus = this.data.menus;
        if (removeMenuIds.length > 0) {
            removeMenuIds.forEach(item => {
                let delIndex = menus.findIndex(p => {
                    return p.id == item
                })
                if (delIndex >= 0) {
                    menus.splice(delIndex, 1)
                }
            })
            this.setData({
                menus: menus
            })
        }


        if (!util.isEmpty(bill)) {
            //console.log('=====setData')
            //仓库为空时，取默认系统配置
            if (bill.WareHouseId == 0) {
                //console.log('=====setData  WareHouseId')
                bill.WareHouseId = stb.WareHouseId
                bill.WareHouseName = stb.WarehouseName
            }

            this.setData({
                bill: bill
            }, () => {
                if (!util.isEmpty(this.data.bill.TerminalId) && this.data.bill.TerminalId > 0) {
                    this.getTerminalBalance(this.data.bill.TerminalId)
                    this.getTerminalInfo(this.data.bill.TerminalId)
                }
                if (!clear && !util.isEmpty(bill.paymentMethods.selects)) {
                    this.initPayment(false)
                } else {
                    this.initPayment()
                }
            })
        } else {
            this.initPayment()
        }
    },
    toPayment(sourceBill) {
        if (sourceBill.ReturnBillAccountings) {
            let accountings = sourceBill.ReturnBillAccountings.map(item => {
                return {
                    name: item.AccountingOptionName,
                    accountingTypeId: item.AccountingTypeId,
                    accountCodeTypeId: item.AccountCodeTypeId,
                    accountingOptionId: item.AccountingOptionId,
                    accountingOptionName: item.AccountingOptionName,
                    collectionAmount: item.CollectionAmount
                }
            })
            let pay = {
                selects: accountings,
                SumAmount: sourceBill.SumAmount,
                PreferentialAmount: sourceBill.PreferentialAmount,
                OweCash: sourceBill.OweCash
            };
            return pay
        } else {
            wx.showToast({
                title: '支付方式为空',
                icon: 'error'
            })
            return {}
        }
    },
    cacheBill() {
        let key = ''
        if (this.data.parames.pageType == PageTypeEnum.add) {
            key = this.data.parames.cacheKey
        }
        if (!util.isEmpty(key)) {
            let bill = this.data.bill
            //console.log('************cacheBill key', key)
            //console.log('************cacheBill bill', bill)

            wx.setStorage({
                key: key,
                data: bill
            })
            //wx.setStorageSync(key, bill)
        }
    },
    onReady: function () {

    },
    onShow: function () {
        // var pages = getCurrentPages();
        // var currPage = pages[pages.length - 1];
        // //console.log('------------currPage.data------------')
        //console.log('this.data.parames', this.data.parames)
        if (!util.isEmpty(this.data.parames.TerminalId) && this.data.parames.TerminalId > 0) {
            let terminalId = this.data.parames.TerminalId
            let terminalName = this.data.parames.TerminalName
            let TerminalBossCall = this.data.parames.TerminalBossCall
            let TerminalAddress = this.data.parames.TerminalAddress
            this.setData({
                'bill.TerminalId': terminalId,
                'bill.TerminalName': terminalName,
                'bill.TerminalBossCall': TerminalBossCall,
                'bill.TerminalAddress': TerminalAddress,
                'parames.TerminalId': 0,
                'parames.TerminalName': '',
                'parames.TerminalBossCall': '',
                'parames.TerminalAddress': ''
            }, () => {
                this.getTerminalBalance(this.data.bill.TerminalId)
                this.cacheBill()
            })
        }
        if (!util.isEmpty(this.data.parames.Accountings)) {
            let newAccounts = []
            let accounts = this.data.bill.paymentMethods.selects;
            newAccounts = accounts.filter(p => {
                let filterIndex = this.data.parames.Accountings.findIndex(item => {
                    return item.AccountCodeTypeId == p.accountCodeTypeId && item.AccountingOptionId == p.accountingOptionId
                })
                return filterIndex >= 0

            })
            this.data.parames.Accountings.forEach(item => {
                let index = newAccounts.findIndex(p => {
                    return (item.AccountCodeTypeId == p.accountCodeTypeId && item.AccountingOptionId == p.accountingOptionId)
                })
                if (index < 0) {
                    newAccounts.push({
                        accountCodeTypeId: item.AccountCodeTypeId,
                        default: true,
                        name: item.Name,
                        accountingOptionId: item.AccountingOptionId,
                        accountingOptionName: item.Name,
                        collectionAmount: 0
                    })
                }
            })
            this.setData({
                'bill.paymentMethods.selects': newAccounts,
                'parames.Accountings': []
            }, () => {
                this.openPayments()
            })

        }

        let billItems = this.data.bill.items;
        if (util.isEmpty(billItems)) {
            billItems = []
        }

        //获取回传商品集合
        if (this.data.parames.products.length > 0) {
            //console.log('this.data.parames.products', this.data.parames.products)
            this.data.parames.products.forEach(p => {
                let temp = {};
                temp.uuid = util.genUUID()
                temp.unitId = p.BigPriceUnit.UnitId
                temp.productId = p.Id
                temp.productName = p.Name
                temp.storeId = app.global.storeId
                temp.unitName = p.BigPriceUnit.UnitName
                temp.quantity = p.BigPriceUnit.Quantity
                temp.price = p.BigPriceUnit.Price
                temp.amount = p.BigPriceUnit.Amount
                temp.remark = p.BigPriceUnit.Remark
                temp.bigUnitId = p.BigPriceUnit.UnitId
                temp.smallUnitId = 0
                temp.isGifts = p.BigPriceUnit.Quantity > 0 &&
                    p.BigPriceUnit.Price == 0
                temp.subtotal = p.BigPriceUnit.Amount
                temp.campaignId = p.CampaignId ?? 0
                temp.campaignName = p.CampaignName ?? ''
                // temp.campaignBuyProductId = p.typeId == 1 ? p.id : 0..campaignGiveProductId = p.typeId == 2 ? p.id : 0;
                if (temp.quantity > 0) {
                    if (temp.isGifts && (util.isEmpty(temp.remark)))
                        temp.remark = "赠品(零元开单)";
                    billItems.push(temp);
                }
                temp = {};
                temp.uuid = util.genUUID()
                temp.unitId = p.SmallPriceUnit.UnitId
                temp.productId = p.Id
                temp.productName = p.Name
                temp.storeId = app.global.storeId
                temp.unitName = p.SmallPriceUnit.UnitName
                temp.quantity = p.SmallPriceUnit.Quantity
                temp.price = p.SmallPriceUnit.Price
                temp.amount = p.SmallPriceUnit.Amount
                temp.remark = p.SmallPriceUnit.Remark
                temp.bigUnitId = 0
                temp.smallUnitId = p.SmallPriceUnit.UnitId
                temp.isGifts = p.SmallPriceUnit.Quantity > 0 &&
                    p.SmallPriceUnit.Price == 0
                temp.subtotal = p.SmallPriceUnit.Amount
                temp.campaignId = p.CampaignId ?? 0
                temp.campaignName = p.CampaignName ?? ''
                if (temp.quantity > 0) {
                    if (temp.isGifts && (util.isEmpty(temp.remark)))
                        temp.remark = "赠品(零元开单)";
                    billItems.push(temp);
                }
                if (p.GiveProduct.BigUnitQuantity > 0) {
                    temp = {};
                    temp.uuid = util.genUUID()
                    temp.unitId = p.BigPriceUnit.UnitId
                    temp.productId = p.Id
                    temp.productName = p.Name
                    temp.storeId = app.global.storeId
                    temp.unitName = p.BigPriceUnit.UnitName
                    temp.quantity = p.GiveProduct.BigUnitQuantity
                    temp.price = 0
                    temp.amount = 0
                    temp.remark = p.GiveProduct.Remark == '' ? '赠品' : p.GiveProduct.Remark
                    temp.bigUnitId = p.GiveProduct.UnitId
                    temp.smallUnitId = 0
                    temp.isGifts = true
                    temp.subtotal = 0
                    temp.campaignId = p.CampaignId ?? 0
                    temp.campaignName = p.CampaignName ?? ''
                    billItems.push(temp);
                }
                if (p.GiveProduct.SmallUnitQuantity > 0) {
                    temp = {};
                    temp.uuid = util.genUUID()
                    temp.unitId = p.SmallPriceUnit.UnitId
                    temp.productId = p.Id
                    temp.productName = p.Name
                    temp.storeId = app.global.storeId
                    temp.unitName = p.SmallPriceUnit.UnitName
                    temp.quantity = p.GiveProduct.SmallUnitQuantity
                    temp.price = 0
                    temp.amount = 0
                    temp.remark = p.GiveProduct.Remark == '' ? '赠品' : p.GiveProduct.Remark
                    temp.bigUnitId = 0
                    temp.smallUnitId = p.GiveProduct.UnitId
                    temp.isGifts = true
                    temp.subtotal = 0
                    temp.campaignId = p.CampaignId ?? 0
                    temp.campaignName = p.CampaignName ?? ''
                    billItems.push(temp);
                }
            })
            this.setData({
                'bill.items': billItems,
                'parames.products': [],
            }, () => {
                this.calcTotal()
            })

        } else if (this.data.parames.editProducts.length > 0) {
            //console.log('parames.editProducts', this.data.parames.editProducts)
            this.data.parames.editProducts.forEach(p => {
                let editProduct = billItems.find(item => {
                    return item.uuid == p.uuid
                })
                if (editProduct) {
                    editProduct.amount = p.amount
                    editProduct.price = p.price
                    editProduct.unitId = p.unitId
                    editProduct.unitName = p.unitName
                    editProduct.quantity = p.quantity
                    editProduct.subtotal = p.subtotal
                    if (editProduct.remarkId != 0) {
                        editProduct.remark = p.remark
                    }
                    editProduct.remarkId = p.remarkId
                }
            })
            this.setData({
                'bill.items': billItems,
                'parames.editProducts': []
            }, () => {
                this.calcTotal()
            })
        } else if (this.data.parames.deleteProducts.length > 0) {
            this.data.parames.deleteProducts.forEach(p => {
                let deleteProductIndex = billItems.findIndex(item => {
                    return item.uuid == p.uuid
                })
                if (deleteProductIndex >= 0) {
                    billItems.splice(deleteProductIndex, 1)
                }
                this.setData({
                    'bill.items': billItems,
                    'parames.deleteProducts': []
                }, () => {
                    this.calcTotal()
                })
            })
        }

    },
    initPayment(initPay = true) {
        returnBillService.GetInitDataAsync(this.data.parames.billType).then(res => {
            //console.log('initPayment', res)
            if (!util.isEmpty(res)) {
                let defaultPayments = res.ReturnBillAccountings.map(item => {
                    return {
                        accountCodeTypeId: item.AccountCodeTypeId,
                        default: true,
                        name: item.Name,
                        accountingOptionId: item.AccountingOptionId,
                        accountingOptionName: item.Name,
                        collectionAmount: 0
                    }
                })
                //console.log('********res.SaleDefaultAmounts', res.SaleDefaultAmounts)
                if (initPay) {
                    this.setData({
                        'bill.paymentMethods.selects': defaultPayments,
                        'bill.paymentMethods.PreferentialAmount': 0,
                        saleDefaultAmounts: res.ReturnDefaultAmounts
                    }, () => {
                        //console.log('payment', this.data)
                    })
                } else {
                    this.setData({
                        saleDefaultAmounts: res.ReturnDefaultAmounts
                    }, () => {
                        //console.log('payment', this.data)
                    })
                }

            }
        })
    },
    onPreferentialAmounthanged(e) {
        this.setData({
            'bill.paymentMethods.PreferentialAmount': e.detail.value
        }, () => {
            this.calcTotal(false)
        })

    },
    onPaymentChanged(e) {
        //console.log('onPaymentChanged', e)
        let selects = this.data.bill.paymentMethods.selects;
        let payment = selects.find(p => {
            return p.accountCodeTypeId == e.currentTarget.dataset.item.accountCodeTypeId
        })
        if (!util.isEmpty(payment)) {
            payment.collectionAmount = e.detail.value
        }
        this.setData({
            'bill.paymentMethods.selects': selects
        }, () => {
            this.calcTotal(false)
        })
    },
    doPaymentConfrim(e) {
        const config = this.data.arccfg;
        config.show = false;
        this.setData({
            arccfg: config
        });
    },
    calcTotal(isDefault = true, isOweCash = false) {
        let bill = this.data.bill
        if (util.isEmpty(bill.paymentMethods.PreferentialAmount)) {
            bill.paymentMethods.PreferentialAmount = 0
        }
        //console.log('paymentMethods', bill.paymentMethods)
        bill.paymentMethods.SumAmount = 0
        let billItem = bill.items;
        billItem.forEach(item => {
            bill.paymentMethods.SumAmount += item.subtotal ?? 0
        })
        let totalAccountingAmount = 0
        bill.paymentMethods.selects.forEach((e) => {
            if (util.isEmpty(e.collectionAmount)) {
                e.collectionAmount = 0
            }
            totalAccountingAmount += e.collectionAmount;
        });
        if (!isDefault) {
            bill.paymentMethods.OweCash = bill.paymentMethods.SumAmount - bill.paymentMethods.PreferentialAmount - totalAccountingAmount;
        } else if (isOweCash) {
            let collectionAmount = bill.paymentMethods.SumAmount - bill.paymentMethods.OweCash - bill.paymentMethods.PreferentialAmount
            bill.paymentMethods.selects.forEach((item, index) => {
                if (index == 0) {
                    item.collectionAmount = collectionAmount
                } else {
                    item.collectionAmount = 0
                }
            })
        } else {
            bill.paymentMethods.OweCash = 0;
            bill.paymentMethods.currentCollectionAmount = bill.paymentMethods.SumAmount - bill.paymentMethods.PreferentialAmount;
            let defultPay = bill.paymentMethods.selects[0];
            if (!util.isEmpty(defultPay))
                defultPay.collectionAmount = bill.paymentMethods.currentCollectionAmount ?? 0;
        }
        //用于传递
        this.setData({
            'bill.paymentMethods': bill.paymentMethods
        }, () => {
            this.cacheBill()
        })

    },
    onHide: function () {

    },
    onUnload: function () {
        this.cacheBill()
    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },
    onSelectTerminal: function (e) {
        if (!this.data.billCanEdit) {
            return false
        }
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=select&navigatemark=/packagePages/bills/pages/saleBillPage/index'
        });
    },
    onShowPopupMenus(e) {
        if (!this.data.billCanEdit) {
            return false
        }
        this.setData({
            menusConf: {
                show: true,
                animation: 'show',
                zIndex: 99,
                contentAlign: 'left',
                locked: false,
                menus: this.data.menus
            }
        });
    },
    //菜单选择
    async clickMenuItem(e) {
        const m = e.currentTarget.dataset.item;
        this.data.menusConf = false;
        this.setData({
            menusConf: {
                show: false
            }
        })

        // 菜单操作控制
        if (m.id == 7) {
            if (util.isEmpty(this.data.bill.AuditedStatus) || this.data.bill.AuditedStatus != true) {
                wx.showToast({
                    title: '冲正只能对已审核单据操作',
                    icon: 'none'
                })
                return false
            }
            if (!util.isEmpty(this.data.bill.ReversedStatus) && this.data.bill.ReversedStatus == true) {
                wx.showToast({
                    title: '已经冲正单据不能再次冲正',
                    icon: 'none'
                })
                return false
            }
        } else if (m.id == 9) {
            this.onSubmitPrint()
            return false
        } else {
            let canModify = this.checkCanBillCanModify()
            if (!canModify) {
                return false
            }
        }

        switch (m.id) {
            //历史单据
            case 0: {
                if (util.isEmpty(this.data.bill.TerminalId) || this.data.bill.TerminalId <= 0) {
                    wx.showToast({
                        title: '请先选择终端',
                        icon: 'error'
                    })
                    return false
                }
                wx.navigateTo({
                    url: `/packagePages/order/pages/viewBillPage/index?defaultPageKey=${BillTypeEnum.returnBill}&title=查看历史单据&terminalId=${this.data.bill.TerminalId}`
                });
                break;
            }
            //支付方式
            case 2: {
                if (util.isEmpty(this.data.bill.items) || this.data.bill.items.length <= 0) {
                    wx.showToast({
                        title: '请先选择商品',
                        icon: 'error'
                    })
                    return false
                }
                this.openPayments()
                break;
            }
            //价格方案
            case 1:
                //欠款
            case 3:
                //优惠
            case 4:
                //备注 
            case 5:
                //冲改
            case 7: {
                if (util.isEmpty(this.data.bill.items) || this.data.bill.items.length <= 0) {
                    wx.showToast({
                        title: '请先选择商品',
                        icon: 'error'
                    })
                    return false
                }
                this.setData({
                    dialogConf: {
                        show: true,
                        type: 'confirm',
                        showTitle: true,
                        title: m.name,
                        content: '',
                        confirmText: '确定',
                        confirmColor: '#3683d6',
                        cancelText: '取消',
                        cancelColor: '#999'
                    },
                    //菜单类型
                    mtype: m.id
                })
                break;
            }
            //清空单据
            case 8: {
                this.initBill(true)
                break;
            }
            //审核
            case 6: {
                this.onAuditing()
                break;
            }
            //打印
            case 9: {
                this.onSubmitPrint()
                break;
            }
        }
    },
    openPayments() {
        const config = this.data.arccfg;
        config.show = true;
        this.setData({
            arccfg: config
        });
    },

    onReverse() {
        if (!authenticationUtil.checkPermission(MenuEnum.ReturnBillReverse)) {
            wx.showToast({
                title: '您无权限冲改',
                icon: 'error',
                duration: 5000
            })
            return false
        }
        if (!util.isEmpty(this.data.bill.Id) && this.data.bill.Id > 0) {
            let remark = ''
            if (!util.isEmpty(this.data.rushRemark)) {
                remark = this.data.rushRemark
            }
            returnBillService.ReverseAsync(this.data.bill.Id, remark).then((res) => {
                //console.log('res:', res);
                if (!util.isEmpty(res) && res.success == true && res.data.Success == true) {
                    wx.showToast({
                        title: '冲改成功',
                        icon: 'success',
                        complete: () => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '冲改失败' + res.message,
                        icon: 'none'
                    })
                }
            });
        } else {
            wx.showToast({
                title: '请重新进入页面-订单未提交或者单据信息丢失重新',
                icon: 'none'
            })
        }
    },
    onAuditing() {
        if (!authenticationUtil.checkPermission(MenuEnum.ReturnBillApproved)) {
            wx.showToast({
                title: '您无权限审核',
                icon: 'error',
                duration: 5000
            })
            return false
        }

        if (!util.isEmpty(this.data.bill.Id) && this.data.bill.Id > 0) {
            returnBillService.AuditingAsync(this.data.bill.Id).then((res) => {
                //console.log('res:', res);
                if (res.code >= 0) {
                    wx.showToast({
                        title: '审核成功',
                        icon: 'success',
                        complete: () => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '审核失败' + res.message,
                        icon: 'none'
                    })
                }
            });
        } else {
            wx.showToast({
                title: '请重新进入页面-订单未提交或者单据信息丢失重新',
                icon: 'none'
            })
        }
    },
    onChangeHandle: function (e) {
        //console.log('onChangeHandle', e.detail);
        //console.log(e.detail.cell);
        if (e.detail != null && e.detail.cell != null) {
            this.setData({
                defalutPlanPrice: e.detail.cell
            })
        }
    },
    getTerminalBalance(terminalId) {
        terminalService.getTerminalBalanceAsync(terminalId).then(res => {
            //console.log('getTerminalBalanceAsync', res)
            if (res.success == true) {
                res.data.TotalOweCashShow = res.data.TotalOweCash.toFixed(2)
                this.setData({
                    terminalBalance: res.data
                })
            }
        })
    },
    getTerminalInfo(terminalId) {
        terminalService.getTerminalAsync({
            terminalId: terminalId
        }).then(res => {
            //console.log('terminalId', res)
            if (util.isEmpty(res) || util.isEmpty(res.data) || res.success != true) {

            } else {
                this.setData({
                    'bill.TerminalBossCall': res.data.BossCall,
                    'bill.TerminalAddress': res.data.Address
                })
            }
        })
    },
    onConfirmTap() {
        //console.log('---------->' + this.data.mtype);

        if (this.data.mtype == 1) {
            let plan = this.data.defalutPlanPrice.Value;
            if (!util.isEmpty(plan)) {
                app.global.companySetting.DefaultPricePlan = plan
            } else {
                wx.showToast({
                    title: '请选择默认价格',
                    icon: 'none'
                })
            }
        } else if (this.data.mtype == 4) {
            this.setData({
                'bill.paymentMethods.PreferentialAmount': this.data.menuData.preferentialAmount
            }, () => {
                this.calcTotal(true)
            })
        } else if (this.data.mtype == 5) {
            this.setData({
                'bill.Remark': this.data.menuData.remark
            })
        } else if (this.data.mtype == 3) {
            this.setData({
                'bill.paymentMethods.OweCash': this.data.menuData.oweCash
            }, () => {
                this.calcTotal(true, true)
            })
        } else if (this.data.mtype == 7) {
            this.onReverse()
        } else {
            wx.showToast({
                title: '功能在开发中～',
                icon: 'none'
            });
        }
    },
    onCancelTap() {
        this.setData({
            menuData: {}
        })
    },
    onScan() {
        if (!this.data.billCanEdit) {
            return false
        }
        //使用原生接口扫码
        util.scanCode(1, (data) => {
            //console.log('scanCode', data)
        }, (res) => {
            //console.log('res', res)
        })
    },
    onAdd() {
        if (!this.data.billCanEdit) {
            return false
        }
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return
        }
        let t = this.data.bill.TerminalId ?? null;
        let w = this.data.bill.WareHouseId ?? null;

        //console.log(t)
        //console.log(w)
        if (util.isEmpty(t) || t <= 0) {
            wx.navigateTo({
                url: '/packagePages/common/pages/selectCustomerPage/index?type=select&navigatemark=/packagePages/bills/pages/saleBillPage/index'
            });
            return false;
        }

        if (util.isEmpty(w) || w <= 0) {
            wx.showToast({
                title: '请选择仓库！',
                icon: 'none'
            });
            return false;
        }
        wx.navigateTo({
            url: '/packagePages/common/pages/selectProductPage/index?terminalId=' + t + '&warehouseId=' + w + '&warehouseName=' + this.data.bill.WareHouseName ?? ''
        })
    },
    bindWarehousePickerChange(e) {
        //console.log('bindWarehousePickerChange', e)
        this.setData({
            'parames.warehouse.index': e.detail.value
        })
    },
    async onSubmitTap() {
        this.onSubmit()
    },
    //提交保存
    async onSubmit(isPrint = false) {
        //console.log('this.data.bill', this.data.bill)
        let resultCheck = await authenticationUtil.checkBusinessTime(BillTypeEnum.ReturnBill)
        this.setData({
            billCanEdit: resultCheck.isBillTime
        })
        if (!resultCheck.isBillTime) {
            wx.showToast({
                title: `请在业务时间${resultCheck.startTime}-${resultCheck.endTime}之间开单`,
                icon: 'none',
                duration: 5000
            })
            return false
        }
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        let bill = this.data.bill
        if (util.isEmpty(bill)) {
            wx.showToast({
                title: '单据信息错误，请重新进入该页面',
                icon: "none",
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(bill.TerminalId)) {
            wx.showToast({
                title: '请选择终端！',
                icon: 'error',
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(bill.WareHouseId)) {
            wx.showToast({
                title: '请选择仓库！',
                icon: 'error',
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(bill.items)) {
            wx.showToast({
                title: '请添加明细！',
                icon: 'error',
                duration: 5000
            })
            return false
        }
        let receive = 0
        bill.paymentMethods.selects.forEach(item => {
            receive += item.collectionAmount
        })
        if (bill.paymentMethods.SumAmount < receive) {
            wx.showToast({
                title: '收款金额大于单据总额',
                icon: 'none',
                duration: 5000
            })
            return false
        }

        var postMData = {}
        postMData.id = bill.Id ?? 0
        postMData.billNumber = bill.BillNumber ?? ''
        postMData.terminalId = bill.TerminalId
        postMData.businessUserId = bill.BusinessUserId
        postMData.deliveryUserId = bill.DeliveryUserId
        postMData.wareHouseId = bill.WareHouseId
        postMData.transactionDate = util.time()
        //todo 待处理 销售单（订单）默认售价（层次价格+价格方案）
        postMData.defaultAmountId = '0_0'
        postMData.remark = bill.Remark ?? ''
        postMData.preferentialAmount = bill.paymentMethods.PreferentialAmount
        postMData.preferentialEndAmount = bill.paymentMethods.SumAmount - bill.paymentMethods.PreferentialAmount
        postMData.oweCash = bill.paymentMethods.OweCash
        postMData.items = bill.items
        postMData.accounting = bill.paymentMethods.selects
        let advanceAmountPayment = bill.paymentMethods.selects.find(
            (element) => {
                return element.accountCodeTypeId == AccountingCodeEnum.AdvancesReceived
            }
        )
        postMData.advanceAmount = util.isEmpty(advanceAmountPayment) ? 0 : advanceAmountPayment.collectionAmount
        postMData.advanceAmountBalance = this.data.terminalBalance.AdvanceAmountBalance ?? 0
        postMData.orderId = bill.ReturnReservationBillId ?? 0
        postMData.dispatchItemId = 0
        postMData.longitude = app.global.bd09_location.lon
        postMData.latitude = app.global.bd09_location.lat
        //console.log('postData', postMData)
        let result = await returnBillService.CreateOrUpdateAsync(postMData, postMData.id).then(res => {
            //console.log('CreateOrUpdateAsync', res)
            if (res.success == true && res.data.Success == true) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    complete: () => {
                        if (!isPrint) {
                            this.setData({
                                bill: {}
                            }, () => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            })
                        }
                    }
                })
                return true
            } else {
                wx.showToast({
                    title: '提交失败' + res.message ?? '',
                    icon: 'none'
                })
                return false
            }
        })
        return result
    },

    onChangeRemark(e) {
        this.setData({
            'menuData.remark': e.detail.value
        })
    },
    onChangeRushRemark(e) {
        this.setData({
            'rushRemark': e.detail.value
        })
    },
    onChangePreferentialAmount(e) {
        this.setData({
            'menuData.preferentialAmount': e.detail.value
        })
    },
    onChangeOweCashAmount(e) {
        this.setData({
            'menuData.oweCash': e.detail.value
        })
    },
    //编辑明细
    onEdit: function (e) {
        if (!this.data.billCanEdit) {
            return false
        }
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return
        }
        //console.log('e', e)
        wx.navigateTo({
            url: `/packagePages/common/pages/editProductPage/index?product=${JSON.stringify(e.currentTarget.dataset.item)}`
        });
    },
    checkCanBillCanModify() {
        if (!util.isEmpty(this.data.bill.ReversedStatus) && this.data.bill.ReversedStatus == true) {
            wx.showToast({
                title: '已红冲单据不能操作',
                icon: 'none'
            })
            return false
        }

        if (!util.isEmpty(this.data.bill.AuditedStatus) && this.data.bill.AuditedStatus == true) {
            wx.showToast({
                title: '已审核单据不能操作',
                icon: 'none'
            })
            return false
        }
        return true
    },
    //删除明细
    onDel: function (e) {
        var arry = this.data.bill.items;
        var id = e.currentTarget.dataset.id;

        wx.lin.showDialog({
            type: 'confirm',
            title: '提示！',
            content: '确定要删除[' + id + ']吗？',
            confirmText: '是',
            confirmColor: '#3683d6',
            cancelText: '否',
            cancelColor: '#999',
            success: (res) => {
                if (res.confirm) {
                    util.arrRemoveObj(arry, arry[id]);
                    this.setData({
                        'bill.items': arry
                    });
                    wx.showToast({
                        title: "删除成功！",
                        icon: 'none'
                    });
                } else if (res.cancel) {
                    wx.showToast({
                        title: "取消操作！",
                        icon: 'none'
                    });
                }
            }
        });
    },
    //选择仓库
    showActionSheet() {
        if (!this.data.billCanEdit) {
            return false
        }
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        util.showActionSheet({
            itemList: this.data.warehouses,
            showCancel: true
        }, (item) => {
            //console.log(item)
            this.setData({
                'bill.WareHouseId': item.id,
                'bill.WareHouseName': item.name
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
    //更多支付方式
    onMorePayment: function () {
        //必须携带参数billTypeId 以指定获取相应单据的收付款方式，稍后将回写数据到当前 bill.Accountings
        wx.navigateTo({
            url: '/packagePages/common/pages/morePaymentPage/index?billTypeId=' + this.data.parames.billType
        });
    },
    //打印
    onPrint: async function () {
        //获取选择单据
        if (this.data.bill.items.length == 0) {
            wx.showToast({
                title: '无打印数据！',
                icon: 'none'
            });
            return false;
        }
        let bill = this.data.bill
        let inactive = app.global.inactive;
        //console.log('inactive', inactive)
        if (util.isNull(inactive)) {
            wx.showToast({
                title: '请连接打印机',
                icon: 'error',
                duration: 1000
            })
            return;
        }
        let items = bill.items.map(p => {
            return {
                ProductName: p.productName,
                UnitName: p.unitName,
                Quantity: p.quantity,
                IsGifts: p.isGifts,
                Remark: p.remark ?? '',
                Subtotal: p.subtotal,
            }
        })
        let billData = {
            BillNumber: bill.BillNumber,
            TerminalName: bill.TerminalName,
            BossCall: bill.TerminalBossCall ?? '',
            Address: bill.TerminalAddress ?? '',
            WareHouseName: bill.WareHouseName,
            CreatedOnUtc: bill.CreatedOnUtc,
            SumAmount: bill.paymentMethods.SumAmount,
            PreferentialAmount: bill.paymentMethods.PreferentialAmount,
            OweCash: bill.paymentMethods.OweCash,
            Remark: bill.Remark ?? '',
            BusinessUserName: bill.BusinessUserName ?? '',
            Items: items
        }
        //新方法 打印 未测试完成 
        await printMain.printBill(inactive, BillTypeEnum.ReturnBill, billData)
        return true
    },
    //提交打印
    async onSubmitPrint() {
        let that = this
        let bill = that.data.bill
        //console.log('onSubmitPrint', bill)
        if (bill.AuditedStatus) {
            that.onPrint()
            return false
        }
        wx.showModal({
            title: '提示',
            content: '将会自动提交单据是否继续打印？',
        }).then(async res => {
            if (res.confirm) {
                //提交打印
                let submit = await that.onSubmit(true)
                if (submit == true) {
                    //console.log('printFlag*******')
                    let printFlag = await that.onPrint()
                    //console.log('printFlag', printFlag)
                    if (printFlag) {
                        wx.showToast({
                            title: '打印发送成功',
                            icon: 'success',
                            duration: 3000
                        })
                        setTimeout(() => {
                            this.setData({
                                bill: {}
                            }, () => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            })
                        }, 3000);
                    } else {
                        wx.showToast({
                            title: '提交成功打印失败，请重新打印',
                            icon: 'none',
                            duration: 5000
                        })
                        setTimeout(() => {
                            this.setData({
                                bill: {}
                            }, () => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            })
                        }, 5000);

                    }
                }
            } else {
                //取消
            }
        })
    },
})