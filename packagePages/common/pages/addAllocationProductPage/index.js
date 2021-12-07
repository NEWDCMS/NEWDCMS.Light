const util = require('../../../../utils/util')
const app = getApp()
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            inWareId: 0,
            outWareId: 0
        },
        productDatas: [],
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "添加调拨商品"
        })
        if (!util.isNull(options)) {
            if (!util.isNull(options.navigatemark)) {
                this.setData({
                    'parames.navigatemark': options.navigatemark,
                });
            }
            if (!util.isNull(options.products)) {
                let ps = JSON.parse(options.products);
                let transferParams = JSON.parse(options.transferParams)
                let inWareId = transferParams.inWareId
                let outWareId = transferParams.outWareId
                //console.log('params', ps)
                let selectProducts = []
                try {
                    var value = wx.getStorageSync('selectedProducts')
                    if (value) {
                        //console.log('storage', value);
                        ps.forEach(id => {
                            let product = value.find(item => item.Id == id)
                            let bigUnitId = 0;
                            if (product.bigOption) {
                                bigUnitId = product.bigOption.Id
                            }
                            product.uuid = util.genUUID();
                            product.BigPriceUnit = {
                                Amount: 0.00,
                                Price: 0,
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
                                Price: 0,
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
                            product.inWareName = transferParams.inWareName ?? ''
                            product.outWareName = transferParams.outWareName ?? ''
                            product.inWareQuantity = 0
                            product.outWareQuantity = 0
                            let inWare = product.StockQuantities.find(s => inWareId == s.WareHouseId)
                            if (inWare) {
                                product.inWareQuantity = inWare.UsableQuantity
                            }
                            let outWare = product.StockQuantities.find(s => outWareId == s.WareHouseId)
                            if (outWare) {
                                product.outWareQuantity = outWare.UsableQuantity
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
                this.setData({
                    productDatas: selectProducts,
                });
            }
        }
    },
    onSubmit(e) {
        //console.log('onSubmit', e)
        let products = this.data.productDatas
        let zeroProduct = products.findIndex(p => p.BigPriceUnit.Quantity <= 0 && p.SmallPriceUnit.Quantity <= 0)
        if (zeroProduct >= 0) {
            wx.showToast({
                title: '请输入调拨商品数据',
                icon: 'none'
            })
            return false
        }

        products.forEach(p => {
            if (p.BigPriceUnit.RemarkId == 0) {
                p.BigPriceUnit.Remark = ''
            }
            if (p.GiveProduct.RemarkId == 0) {
                p.GiveProduct.Remark = ''
            }
            if (p.SmallPriceUnit.RemarkId == 0) {
                p.SmallPriceUnit.Remark = ''
            }
        });

        let pages = getCurrentPages();
        let prePage = pages[pages.length - 3];
        prePage.setData({
            'parames.products': this.data.productDatas
        })
        wx.navigateBack({
            delta: 2
        })

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
    onInput(e) {
        let value = e.detail.value;
        let tag = e.currentTarget.dataset.tag;
        let p = e.currentTarget.dataset.item;
        //console.log('oninput', e)
        //console.log('tag', tag)
        //console.log('item', p)
        if (value) {
            let psArry = this.data.productDatas;
            let currtP = psArry.find(s => {
                return s.uuid === p.uuid
            });
            this.buildModel(currtP, 'productDatas', tag, value);
        }
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
        }
    },
    onReady: function () {},
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