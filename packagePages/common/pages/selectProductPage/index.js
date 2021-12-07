// pages/common/pages/selectProductPage/index.js
const app = getApp()
const util = require('../../../../utils/util')
const productService = require('../../../../services/product.service')
const {
    default: BillTypeEnum
} = require('../../../../models/typeEnum')

const cache_like_key = 'DCMS_LIKEPRODUCTS'

Page({

    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            wareHouseId: 0,
            billType: 0,
            transferParams: ''
        },
        searchData: {
            key: '',
            categoryIds: [],
            terminalId: 0,
            wareHouseId: 0,
            pageIndex: 0,
            pageSize: app.global.pageSize,
            usablequantity: false,
            isCollect: false
        },
        categoryHeight: 100,
        selectedProducts: [],
        likeProducts: [],
        catagorieDefaultKey: 0,
        catagories: [],
        showStockId: 0,
        showFllowId: 0,
        showStocks: [{
            value: 0,
            text: '只显示库存商品'
        }, {
            value: 1,
            text: '是'
        }, {
            value: 2,
            text: '否'
        }],
        showFllows: [{
            value: 0,
            text: '只显示收藏商品'
        }, {
            value: 1,
            text: '是'
        }, {
            value: 2,
            natextme: '否'
        }],
        imgShow: false,
        show: false,
        loading: true,
        showGift: true
    },
    searchBarClear() {
        this.setData({
            'searchData.key': '',
            'searchData.pageIndex': 0
        }, () => {
            this.getProducts(true)
        })
    },
    searchBarInput(e) {
        this.setData({
            'searchData.key': e.detail.value,
            'searchData.pageIndex': 0
        }, () => {
            this.getProducts(true)
        })
    },
    onUsableInventoryChange(e) {
        //console.log('onUsableInventoryChange', e)
        let collect = false
        let usablequantity = false
        if (e.detail.key == 'collect') {
            collect = e.detail.checked
            usablequantity = false
        } else if (e.detail.key == 'zerostock') {
            collect = false
            usablequantity = e.detail.checked
        }
        this.setData({
            'searchData.isCollect': collect,
            'searchData.usablequantity': usablequantity,
            'searchData.pageIndex': 0
        }, res => {
            this.getProducts(true)
        })
    },
    //复选框选择商品  
    change(e) {
        //TODO 复选框选中
        //console.log('change', e)
        let id = e.detail.key;
        //console.log('id', id)
        let tempSelectedProducts = this.data.selectedProducts;
        let selectIndex = tempSelectedProducts.findIndex(item => item.Id == id);
        if (this.data.searchData.categoryIds.length > 0) {
            let temp = this.data.catagories.find(item => item.Id == this.data.searchData.categoryIds[0])
            temp.productDatas.forEach(item => {
                if (item.Id == id) {
                    item.checked = e.detail.checked;
                    if (!e.detail.checked) {
                        tempSelectedProducts.splice(selectIndex, 1)
                    } else {
                        tempSelectedProducts.push(item)
                    }
                }
            })
            const s = temp.productDatas.filter(m => {
                return m.checked === true
            });
            temp.badgeCount = s.length
            this.setData({
                selectedProducts: tempSelectedProducts,
                catagories: this.data.catagories
            });
            return false
        }
    },

    //收藏商品
    onLike(e) {
        let p = e.currentTarget.dataset.key;
        let id = p.Id;
        let templikeProducts = this.data.likeProducts;
        let selectIndex = templikeProducts.findIndex(item => item.Id == id);
        let temp = this.data.catagories.find(item => item.Id == this.data.searchData.categoryIds[0])

        let like = e.currentTarget.dataset.like
        //console.log('like', like)

        temp.productDatas.forEach(s => {
            if (s.Id == id) {
                s.like = !s.like;
                if (like) {
                    templikeProducts.splice(selectIndex, 1)
                } else {
                    templikeProducts.push(s)
                }
            }
        })
        //console.log('templikeProducts', templikeProducts)
        this.setData({
            likeProducts: templikeProducts,
            catagories: this.data.catagories
        });
        //存储本地
        wx.setStorageSync(cache_like_key, templikeProducts)

        wx.showToast({
            title: like ? "已取消！" : "已收藏！",
            icon: like ? "none" : "success"
        });
    },
    //添加商品
    onAdd() {
        if (this.data.selectedProducts.length == 0) {
            wx.showToast({
                title: "请选择商品",
                icon: 'none'
            });
            return false;
        }
        //console.log('selectedProducts', this.data.selectedProducts)
        let productsId = this.data.selectedProducts.map(item => item.Id);
        wx.setStorageSync('selectedProducts', this.data.selectedProducts)
        if (this.data.parames.billType == BillTypeEnum.AllocationBill) {
            wx.navigateTo({
                url: `/packagePages/common/pages/addAllocationProductPage/index?products=${JSON.stringify(productsId)}&transferParams=${this.data.parames.transferParams??''}`
            })
        } else {
            wx.navigateTo({
                url: '/packagePages/common/pages/addProductPage/index?products=' + JSON.stringify(productsId) + '&navigatemark=' + this.data.parames.navigatemark
            })
        }
    },
    onLoad: async function (options) {

        wx.setNavigationBarTitle({
            title: "选择商品"
        })

        var likes = wx.getStorageSync(cache_like_key)
        if (!util.isNull(likes)) {
            this.setData({
                likeProducts: likes
            })
        }

        if (!util.isNull(options)) {
            if (!util.isNull(options.navigatemark)) {
                this.setData({
                    'parames.navigatemark': options.navigatemark,
                });
            }
            if (!util.isEmpty(options.transferParams)) {
                this.setData({
                    'parames.transferParams': options.transferParams
                })
            }
            if (!util.isEmpty(options.terminal)) {
                this.setData({
                    'searchData.terminalId': options.terminalId
                })
            }
            if (!util.isEmpty(options.warehouseId)) {
                this.setData({
                    'searchData.wareHouseId': options.warehouseId,
                    'searchData.wareHouseName': options.warehouseName
                })
            }
            if (!util.isEmpty(options.billType)) {
                let showGift = true
                if (options.billType == BillTypeEnum.AllocationBill) {
                    showGift = false
                }
                this.setData({
                    'parames.billType': options.billType,
                    'showGift': showGift
                })

            }
        }
        await productService
            .getAllCategoriesAsync()
            .then(res => {
                //console.log('getAllCategoriesAsync', res)
                if (res.success == true) {
                    let catagories = [{
                        Name: '全部',
                        Id: 0,
                        productDatas: [],
                        badgeCount: 0
                    }]
                    let defaultKey = 0
                    // if (res.data.length > 0) {
                    //     defaultKey = res.data[0].Id
                    // }
                    catagories = catagories.concat(res.data.map(item => {
                        item.productDatas = []
                        return item
                    }))
                    this.setData({
                        catagories: catagories,
                        catagorieDefaultKey: defaultKey,
                        'searchData.categoryIds': [defaultKey],
                        'searchData.pageIndex': 0
                    }, () => {
                        this.getProducts(true)
                    })
                }
            })


        const windowHeight = wx.getSystemInfoSync().windowHeight
        wx.createSelectorQuery().select('.terminal-search').boundingClientRect((e) => {
            let h = windowHeight - e.height;
            ////console.log(h);
            this.setData({
                categoryHeight: h + 160
            })
        }).exec()


    },
    onGifts(e) {
        wx.navigateTo({
            url: '/packagePages/common/pages/selectGiftsPage/index?terminalId=' + this.data.searchData.terminalId + '&wareHouseId=' + this.data.searchData.wareHouseId
        })
    },
    onCatagoriesChanged(res) {
        if (util.isEmpty(res.detail.activeKey)) {
            return
        }
        //console.log('onCatagoriesChanged', res.detail.activeKey)
        this.setData({
            'searchData.categoryIds': [res.detail.activeKey],
            'searchData.pageIndex': 0
        }, (res) => {
            this.getProducts(true)
        })
    },
    //获取商品
    async getProducts(refresh = false) {
        let wareId = this.data.searchData.wareHouseId
        // 目前接口 忽略库存 需要 仓库Id为0  
        // usablequantity = false 查询所有;usablequantity = true 查询库存大于0
        let usablequantity = !this.data.searchData.usablequantity
        if (!usablequantity) {
            wareId = 0
        }
        await productService
            .getProductsAsync(this.data.searchData.key,
                this.data.searchData.categoryIds,
                this.data.searchData.terminalId,
                wareId,
                this.data.searchData.pageIndex,
                this.data.searchData.pageSize,
                usablequantity)
            .then(res => {
                wareId = this.data.searchData.wareHouseId
                //console.log('getProducts', res)
                if (res.success == true && this.data.searchData.categoryIds.length > 0) {
                    let temp = this.data.catagories.find(item => item.Id == this.data.searchData.categoryIds[0])
                    //类别中存在时
                    if (temp) {
                        let repeatIndex = [];
                        if (refresh) {
                            temp.productDatas = []
                        }

                        let likes = wx.getStorageSync(cache_like_key)

                        res.data.Data.forEach((item, index) => {
                            item.like = false
                            if (likes.length > 0) {
                                let l = likes.find(s => {
                                    return s.Id == item.Id
                                });
                                item.like = l?.like ?? false
                            }

                            this.data.selectedProducts.forEach(s => {
                                if (item.Id == s.Id) {
                                    item.checked = true
                                }
                            })
                            let pIndex = temp.productDatas.findIndex(p => p.Id = item.Id)
                            if (pIndex >= 0) {
                                repeatIndex.unshift(index)
                            }
                            //开启收藏搜索
                            else if (this.data.searchData.isCollect && item.like == false) {
                                repeatIndex.unshift(index)
                            } else {
                                item.WareHouseName = this.data.searchData.wareHouseName ?? '库存'
                                //不需要移除，计算真实库存
                                if (!util.isEmpty(item.StockQuantities) && item.StockQuantities.length > 0) {
                                    //console.log('wareId', wareId)
                                    let stockQ = item.StockQuantities.find(sq => sq.WareHouseId == wareId)
                                    if (stockQ && stockQ.UsableQuantity > 0) {
                                        let uqString = util.quantityFormatUnitName(stockQ.UsableQuantity, item.StrokeQuantity, item.BigQuantity, item.smallOption.Name, item.strokeOption.Name, item.bigOption.Name)
                                        item.UsableQuantityString = uqString
                                    } else {
                                        item.UsableQuantityString = '库存不足'
                                    }
                                } else {
                                    item.UsableQuantityString = '库存不足'
                                }
                            }
                        })

                        repeatIndex.forEach(i => {
                            res.data.Data.splice(i, 1)
                        })

                        temp.productDatas = temp.productDatas.concat(res.data.Data)
                    }

                    this.setData({
                        catagories: this.data.catagories
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

    onPullDownRefresh: function () {},

    onReachBottom: function () {
        //console.log('onReachBottom')
        this.getMoreProducts()
    },
})