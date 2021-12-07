const util = require('../../../../utils/util')
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        productDatas: []
    },
    onLoad: function (options) {

        wx.setNavigationBarTitle({
            title: "添加促销商品"
        })
        
        if (!util.isNull(options.cid)) {
            let ps = JSON.parse(options.cid);
            //console.log('cid', ps)
            let campaignProducts = []
            try {
                var value = wx.getStorageSync('campaignProducts')
                if (value) {
                    ps.forEach(id => {
                        let product = value.find(item => item.CampaignId == id)
                        product.Number = 1
                        if (product) {
                            campaignProducts.push(product)
                        }
                    })
                }
                wx.setStorage({
                    key: 'campaignProducts',
                    data: []
                })
            } catch (e) {
                //console.log(e)
            }
            this.setData({
                productDatas: campaignProducts,
            });
        }
    },
    onPriceChange(e) {
        let cid = e.currentTarget.dataset.cid
        let id = e.currentTarget.dataset.id
        let products = this.data.productDatas.find(item => item.CampaignId == cid)
        let product = products.CampaignBuyProducts.find(item => item.CampaignId == cid && item.Id == id)
        product.Price = e.detail.value
        this.setData({
            productDatas: this.data.productDatas
        })
    },
    onNumberChange(e) {
        //console.log('onnumberchange', e)

        let count = e.detail.count
        let cid = e.currentTarget.dataset.id

        let products = this.data.productDatas
        let product = products.find(item => item.CampaignId == cid)
        product.Number = count
        this.setData({
            productDatas: products
        })
    },
    onAdd(e) {
        let products = this.data.productDatas
        let zeroProducts = products.filter(p => p.Number <= 0)
        if (zeroProducts.length > 0) {
            wx.showToast({
                title: '请输入需要购买多少组',
                icon: 'none'
            })
            return false
        }
        let ps = []
        products.forEach(p => {
            p.CampaignBuyProducts.forEach(buyP => {
                let t = {}
                t.GiveProduct = {}
                t.GiveProduct.BigUnitQuantity = 0
                t.GiveProduct.SmallUnitQuantity = 0
                t.Id = buyP.ProductId
                t.ProductId = buyP.ProductId
                t.ProductName = buyP.ProductName
                t.Name = buyP.ProductName
                t.UnitId = buyP.UnitId
                t.Quantity = buyP.Quantity
                t.Price = buyP.Price
                // t.Amount = buyP.Amount //todo
                t.Remark = p.CampaignName
                // t.Subtotal = p.Subtotal //todo
                // t.StockQty = p.StockQty //todo
                t.UnitConversion = buyP.UnitConversion
                t.UnitName = buyP.UnitName
                t.Units = buyP.Units
                t.CurrentQuantity = buyP.CurrentQuantity
                t.UsableQuantity = buyP.UsableQuantity
                t.IsShowGiveEnabled = true
                // t.TypeId = buyP.TypeId //todo
                // t.QuantityCopy = p.QuantityCopy //todo
                t.CampaignId = p.CampaignId
                t.CampaignName = p.CampaignName
                t.BigPriceUnit = {
                    Amount: 0,
                    Price: 0,
                    Quantity: 0,
                    Remark: p.CampaignName,
                    UnitId: buyP.BigUnitId,
                    UnitName: buyP.UnitName
                }
                if (buyP.UnitId == buyP.BigUnitId) {
                    t.BigPriceUnit.Amount = buyP.Price * buyP.Quantity * p.Number
                    t.BigPriceUnit.Price = buyP.Price
                    t.BigPriceUnit.Quantity = buyP.Quantity * p.Number
                    t.BigPriceUnit.Remark = p.CampaignName
                }
                t.SmallPriceUnit = {
                    Amount: 0,
                    Price: 0,
                    Quantity: 0,
                    Remark: p.CampaignName,
                    UnitId: buyP.SmallUnitId,
                    UnitName: buyP.UnitName
                }
                if (buyP.UnitId == buyP.SmallUnitId) {
                    t.SmallPriceUnit.Amount = buyP.Price * buyP.Quantity * p.Number
                    t.SmallPriceUnit.Price = buyP.Price
                    t.SmallPriceUnit.Quantity = buyP.Quantity * p.Number
                    t.SmallPriceUnit.Remark = p.CampaignName
                }
                ps.push(t)
            })

            p.CampaignGiveProducts.forEach(gP => {
                let t = {}
                t.GiveProduct = {}
                t.GiveProduct.BigUnitQuantity = 0
                t.GiveProduct.SmallUnitQuantity = 0
                t.Id = gP.ProductId
                t.ProductId = gP.ProductId
                t.ProductName = gP.ProductName
                t.Name = gP.ProductName
                t.UnitId = gP.UnitId
                t.Quantity = gP.Quantity
                t.Price = gP.Price
                // t.Amount = gP.Amount //todo
                t.Remark = p.CampaignName
                // t.Subtotal = gP.Subtotal //todo
                // t.StockQty = gP.StockQty //todo
                t.UnitConversion = gP.UnitConversion
                t.UnitName = gP.UnitName
                t.Units = gP.Units
                t.CurrentQuantity = gP.CurrentQuantity
                t.UsableQuantity = gP.UsableQuantity
                t.IsShowGiveEnabled = true
                // t.TypeId = gP.TypeId //todo
                // t.QuantityCopy = p.QuantityCopy //todo
                t.CampaignId = gP.CampaignId
                t.CampaignName = p.CampaignName

                t.BigPriceUnit = {
                    Amount: 0,
                    Price: 0,
                    Quantity: 0,
                    Remark: p.CampaignName,
                    UnitId: gP.BigUnitId,
                    UnitName: gP.UnitName
                }
                if (gP.UnitId == gP.BigUnitId) {
                    t.BigPriceUnit.Quantity = gP.Quantity * p.Number
                    t.BigPriceUnit.Remark = p.CampaignName
                }
                t.SmallPriceUnit = {
                    Amount: 0,
                    Price: 0,
                    Quantity: 0,
                    Remark: p.CampaignName,
                    UnitId: gP.SmallUnitId,
                    UnitName: gP.UnitName
                }
                if (gP.UnitId == gP.SmallUnitId) {
                    t.SmallPriceUnit.Quantity = gP.Quantity * p.Number
                    t.SmallPriceUnit.Remark = p.CampaignName
                }
                ps.push(t)
            })
        })
        //console.log('ps', ps)

        let pages = getCurrentPages();
        let prePage = pages[pages.length - 4];
        prePage.setData({
            'parames.products': ps
        })
        wx.navigateBack({
            delta: 3
        })

    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})