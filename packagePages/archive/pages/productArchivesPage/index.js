const app = getApp()
const util = require('../../../../utils/util')
const productService = require('../../../../services/product.service')
import PageTypeEnum from '../../../../models/pageTypeEnum'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        searchData: {
            key: '',
            categoryIds: [],
            terminalId: 0,
            wareHouseId: 0,
            pageIndex: 0,
            brand: 0,
            pageSize: app.global.pageSize,
            usablequantity: true,
            isCollect: false
        },
        catagoryId: 0,
        brandId: 0,
        imgShow: false,
        show: false,
        loading: true,
        index: 0,
        productDatas: [],
        catagory: [{
            text: '类别',
            value: 0
        }],
        brand: [{
            text: '品牌',
            value: 0
        }]
    },
    filterViewMove: function () {},

    searchBarInput(e) {
        this.setData({
            'searchData.key': e.detail.value,
            'searchData.pageIndex': 0
        }, () => {
            this.getProducts(true)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            parames: options
        });
        wx.setNavigationBarTitle({
            title: "商品档案"
        })
        this.getProducts(true)
        productService.getBrandsAsync().then(res => {
            //console.log('getbrands', res)
            if (res.success == true) {
                let temps = res.data.map(item => {
                    return {
                        text: item.Name,
                        value: item.Id
                    }
                })
                this.setData({
                    brand: this.data.brand.concat(temps)
                })
            }
        })
        productService.getAllCategoriesAsync().then(res => {
            //console.log('getAllCategoriesAsync', res)
            if (res.success == true) {
                if (res.success == true) {
                    let temps = res.data.map(item => {
                        return {
                            text: item.Name,
                            value: item.Id
                        }
                    })
                    this.setData({
                        catagory: this.data.catagory.concat(temps)
                    })
                }
                // 'searchData.categoryIds': [defaultKey],
            }
        })
    },

    onReady: function () {

    },
    onShow: function () {
        this.getProducts(true)
    },
    onHide: function () {

    },
    onUnload: function () {

    },

    onPullDownRefresh: function () {
        this.getProducts(true)
    },
    onReachBottom: function () {
        this.getMoreProducts()
    },

    onShareAppMessage: function () {

    },
    catagoryIdOptionTap(e) {
        //console.log('categoryIds', e)
        this.setData({
            'searchData.categoryIds': [e.detail],
            'searchData.pageIndex': 0
        }, () => {
            this.getProducts(true)
        })
    },
    brandIdOptionTap(e) {
        //console.log('brand', e)
        this.setData({
            'searchData.brand': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.getProducts(true)
        })
    },
    getProducts(refresh = false) {
        productService.getProductsAsync(this.data.searchData.key, this.data.searchData.categoryIds, this.data.searchData.terminalId, this.data.searchData.wareHouseId, this.data.searchData.pageIndex, this.data.searchData.pageSize, !this.data.searchData.usablequantity).then(res => {
            //console.log('getProducts', res)
            if (res.success == true) {
                let temp = this.data.productDatas
                if (temp) {
                    if (refresh) {
                        temp = []
                    }
                    res.data.Data.forEach(item => {
                        let productIndex = temp.findIndex((product => {
                            return product.Id == item.Id
                        }))
                        if (productIndex < 0) {
                            if (this.data.searchData.brand == 0 || (this.data.searchData.brand != 0 && item.BrandId == this.data.searchData.brand)) {
                                temp.push(item)
                            }
                        }
                    })
                }
                this.setData({
                    productDatas: temp
                })
            }
        })
    },
    getMoreProducts() {
        this.setData({
            'searchData.pageIndex': this.data.searchData.pageIndex + 1
        }, res => {
            this.getProducts()
        })

    },
    onEditProduct: function (e) {
        //console.log('edit', e)
        let pid = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/packagePages/archive/pages/addProductArchivePage/index?type=${PageTypeEnum.edit}&id=${pid}`
        });
    },
    onAddProduct: function () {
        wx.navigateTo({
            url: `/packagePages/archive/pages/addProductArchivePage/index?type=${PageTypeEnum.add}`
        });
    }
})