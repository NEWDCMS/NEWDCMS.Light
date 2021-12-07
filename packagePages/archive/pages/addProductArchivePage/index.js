// pages/archive/pages/addProductArchivePage/index.js
const app = getApp()
const util = require('../../../../utils/util')
const productService = require('../../../../services/product.service')
const FormData = require('../../../../utils/wx-formdata/formData')
import PageTypeEnum from '../../../../models/pageTypeEnum'
import PriceTypeEnum from '../../../../models/priceTypeEnum'
Page({

    data: {
        parames: {
            title: '',
            pageType: '',
            navigatemark: ''
        },
        show: false,
        catagories: [],
        brands: [],
        bigOptions: [],
        strokOptions: [],
        smallOptions: [],
        product: {
            Id: 0,
            ProductId: 0,
            StoreId: app.global.storeId,
            ProductName: '',
            Name: '',
            MnemonicCode: '',
            ProductCode: '',
            CategoryId: 0,
            CategoryName: '',
            BrandId: 0,
            BrandName: '',
            BigQuantity: 0,
            StrokeQuantity: 0,
            SmallUnitId: 0,
            SmallUnitName: '',
            StrokeUnitId: 0,
            StrokeUnitName: '',
            BigUnitId: 0,
            BigUnitName: '',
            SmallBarCode: '',
            StrokeBarCode: '',
            BigBarCode: '',
            Status: true,
            SmallPurchasePrice: 0,
            StrokePurchasePrice: 0,
            BigPurchasePrice: 0,
            ProductImages:0

        }

    },
    onLoad: function (options) {
        let title = '维护商品档案'
        if (options.type == PageTypeEnum.add) {
            title = '添加商品档案'
        } else if (options.type == PageTypeEnum.edit) {
            title = '编辑商品档案'
        }
        wx.setNavigationBarTitle({
            title: title
        })
        this.setData({
            'parames.pageType': options.type,
            'parames.id': options.id ?? 0
        }, res => {
            this.initProduct()
        })

        productService.getBrandsAsync().then(res => {
            //console.log('getbrands', res)
            if (res.success == true) {
                let temps = res.data.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    }
                })
                this.setData({
                    brands: temps
                })
            }
        })
        productService.getAllCategoriesAsync().then(res => {
            //console.log('getAllCategoriesAsync', res)
            if (res.success == true) {
                let temps = res.data.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    }
                })
                this.setData({
                    catagories: temps
                })
            }

        })
        productService.getSpecificationAttributeOptionsAsync().then(res => {
            //console.log('getSpecificationAttributeOptionsAsync', res)
            if (res.success == true) {
                let bigTemps = res.data.bigOptions.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    }
                })
                let strokTemps = res.data.strokOptions.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    }
                })
                let smaillTemps = res.data.smallOptions.map(item => {
                    return {
                        id: item.Id,
                        name: item.Name
                    }
                })
                this.setData({
                    bigOptions: bigTemps,
                    strokOptions: strokTemps,
                    smallOptions: smaillTemps
                })
            }
        })
    },
    initProduct() {
        if (this.data.parames.pageType == PageTypeEnum.add) {

        } else if (this.data.parames.pageType == PageTypeEnum.edit) {
            if (this.data.parames.id == 0) {
                wx.showToast({
                    title: '编辑数据ID无效',
                    icon: 'none'
                })
                return
            }
            productService.getProductByIdAsync(this.data.parames.id).then(res => {
                //console.log('getProductByIdAsync', res)
                if (res.success == true) {
                    let productTemp = {
                        Id: res.data.Id,
                        ProductId: res.data.Id,
                        StoreId: res.data.storeId,
                        ProductName: res.data.ProductName,
                        Name: res.data.Name,
                        ProductCode: res.data.ProductCode,
                        MnemonicCode: res.data.MnemonicCode,
                        CategoryId: res.data.CategoryId,
                        CategoryName: res.data.CategoryName,
                        BrandId: res.data.BrandId,
                        BrandName: res.data.BrandName,
                        BigQuantity: res.data.BigQuantity,
                        StrokeQuantity: res.data.StrokeQuantity,
                        SmallUnitId: res.data.SmallUnitId,
                        SmallUnitName: res.data.smallOption.Name,
                        StrokeUnitId: res.data.StrokeUnitId,
                        StrokeUnitName: res.data.strokeOption.Name,
                        BigUnitId: res.data.BigUnitId,
                        BigUnitName: res.data.bigOption.Name,
                        SmallBarCode: res.data.SmallBarCode,
                        StrokeBarCode: res.data.StrokeBarCode,
                        BigBarCode: res.data.BigBarCode,
                        Status: res.data.Status,
                        ProductImages: res.data.ProductImages,
                        SmallPurchasePrice:res.data.SmallProductPrices.PurchasePrice,
                        StrokePurchasePrice:res.data.StrokeProductPrices.PurchasePrice,
                        BigPurchasePrice:res.data.BigProductPrices.PurchasePrice
                    }
                    if (!util.isEmpty(res.data.ProductImages)) {
                        productTemp.PhotoUrl = [`${app.config['resourceDownloadApi']}${res.data.ProductImages}`]
                    }
                    this.setData({
                        product: productTemp
                    })
                }
            })
        }
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

    },
    //添加商品
    async onSubmit() {
        let product = this.data.product
        if (util.isEmpty(product.ProductImages)) {
            wx.showToast({
                title: '请选择商品图片',
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(product.Name)) {
            wx.showToast({
                title: '请输入商品名称',
                duration: 5000
            })
            return false
        }

        if (util.isEmpty(product.MnemonicCode)) {
            wx.showToast({
                title: '请输入商品简称',
                duration: 5000
            })
            return false
        }

        if (util.isEmpty(product.CategoryId)) {
            wx.showToast({
                title: '请选择商品类别',
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(product.BrandId)) {
            wx.showToast({
                title: '请选择商品品牌',
                duration: 5000
            })
            return false
        }
        if (util.isEmpty(product.SmallUnitId)) {
            wx.showToast({
                title: '请选择商品小单位',
                icon: 'none',
                duration: 5000
            })
            return false
        }

        if (util.isEmpty(product.SmallPurchasePrice)) {
            wx.showToast({
                title: '请输入商品小单位进价',
                icon: 'none',
                duration: 5000
            })
            return false
        }

        if (util.isEmpty(product.SmallBarCode)) {
            wx.showToast({
                title: '请输入商品小单位条码',
                icon: 'none',
                duration: 5000
            })
            return false
        }

        product.ProductName = product.Name
        let unitPrices = new Map()
        unitPrices['Small_UnitId'] = product.SmallUnitId
        unitPrices['Small_TradePrice'] = 0
        unitPrices['Small_RetailPrice'] = 0
        unitPrices['Small_FloorPrice'] = 0
        unitPrices['Small_PurchasePrice'] = product.SmallPurchasePrice
        unitPrices['Small_CostPrice'] = 0
        unitPrices['Small_SALE1'] = 0
        unitPrices['Small_SALE2'] = 0
        unitPrices['Small_SALE3'] = 0
        unitPrices['Stroke_UnitId'] = product.StrokeUnitId
        unitPrices['Stroke_TradePrice'] = 0
        unitPrices['Stroke_RetailPrice'] = 0
        unitPrices['Stroke_FloorPrice'] = 0
        unitPrices['Stroke_PurchasePrice'] = product.StrokePurchasePrice
        unitPrices['Stroke_CostPrice'] = 0
        unitPrices['Stroke_SALE1'] = 0
        unitPrices['Stroke_SALE2'] = 0
        unitPrices['Stroke_SALE3'] = 0
        unitPrices['Big_UnitId'] = product.BigUnitId
        unitPrices['Big_TradePrice'] = 0
        unitPrices['Big_RetailPrice'] = 0
        unitPrices['Big_FloorPrice'] = 0
        unitPrices['Big_PurchasePrice'] = product.BigPurchasePrice
        unitPrices['Big_CostPrice'] = 0
        unitPrices['Big_SALE1'] = 0
        unitPrices['Big_SALE2'] = 0
        unitPrices['Big_SALE3'] = 0
        product.UnitPriceDicts = unitPrices
        productService.createOrUpdateAsync(product).then(res => {
            //console.log('******create*****', res)
            if (!util.isEmpty(res.data) && res.data.Success == true) {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    complete: res => {
                        wx.navigateBack()
                    }
                });
            } else {
                let message = ''
                if (!util.isEmpty(res.message)) {
                    message = res.message
                }
                wx.showToast({
                    title: `提交失败${message}`,
                    icon: 'none',
                    duration: 5000
                })
            }
        })
        // wx.showToast({
        //     title: '添加成功',
        //     icon: 'success'
        // });
    },
    clear() {
        this.setData({
            clear: true
        });
    },
    onClearTap(e) {
        if (e.detail) {
            wx.lin.showToast({
                title: '清除图片成功',
                icon: 'success',
                duration: 2000,
                iconStyle: 'color:#7ec699; size: 60'
            });
        }
    },
    onRemoveTap(e) {
        const index = e.detail.index;
        wx.lin.showMessage({
            type: 'error',
            content: `删除下标为${index}图片~`,
            duration: 1500,
            icon: 'warning'
        });
    },
    showActionSheetBigUnit(e) {
        util.showActionSheet({
            itemList: this.data.bigOptions,
            showCancel: true
        }, (item) => {
            this.setData({
                'product.BigUnitName': item.name,
                'product.BigUnitId': item.id,
            });
        });
    },
    showActionSheetStrokeUnit(e) {
        util.showActionSheet({
            itemList: this.data.strokOptions,
            showCancel: true
        }, (item) => {
            this.setData({
                'product.StrokeUnitName': item.name,
                'product.StrokeUnitId': item.id,
            });
        });
    },
    showActionSheetSmallUnit(e) {
        util.showActionSheet({
            itemList: this.data.smallOptions,
            showCancel: true
        }, (item) => {
            this.setData({
                'product.SmallUnitName': item.name,
                'product.SmallUnitId': item.id,
            });
        });
    },
    showActionSheetbrands(e) {
        util.showActionSheet({
            itemList: this.data.brands,
            showCancel: true
        }, (item) => {
            this.setData({
                'product.BrandName': item.name,
                'product.BrandId': item.id,
            });
        });
    },
    showActionSheetcatagories(e) {
        util.showActionSheet({
            itemList: this.data.catagories,
            showCancel: true
        }, (item) => {
            this.setData({
                'product.CategoryName': item.name,
                'product.CategoryId': item.id,
            });
        });
    },

    photoChange(res) {
        //console.log('photoChange', res)
        let imageTemp = res.detail.current[0]
        //console.log('photoChange', imageTemp)
        //new一个FormData对象
        let formData = new FormData();
        //调用它的append()方法来添加字段或者调用appendFile()方法添加文件
        formData.appendFile("file", imageTemp);
        let data = formData.getData();
        //添加完成后调用它的getData()生成上传数据，之后调用小程序的wx.request提交请求
        wx.request({
            method: 'POST',
            url: `${app.config['resourceUploadApi']}${app.global.storeId}`,
            header: {
                'Authorization': `${app.global.token ? 'Bearer '+app.global.token : 'Basic 123123'}`,
                'content-type': data.contentType
            },
            data: data.buffer,
            success: res => {
                //console.log('request', res)
                let tempPhotos = ''
                let photoId = ''
                if (!util.isEmpty(res) && res.data.success == true) {
                    photoId = res.data.data.Id
                    tempPhotos = [`${app.config['resourceDownloadApi']}${photoId}`]
                    this.setData({
                        'product.PhotoUrl': tempPhotos,
                        'product.ProductImages': photoId
                    })
                } else {
                    wx.showToast({
                        title: '上传照片失败',
                        icon: 'none'
                    });
                }
            },
            fail: res => {
                //console.log('up fail', res)
                wx.showToast({
                    title: '上传照片失败' + JSON.stringify(res),
                    icon: 'none',
                    duration: 5000
                });
            }

        });
    },
    onInput(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        //console.log('oninput', e)
        let productTemp = this.data.product
        if (util.isEmpty(value)) {
            value = ''
        }
        this.buildModel(productTemp, tag, e.detail.value);
        this.setData({
            product: productTemp
        })
    },

    buildModel: function (model, tag, value) {
        for (const i in model) {
            if (model[i] != null) {
                if (model[i].constructor != Object && i == tag) {
                    model[i] = value
                }
            }
        }
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
    }
})