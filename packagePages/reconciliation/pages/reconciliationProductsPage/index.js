const app = getApp()
const util = require('../../../../utils/util')

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
        totalCollectionAmount: 0,
        detailItems: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options)
        if (!util.isNull(options)) {
            this.setData({
                'parames.title': options.title,
                'parames.type': options.type,
            });

            wx.setNavigationBarTitle({
                title: options.title
            })
        }

        let detailItems = []
        if (this.data.parames.type == 0) {
            detailItems = wx.getStorageSync('saleProducts')
        } else if (this.data.parames.type == 1) {
            detailItems = wx.getStorageSync('giftProducts')
        } else if (this.data.arames.type == 2) {
            detailItems = wx.getStorageSync('returnProducts')
        }




        detailItems.forEach(s => {
            s.QuantityMFT = util.quantityFormat(s.Quantity, s.StrokeQuantity, s.BigQuantity)
        })

        //console.log('detailItems', detailItems)

        this.setData({
            detailItems: detailItems,
            totalCollectionAmount: util.sum(detailItems, 'Amount').Amount ?? 0,
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
    //打印
    onPrint: function () {
        //获取选择单据
        if (this.data.detailItems.length == 0) {
            wx.showToast({
                title: '没有可打印数据！',
                icon: 'none'
            });
            return false;
        }

        let pdata = this.data.detailItems;
        let inactive = app.global.inactive;
        //58/76/80MM 纸张类型
        if (util.isNull(inactive)) {
            wx.showToast({
                title: '请连接打印机',
                icon: 'error',
                duration: 1000
            })
            return;
        }
        //print.printProductDetails(80, pdata, '销售商品明细', inactive);
    }
})