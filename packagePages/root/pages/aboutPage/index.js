import drawQrcode from '../../../../utils/weapp.qrcode.esm.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "关于我们"
        })

        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'myQrcode',
            text: 'https://www.jsdcms.com'
        })
    },

})