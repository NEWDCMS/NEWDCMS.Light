const util = require('../../../../utils/util')
const app = getApp()
const settingService = require('../../../../services/setting.service')
import PriceTypeEnum from '../../../../models/priceTypeEnum'
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            products: []
        },
        productDatas: [],
        remarks: []
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "添加商品"
        })
        if (!util.isNull(options)) {
            if (!util.isNull(options.navigatemark)) {
                this.setData({
                    'parames.navigatemark': options.navigatemark,
                });
            }
            if (!util.isNull(options.products)) {
                let ps = JSON.parse(options.products);
                //console.log('params', ps)
                let selectProducts = []
                try {
                    var value = wx.getStorageSync('selectedProducts')
                    if (value) {
                        //console.log('storage', value);
                        let defaultPricePlan = app.global.companySetting.DefaultPricePlan
                        let planArray = defaultPricePlan.split('_')
                        let pid = 0
                        let ptid = 0
                        if (planArray.length == 2) {
                            pid = planArray[0]
                            ptid = planArray[1]
                        }
                        ps.forEach(id => {
                            let product = value.find(item => item.Id == id)
                            let bigPrice = 0
                            let smallPrice = 0
                            product.ProductTierPrices.forEach(item => {
                                let id = item.PriceTypeId
                                if (id != PriceTypeEnum.CustomPlan && ptid == item.PriceTypeId) {
                                    bigPrice = item.BigUnitPrice
                                    smallPrice = item.SmallUnitPrice
                                } else if (id == PriceTypeEnum.CustomPlan && item.PricesPlanId == pid) {
                                    bigPrice = item.BigUnitPrice
                                    smallPrice = item.SmallUnitPrice
                                }
                            })

                            let bigUnitId = 0;
                            if (product.bigOption) {
                                bigUnitId = product.bigOption.Id
                            }
                            product.uuid = util.genUUID();
                            product.BigPriceUnit = {
                                Amount: 0.00,
                                Price: bigPrice,
                                Quantity: 0,
                                RemarkId: 0,
                                Remark: '备注',
                                UnitId: bigUnitId,
                                UnitName: product.bigOption.Name ?? ''
                            }
                            let smallUnitId = 0;
                            if (product.smallOption) {
                                smallUnitId = product.smallOption.Id
                            }
                            product.SmallPriceUnit = {
                                Amount: 0.00,
                                Price: smallPrice,
                                Quantity: 0,
                                RemarkId: 0,
                                Remark: '备注',
                                UnitId: smallUnitId,
                                UnitName: product.smallOption.Name ?? ''
                            }
                            product.GiveProduct = {
                                BigUnitQuantity: 0,
                                SmallUnitQuantity: 0,
                                RemarkId: 0,
                                Remark: '备注'
                            }
                            if (product) {
                                selectProducts.push(product)
                            }
                        })
                    }
                    wx.setStorage({
                        key: 'selectedProducts',
                        data: []
                    })
                } catch (e) {
                    //console.log(e)
                }
                //console.log('selectProducts', selectProducts)
                //构造价格方案

                this.setData({
                    productDatas: selectProducts,
                });
            }
        }
        settingService.getRemarkConfigListSetting().then(res => {
            //console.log('remark', res)
            if (res.success == true) {
                let remarks = [{
                    Id: "0",
                    Name: '备注'
                }];
                for (const key in res.data) {
                    remarks.push({
                        Id: key,
                        Name: res.data[key]
                    })
                }
                this.setData({
                    remarks: remarks
                }, () => {
                    //console.log('remarksssss', this.data.remarks)
                })

            }
        })
    },
    showActionSheet(e) {
        //console.log('showaction', e)
        let tag = e.currentTarget.dataset.tag
        let productTemp = e.currentTarget.dataset.item
        let psArry = this.data.productDatas;
        let currtP = psArry.find(s => {
            return s.uuid === productTemp.uuid
        });
        let prices = []
        let index = 0;
        currtP.ProductTierPrices.forEach(item => {
            let id = item.PriceTypeId
            if (item.PriceTypeId == PriceTypeEnum.CustomPlan) {
                id = item.PriceTypeId + index
                index++
            }
            if (tag == "SmallPriceUnit.Price" && item.SmallUnitPrice != 0) {
                prices.push({
                    id: id,
                    name: item.PriceTypeName,
                    value: item.SmallUnitPrice
                })
            } else if (tag == "BigPriceUnit.Price" && item.BigUnitPrice != 0) {
                prices.push({
                    id: id,
                    name: item.PriceTypeName,
                    value: item.BigUnitPrice
                })
            }
        })
        util.showActionSheet({
            itemList: prices,
            showCancel: true
        }, (priceSet) => {
            if (!util.isEmpty(priceSet)) {
                //console.log('showActionSheet', priceSet)
                if (tag == "SmallPriceUnit.Price") {
                    currtP.SmallPriceUnit.Price = priceSet.value
                } else if (tag == "BigPriceUnit.Price") {
                    currtP.BigPriceUnit.Price = priceSet.value
                }
                this.calcTotal(tag, priceSet.value, currtP)
            }

        });
    },
    buildModel: function (model, tag, key, value) {
        for (const i in model) {
            if (model[i] != null) {
                if (model[i].constructor == Object) {
                    this.buildModel(model[i], i, key, value);
                } else {
                    var fix = tag + '.' + i;
                    if (key == fix) {
                        model[i] = value;
                    }
                    ////console.log(tag + '.' + i + "\t" + model[i]);
                }
            }
        }
    },
    calcTotal(tag, value, currtP) {
        //计算价格
        if (tag == 'BigPriceUnit.Price' && currtP.bigOption.ConvertedQuantity > 0 && currtP.SmallPriceUnit.Price == 0) {
            let smailPrice = Math.ceil(value / currtP.bigOption.ConvertedQuantity * 100) / 100
            currtP.SmallPriceUnit.Price = smailPrice;
        } else if (tag == 'SmallPriceUnit.Price' && currtP.bigOption.ConvertedQuantity > 0 && currtP.BigPriceUnit.Price == 0) {
            let bigPrice = value * currtP.bigOption.ConvertedQuantity
            currtP.BigPriceUnit.Price = bigPrice;
        }
        //计算小计
        if (!tag.startsWith('GiveProduct.')) {
            //大单位计算
            if (currtP.BigPriceUnit.Price > 0 && currtP.BigPriceUnit.Quantity > 0) {
                currtP.BigPriceUnit.Amount = currtP.BigPriceUnit.Price * currtP.BigPriceUnit.Quantity;
                currtP.BigPriceUnit.Amount = Math.ceil(currtP.BigPriceUnit.Amount * 100 / 100)
            } else {
                currtP.BigPriceUnit.Amount = 0
            }
            //小单位计算
            if (currtP.SmallPriceUnit.Price > 0 && currtP.SmallPriceUnit.Quantity > 0) {
                currtP.SmallPriceUnit.Amount = currtP.SmallPriceUnit.Price * currtP.SmallPriceUnit.Quantity;
                currtP.SmallPriceUnit.Amount = Math.ceil(currtP.SmallPriceUnit.Amount * 100 / 100)
            } else {
                currtP.SmallPriceUnit.Amount = 0
            }
        }

        //更新集合
        this.setData({
            productDatas: this.data.productDatas
        }, () => {
            //console.log('productDatas', this.data.productDatas)
        })
    },

    _onInput(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        let p = e.currentTarget.dataset.item;
        //console.log('oninput', e)
        //console.log('tag', tag)
        //console.log('item', p)
        if (('BigPriceUnit.Price' == tag || 'SmallPriceUnit.Price' == tag) && value == '') {
            value = 0
        }
        let psArry = this.data.productDatas;
        let currtP = psArry.find(s => {
            return s.uuid === p.uuid
        });
        this.buildModel(currtP, 'productDatas', tag, value);
        this.calcTotal(tag, value, currtP)
    },

    bindRemarkChange(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        let tagId = e.currentTarget.dataset.tagid;
        let p = e.currentTarget.dataset.item;
        //console.log('bindRemarkChange', e)
        //console.log('tag', tag)
        //console.log('item', p)
        let psArry = this.data.productDatas;
        let currtP = psArry.find(s => {
            return s.uuid === p.uuid
        });
        let remark = this.data.remarks[e.detail.value]
        //console.log('remark', remark)
        this.buildModel(currtP, 'productDatas', tag, remark.Name);
        this.buildModel(currtP, 'productDatas', tagId, remark.Id);
        this.setData({
            productDatas: psArry
        }, () => {
            //console.log('productDatas', this.data.productDatas)
        })
    },
    //克隆商品
    onCopy: function (e) {
        const p = e.currentTarget.dataset.item;
        //console.log(p);
        if (this.data.productDatas.length > 0 && !util.isNull(p)) {
            //拷贝
            //let cloned = JSON.parse(JSON.stringify(p));
            let cloned = Object.assign({}, p);
            cloned.uuid = util.genUUID();
            let psArry = this.data.productDatas;
            psArry.push(cloned);
            this.setData({
                productDatas: psArry
            });
        }
    },

    //删除克隆商品
    onDel: function (e) {
        const p = e.currentTarget.dataset.item;
        //console.log(p);

        if (this.data.productDatas.length > 0 && !util.isNull(p)) {

            //页面商品集合
            let psArry = this.data.productDatas;
            //当前选择商品
            let currtP = psArry.find(s => {
                return s.uuid === p.uuid
            });

            //从页面商品集合移除选择项
            util.arrRemoveObj(psArry, currtP);
            //重新赋值
            this.setData({
                productDatas: psArry
            });
            wx.showToast({
                title: "删除成功！",
                icon: 'none'
            });
        }
    },
    //确定提交
    onSubmit: function () {
        let productSeries = this.data.productDatas;
        if (productSeries.length == 0) {
            wx.showToast({
                title: "请添加商品",
                icon: 'none'
            });
            return false;
        }

        //验证
        var vaildQuantity = false;
        var vaildBigPrice = false;
        var vaildSmallPrice = false;
        var vaildBigQuantity = false;
        var vaildSmallQuantity = false;
        var vaildGiftQuantity = false;

        //数量
        productSeries.forEach(p => {
            vaildQuantity = (p.BigPriceUnit.Quantity == 0 && p.SmallPriceUnit.Quantity == 0 && p.GiveProduct.BigUnitQuantity == 0 && p.GiveProduct.SmallUnitQuantity == 0);
            if (vaildQuantity)
                return;
        });
        if (vaildQuantity) {
            wx.showToast({
                title: "请检查商品数量",
                icon: 'none'
            });
            return false;
        }
        let vaildPrice = false
        productSeries.forEach(p => {
            vaildPrice = (p.BigPriceUnit.Quantity > 0 && p.BigPriceUnit.Price < 0) || (p.SmallPriceUnit.Quantity > 0 && p.SmallPriceUnit.Price < 0);
            if (p.BigPriceUnit.RemarkId == 0) {
                p.BigPriceUnit.Remark = ''
            }
            if (p.GiveProduct.RemarkId == 0) {
                p.GiveProduct.Remark = ''
            }
            if (p.SmallPriceUnit.RemarkId == 0) {
                p.SmallPriceUnit.Remark = ''
            }
            if (vaildPrice)
                return;
        });
        if (vaildPrice) {
            wx.showToast({
                title: "请检查商品价格",
                icon: 'none'
            });
            return false;
        }
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 3];
        prePage.setData({
            'parames.products': this.data.productDatas
        })
        wx.navigateBack({
            delta: 2
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.setStorage({
            key: 'selectedProducts',
            data: []
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

})