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
        units: []
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
                this.setData({
                    'editProduct.unitId': res.item.id,
                    'editProduct.unitName': res.item.name
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
    onQuantityInput(e) {
        this.setData({
            'editProduct.quantity': e.detail.value
        })
    },
    onRemarkChange(e) {
        let remark = this.data.remarks[e.detail.value]
        //console.log('onRemarkChange', remark)
        this.setData({
            'editProduct.remarkId': remark.Id,
            'editProduct.remark': remark.Name
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
    onReady: function () {

    },
    onShow: function () {

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

    }
})