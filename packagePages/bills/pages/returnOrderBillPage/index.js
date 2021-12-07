const app = getApp()
const util = require('../../../../utils/util')
const wareHousesService = require('../../../../services/wareHouses.Service')
const terminalService = require('../../../../services/terminal.service')
import BillTypeEnum from '../../../../models/typeEnum'
import AccountingCodeEnum from '../../../../models/accountingCodeEnum'
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

        bill: {
            BillTypeId: BillTypeEnum.ReturnReservationBill,
            MakeUserId: app.global.userId,
            MakeUserName: app.global.userInfo.userRealName,
            CreatedOnUtc: util.now(0),
            BillNumber: util.getBillNumber(BillTypeEnum.properties[BillTypeEnum.ReturnReservationBill].code, app.global.storeId ?? 0),

            WareHouseId: '0',
            TerminalId: 0,
            items: []
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})