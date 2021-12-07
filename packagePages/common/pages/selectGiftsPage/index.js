const util = require('../../../../utils/util')
const campaignService = require('../../../../services/campaign.service')
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        searchData: {
            name: '',
            terminalId: 0,
            channelId: 0,
            wareHouseId: 0,
            pagenumber: 0,
            pageSize: 50
        },
        categoryHeight: 100,
        campaignProducts: []
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "选择促销品"
        })
        let terminalId = 0
        let wareHouseId = 0
        if (!util.isEmpty(options.terminalId) && options.terminalId > 0) {
            terminalId = options.terminalId
        }
        if (!util.isEmpty(options.wareHouseId) && options.wareHouseId > 0) {
            wareHouseId = options.wareHouseId
        }
        this.setData({
            'searchData.terminalId': terminalId,
            'searchData.wareHouseId': wareHouseId
        }, res => {
            this.loadData(true)
        })

    },
    searchBarInput(e) {
        this.setData({
            'searchData.name': e.detail.value
        }, res => {
            this.loadData(true)
        })
    },
    loadData(refresh = false) {
        campaignService.getAllCampaigns(this.data.searchData).then(res => {
            //console.log('getAllCampaigns', res)
            if (!util.isEmpty(res) && res.success == true && !util.isEmpty(res.data)) {
                if (refresh) {
                    this.setData({
                        campaignProducts: res.data
                    })
                } else {
                    let campaignProducts = this.data.campaignProducts
                    res.data.forEach(item => {
                        // if(item.CampaignId)
                        let cIndex = campaignProducts.findIndex(c => c.CampaignId == item.CampaignId)
                        if (cIndex < 0) {
                            campaignProducts.push(item)
                        }
                    })
                    this.setData({
                        campaignProducts: campaignProducts
                    })
                }

            } else {
                wx.showToast({
                    title: '获取政策信息失败' + res.message,
                    icon: 'none'
                })
            }
        })
    },
    loadMoreData() {
        this.setData({
            'searchData.pagenumber': this.data.searchData.pagenumber + 1
        }, res => {
            this.loadData()
        })
    },
    productChange(e) {
        //console.log('productChange', e)
        let product = this.data.campaignProducts.find(item => item.CampaignId == e.currentTarget.dataset.id);
        //console.log('productChange', product)
        if (product) {
            product.checked = !product.checked
            this.setData({
                campaignProducts: this.data.campaignProducts
            })
        }
    },
    onAdd(e) {
        let products = this.data.campaignProducts.filter(p => p.checked == true)

        if (products.length == 0) {
            wx.showToast({
                title: "请选择促销政策",
                icon: 'none'
            });
            return false;
        }
        //console.log('campaignProducts', products)
        let cid = products.map(item => item.CampaignId);
        wx.setStorageSync('campaignProducts', products)
        wx.navigateTo({
            url: '/packagePages/common/pages/addGiftProductPage/index?cid=' + JSON.stringify(cid)
        })

    },
    onReady: function () {},

    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {
        this.loadData()
    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {}
})