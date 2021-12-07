const productService = require('../../../../services/product.service')
const util = require('../../../../utils/util')
const settingService = require('../../../../services/setting.service')
import PriceTypeEnum from '../../../../models/priceTypeEnum'
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        editProduct: {},
        baseProduct: {},
        productDatas: [],
        remarks: [],
        editDisabled: false,
        editPriceDisabled: false
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "修改商品"
        })
        if (util.isEmpty(options.product)) {
            wx.showToast({
                title: '修改商品无效',
                icon: 'error'
            })
            return false
        }
        let product = JSON.parse(options.product)
        //console.log('product', product)
        if (util.isEmpty(product) || product.productId == 0 || util.isEmpty(product.uuid)) {
            wx.showToast({
                title: '修改无效商品',
                icon: 'error'
            })
        } else {
            productService.getProductByIdAsync(product.productId).then(res => {
                //console.log('getProductByIdAsync', res)
                if (res.success == true) {
                    let units = []
                    for (const key in res.data.Units) {
                        if (res.data.Units[key] != 0) {
                            units.push({
                                id: res.data.Units[key],
                                name: key
                            })
                        }
                    }

                    this.setData({
                        baseProduct: res.data,
                        units: units
                    }, () => {
                        //console.log(this.data)
                    })
                }
            })
            settingService.getRemarkConfigList().then(res => {
                //console.log('getRemarkConfigList', res)
                let remark = res.find(item => item.Name == product.remark);
                if (util.isEmpty(remark) && util.isEmpty(product.remark)) {
                    product.remarkId = 0;
                    product.remark = '备注'
                } else if ((util.isEmpty(remark) && !util.isEmpty(product.remark))) {
                    product.remarkId = 0;
                } else {
                    product.remarkId = remark.Id
                }
                let editDisabled = false
                let editPriceDisabled = false
                if (product.campaignId > 0) {
                    editDisabled = true
                    if (product.isGifts == true) {
                        editPriceDisabled = true
                    }
                }
                this.setData({
                    remarks: res,
                    editProduct: product,
                    editDisabled: editDisabled,
                    editPriceDisabled: editPriceDisabled
                })
            })
        }

    },
    //ActionSheet菜单
    _showActionSheet({
        itemList,
        showCancel = false,
        title = '请选择单位',
        locked = false
    }) {
        wx.lin.showActionSheet({
            itemList: itemList,
            showCancel: showCancel,
            title: title,
            locked,
            success: (res) => {
                let w = {
                    Id: res.item.id,
                    Name: res.item.name,
                };
                let oldUnitId = this.data.editProduct.unitId
                this.setData({
                    'editProduct.unitId': res.item.id,
                    'editProduct.unitName': res.item.name
                }, () => {
                    if (oldUnitId != res.item.id) {
                        this.calcSubtotal(oldUnitId)
                    }
                });

            },
            fail: (res) => {
                console.error(res);
            }
        });
    },
    //ActionSheet菜单
    showActionSheet() {
        this._showActionSheet({
            itemList: this.data.units,
            showCancel: true
        });
    },
    pricesShowActionSheet(e) {
        let product = this.data.editProduct
        let currtP = this.data.baseProduct
        //console.log(currtP)

        let prices = []
        let index = 0;
        let tag = ''
        if (product.unitId == currtP.bigOption.Id) {
            tag = 'big'
        } else if (product.unitId == currtP.strokeOption.Id) {
            tag = 'stroke'
        } else if (product.unitId == currtP.smallOption.Id) {
            tag = 'small'
        }
        currtP.ProductTierPrices.forEach(item => {
            let id = item.PriceTypeId
            if (item.PriceTypeId == PriceTypeEnum.CustomPlan) {
                id = item.PriceTypeId + index
                index++
            }
            if (tag == "big" && item.BigUnitPrice != 0) {
                prices.push({
                    id: id,
                    name: item.PriceTypeName,
                    value: item.BigUnitPrice
                })
            } else if (tag == "stroke" && item.StrokeUnitPrice != 0) {
                prices.push({
                    id: id,
                    name: item.PriceTypeName,
                    value: item.StrokeUnitPrice
                })
            } else if (tag == "small" && item.SmallUnitPrice != 0) {
                prices.push({
                    id: id,
                    name: item.PriceTypeName,
                    value: item.SmallUnitPrice
                })
            }
        })
        util.showActionSheet({
            itemList: prices,
            showCancel: true
        }, (priceSet) => {
            if (!util.isEmpty(priceSet)) {
                //console.log('showActionSheet', priceSet)
                this.setData({
                    'editProduct.price': priceSet.value
                }, () => {
                    this.calcSubtotal()
                })
            }

        });
    },
    calcSubtotal(unitId = 0) {
        let product = this.data.editProduct
        let baseProduct = this.data.baseProduct
        if (unitId != 0) {
            let oldConvert = 1
            let newConvert = 1
            if (unitId == baseProduct.bigOption.Id) {
                oldConvert = baseProduct.bigOption.ConvertedQuantity
            } else if (unitId == baseProduct.strokeOption.Id) {
                oldConvert = baseProduct.strokeOption.ConvertedQuantity
            }
            if (product.unitId == baseProduct.bigOption.Id) {
                newConvert = baseProduct.bigOption.ConvertedQuantity
            } else if (product.unitId == baseProduct.strokeOption.Id) {
                newConvert = baseProduct.strokeOption.ConvertedQuantity
            }
            if (oldConvert != newConvert) {
                product.price = Math.ceil((product.price / oldConvert) * newConvert * 100) / 100
            }
        }
        product.amount = product.price * product.quantity
        product.subtotal = product.amount
        this.setData({
            editProduct: product
        })
    },
    onReady: function () {

    },

    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onSubmit() {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage.setData({
            'parames.editProducts': [this.data.editProduct]
        })
        wx.navigateBack({
            delta: 1
        })
    },
    onDel() {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage.setData({
            'parames.deleteProducts': [this.data.editProduct]
        })
        wx.navigateBack({
            delta: 1
        })
    },

    onPriceInput(e) {
        this.setData({
            'editProduct.price': e.detail.value
        }, () => {
            this.calcSubtotal()
        })
    },
    onQuantityInput(e) {
        this.setData({
            'editProduct.quantity': e.detail.value
        }, () => {
            this.calcSubtotal()
        })
    },
    onRemarkChange(e) {
        let remark = this.data.remarks[e.detail.value]
        this.setData({
            'editProduct.remarkId': remark.Id,
            'editProduct.remark': remark.Name
        })
    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})