const app = getApp()
const util = require('../../../../utils/util')
const wareHousesService = require('../../../../services/wareHouses.Service')
const allocationService = require('../../../../services/allocation.service')
const authenticationUtil = require('../../../../utils/authentication.util')
import BillTypeEnum from '../../../../models/typeEnum'
import AccountingCodeEnum from '../../../../models/accountingCodeEnum'
import PageTypeEnum from '../../../../models/pageTypeEnum'
import MenuEnum from '../../../../models/menuEnum'
const printMain = require('../../../../printer/print-main')

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            pageType: PageTypeEnum.add,
            billId: 0,
            products: [],
            editProducts: [],
            deleteProducts: []
        },
        dialogConf: {},
        menusConf: {},
        bill: {
            items: []
        },
        warehouses: [],
        menus: [{
            name: '按销补货',
            id: 2,
            icon: 'label'
        }, {
            name: '按退调拨',
            id: 3,
            icon: 'label'
        }, {
            name: '按库存调拨',
            id: 4,
            icon: 'clear'
        }, {
            name: '清空单据',
            id: 5,
            icon: 'clear'
        }, {
            name: '审核',
            id: 6,
            icon: 'clear'
        }, {
            name: '冲改',
            id: 7,
            icon: 'clear'
        }, {
            name: '打印',
            id: 8,
            icon: 'printer'
        }]
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "调拨单"
        })

        this.setData({
            'parames.pageType': options.pageType ?? PageTypeEnum.add,
            'parames.billId': options.billId ?? 0,
        }, () => {
            this.initBill()
        })
        //加载仓库信息
        wareHousesService.getWareHousesAsync(BillTypeEnum.AllocationBill).then(res => {
            //console.log('ware', res)
            let tempWare = [{
                id: 0,
                name: '请选择仓库'
            }]
            if (res.success == true) {
                let wares = res.data.map(w => {
                    return {
                        id: w.Id,
                        name: w.Name
                    }
                })
                this.setData({
                    warehouses: tempWare.concat(wares)
                })
            }
        })

        if (!util.isNull(options)) {
            //获取回传商品集合
            if (!util.isNull(options.products)) {
                let p = JSON.parse(options.products);
                this.setData({
                    'parames.products': p,
                });
            }
            //获取回传终端
            if (!util.isNull(options.terminal)) {
                let t = JSON.parse(options.terminal);
                this.setData({
                    'parames.terminal': t,
                });
            }
        }
    },
    onReady: function () {

    },
    async initBill(clear = false) {
        let bill = {
            Id: 0,
            BillTypeId: BillTypeEnum.AllocationBill,
            BillNumber: util.getBillNumber(BillTypeEnum.properties[BillTypeEnum.AllocationBill].code, app.global.storeId ?? 0),
            ShipmentWareHouseId: 0,
            ShipmentWareHouseName: '请选择出货仓',
            IncomeWareHouseId: 0,
            IncomeWareHouseName: '请选择入货仓',
            CreatedOnUtc: util.time(),
            AllocationByMinUnit: false,
            Remark: '',
            MakeUserId: app.global.userId,
            MakeUserName: app.global.userInfo.userRealName,
            BusinessUserId: app.global.userId,
            BusinessUserName: app.global.userInfo.userRealName,
            items: []
        }
        let pms = this.data.parames
        let stb = app.global.allocationBill
        let removeMenuIds = []
        if (pms.pageType == PageTypeEnum.add) {
            removeMenuIds = [6, 7]
        } else if ((pms.pageType == PageTypeEnum.edit || pms.pageType == PageTypeEnum.check) && !clear) {
            removeMenuIds = []
            if (!util.isEmpty(pms.billId) && pms.billId > 0) {
                await allocationService.getAllocationBill(pms.billId).then((res) => {
                    //console.log('res:', res);
                    if (res.code >= 0) {
                        bill = res.data
                        if (util.isEmpty(bill.AuditedStatus) || bill.AuditedStatus == false) {
                            removeMenuIds = removeMenuIds.concat([7])
                        }
                        if (!util.isEmpty(bill.AuditedStatus) && bill.AuditedStatus == true) {
                            removeMenuIds = removeMenuIds.concat([1, 2, 3, 4, 5, 6])
                        }
                        if (!util.isEmpty(bill.ReversedStatus) && bill.ReversedStatus == true) {
                            removeMenuIds = removeMenuIds.concat([1, 2, 3, 4, 5, 6, 7])
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
                                // temp.price = p.Price
                                // temp.amount = p.Amount
                                temp.remark = p.Remark
                                // temp.bigUnitId = p.BigUnitId
                                // temp.smallUnitId = p.SmallUnitId
                                // temp.subtotal = p.Amount
                                items.push(temp)
                            })
                            bill.items = items
                        }
                    } else {
                        wx.showToast({
                            title: '获取单据信息失败' + res.message,
                        })
                    }
                })
            }
        }

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
        bill.CreatedOnUtcStr = ''
        if (bill.CreatedOnUtc) {
            bill.CreatedOnUtcStr = util.dateFormatYYYYMMDD(bill.CreatedOnUtc)
        }
        this.setData({
            bill: bill
        })
    },
    onChangeRemark(e) {
        this.setData({
            'bill.Remark': e.detail.value
        })
    },
    onShow: function () {
        //console.log('data', this.data)
        if (!util.isEmpty(this.data.parames.terminal)) {
            this.setData({
                'searchData.terminalId': this.data.parames.terminal.Id,
                'searchData.terminalName': this.data.parames.terminal.Name,
                'searchData.pageIndex': 0
            }, () => {
                this.getTerminalBalance(this.data.parames.terminal.Id)
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
                    //调拨单暂时不根据价格自动添加备注
                    // if (temp.isGifts && (util.isEmpty(temp.remark)))
                    //     temp.remark = "赠品(零元开单)";
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
                    //调拨单暂时不根据价格自动添加备注
                    // if (temp.isGifts && (util.isEmpty(temp.remark)))
                    //     temp.remark = "赠品(零元开单)";
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
                    if (editProduct.remarkId != '0') {
                        editProduct.remark = p.remark
                    }
                    editProduct.remarkId = p.remarkId
                }
            })
            this.setData({
                'bill.items': billItems,
                'parames.editProducts': []
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
                })
            })
        }
    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },

    //选择入仓库
    showActionSheetIn() {
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        util.showActionSheet({
            itemList: this.data.warehouses,
            showCancel: true
        }, (item) => {
            //console.log(item)
            let outWare = this.data.bill.ShipmentWareHouseId
            if (outWare == item.id) {
                wx.showToast({
                    title: '入仓和出仓相同',
                    icon: 'error'
                })
            } else {
                this.setData({
                    'bill.IncomeWareHouseId': item.id,
                    'bill.IncomeWareHouseName': item.name
                });
            }
        });
    },
    //选择出仓库
    showActionSheetOut() {
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        util.showActionSheet({
            itemList: this.data.warehouses,
            showCancel: true
        }, (item) => {
            //console.log(item)
            let inWare = this.data.bill.IncomeWareHouseId
            if (inWare == item.id) {
                wx.showToast({
                    title: '出仓和入仓相同',
                    icon: 'error'
                })
            } else {
                this.setData({
                    'bill.ShipmentWareHouseId': item.id,
                    'bill.ShipmentWareHouseName': item.name
                });
            }
        });
    },
    onShowPopupMenus(e) {
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
    //菜单选择
    clickMenuItem(e) {
        const m = e.currentTarget.dataset.item;

        this.data.menusConf = false;
        this.setData({
            menusConf: {
                show: false
            }
        })

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
        } else if (m.id == 8) {
            //打印
            this.onSubmitPrint()
            return false
        } else {
            let canModify = this.checkCanBillCanModify()
            if (!canModify) {
                return false
            }
        }


        if (m.id == 6) {
            //审核
            this.onAuditing()
            return false
        } else if (m.id == 7) {
            //冲正
            this.onReverse()
            return false
        }
        switch (m.id) { //清空单据
            case 5: {
                this.initBill(true)
                break;
            }
            //审核
            case 6: {
                this.onAuditing()
                break;
            }
            //冲改
            case 7: {
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
            //打印
            case 8: {
                this.onSubmitPrint()
                break;
            }
            default: {
                wx.showToast({
                    title: m.name,
                    icon: 'none'
                })
            }
        }
    },
    onAuditing() {
        if (!authenticationUtil.checkPermission(MenuEnum.AllocationFormApproved)) {
            wx.showToast({
                title: '您无权限审核',
                icon: 'error',
                duration: 5000
            })
            return false
        }

        if (!util.isEmpty(this.data.bill.Id) && this.data.bill.Id > 0) {
            allocationService.auditingAsync(this.data.bill.Id).then((res) => {
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
    onReverse() {
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
        if (!authenticationUtil.checkPermission(MenuEnum.AllocationFormReverse)) {
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
            allocationService.reverseAsync(this.data.bill.Id, remark).then((res) => {
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
    // 取消确认
    onCancelTap() {
        setTimeout(() => {
            wx.showToast({
                title: '点击了取消～',
                icon: 'none'
            });
        }, 100);
    },

    //扫码
    onScan() {},

    //添加商品明细
    onAdd() {
        let inWare = this.data.bill.IncomeWareHouseId ?? 0
        let outWare = this.data.bill.ShipmentWareHouseId ?? 0
        if (inWare <= 0 || outWare <= 0) {
            wx.showToast({
                title: '请选择仓库',
                icon: 'error'
            });
            return false;
        }
        let transferParams = {
            inWareId: inWare,
            outWareId: outWare,
            inWareName: this.data.bill.IncomeWareHouseName,
            outWareName: this.data.bill.ShipmentWareHouseName
        }
        wx.navigateTo({
            url: '/packagePages/common/pages/selectProductPage/index?warehouseId=' + outWare + '&billType=' + BillTypeEnum.AllocationBill + '&transferParams=' + JSON.stringify(transferParams)
        })
    },
    async onSubmitTap() {
        this.onSubmit()
    },
    //提交保存
    async onSubmit(isPrint = false) {
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return false
        }
        let bill = this.data.bill
        let inWare = bill.IncomeWareHouseId ?? 0
        let outWare = bill.ShipmentWareHouseId ?? 0
        if (inWare <= 0 || outWare <= 0) {
            wx.showToast({
                title: '请选择仓库',
                icon: 'error'
            });
            return false;
        }
        if (bill.items.length <= 0) {
            wx.showToast({
                title: '请添加调拨商品',
                icon: 'error'
            });
            return false;
        }
        let zeroProduct = bill.items.find(p => p.quantity <= 0)
        if (zeroProduct) {
            wx.showToast({
                title: '请检查调拨商品数量',
                icon: 'none'
            });
            return false;
        }
        let items = bill.items.map(p => {
            return {
                Quantity: p.quantity,
                // SmallUnitId: p.SmallUnitId,
                // BigUnitId: p.bigUnitId,
                ProductId: p.productId,
                UnitId: p.unitId,
                Remark: p.remark
                // Subtotal:p.Subtotal
            }
        })
        let postData = {
            BillNumber: bill.BillNumber,
            ShipmentWareHouseId: bill.ShipmentWareHouseId,
            IncomeWareHouseId: bill.IncomeWareHouseId,
            CreatedOnUtc: bill.CreatedOnUtc,
            AllocationByMinUnit: false,
            Remark: bill.Remark,
            Items: items
        }
        //console.log('postData', postData)
        let result = await wareHousesService.createOrUpdateAsync(postData, bill.Id).then(res => {
            //console.log('createorupdate', res)
            if (!util.isEmpty(res) && res.success == true && res.data.Success == true) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success'
                })
                if (!isPrint) {
                    wx.navigateBack({
                        delta: 1,
                    })
                }
                return true
            } else {
                wx.showToast({
                    title: '提交失败' + res?.data?.Message ?? '',
                    icon: 'none',
                    duration: 5000
                })
                return false
            }
        })
        return result

    },

    //编辑明细
    onEdit: function (e) {
        let canModify = this.checkCanBillCanModify()
        if (!canModify) {
            return
        }
        //console.log('e', e)
        wx.navigateTo({
            url: `/packagePages/common/pages/editAllocationProductPage/index?product=${JSON.stringify(e.currentTarget.dataset.item)}`
        });
    },

    //删除明细
    onDel: function (e) {

        var arry = this.data.saleBillItems;
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
                        saleBillItems: arry
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
    //打印
    onPrint: async function () {
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

        //调拨测试
        // let test_31 = {
        //     BillNumber: 'XS2021034343434343',
        //     BossCall: '13958595599',
        //     TerminalName: '桃心岛商场',
        //     Address: '陕西省汉中市天汉大道',
        //     WareHouseName: '主仓库',
        //     CreatedOnUtc: util.time(),
        //     ShipmentWareHouseName: '主仓库',
        //     IncomeWareHouseName: '主仓库2',
        //     MakeUserName: '小李',
        //     Items: [{
        //         ProductName: '雪花勇闯天涯500ML1*12',
        //         UnitName: '箱',
        //         Quantity: 10,
        //         Subtotal: '赠品'
        //     }]
        // }
        let items = bill.items.map(p => {
            return {
                ProductName: p.productName,
                UnitName: p.unitName,
                Quantity: p.quantity,
                Subtotal: p.subtotal ?? '',
            }
        })
        let billData = {
            BillNumber: bill.BillNumber,
            BossCall: 'bosscall',
            TerminalName: 'TerminalName',
            Address: 'TerminalAddress',
            WareHouseName: 'WareHouseName',
            CreatedOnUtc: bill.CreatedOnUtc,
            ShipmentWareHouseName: bill.ShipmentWareHouseName,
            IncomeWareHouseName: bill.IncomeWareHouseName,
            Remark: bill.Remark ?? '',
            MakeUserName: bill.MakeUserName ?? '',
            Items: items
        }
        //新方法打印 判断蓝牙状态并连接
        await printMain.printBill(inactive, BillTypeEnum.AllocationBill, billData)
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