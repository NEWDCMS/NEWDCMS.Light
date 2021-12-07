const app = getApp()
const util = require('../../../../utils/util')
const financeReceiveAccountService = require('../../../../services/financeReceiveAccount.service')
const accountingService = require('../../../../services/accounting.service')
const userService = require('../../../../services/user.service')
import BillTypeEnum from '../../../../models/typeEnum'


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
        //业务员
        businessUsers: app.global.businessUsers,
        totalCollectionAmount: 0,
        //过滤条件
        filter: {
            ShowDistrict: true,
            DistrictId: 0,
            DistrictName: '选择片区...',
            ShowBusinessUser: true,
            BusinessUserId: 0,
            BusinessUserName: '选择员工...',
            ShowTime: true,
            Start: '',
            End: ''
        },
        calenderShow: false,
        defaultDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
        ).getTime(),
        minSelect: '',
        maxSelect: '',
        type: 'single',
        color: '',
        maxDate: '',
        minDate: '',
        title: '',
        confirmText: '',
        formatter: '',
        base_range: {
            defaultDate: [util.now(-7), util.now(0)],
            minSelect: '',
            maxSelect: '',
            type: 'range',
            title: '选择日期范围'
        },
        dialogConf: {},
        menusConf: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '上交历史'
        })
        //console.log('options', options)
        if (!util.isNull(options)) {
            let f = JSON.parse(options.parames)
            //console.log('f', f)
            this.setData({
                'filter.DistrictId': f.DistrictId,
                'filter.DistrictName': f.DistrictName,
                'filter.BusinessUserId': f.BusinessUserId,
                'filter.BusinessUserName': f.BusinessUserName,
                'filter.Start': f.Start,
                'filter.End': f.End,
                'filter.BusinessUserId': f.BusinessUserId,
                'filter.Payeer': f.Payeer,

                'filter.ShowDistrict': f.ShowTime,
                'filter.ShowBusinessUser': f.ShowBusinessUser,
                'filter.ShowTime': f.ShowTime,
            });
        }
    },

    onReady: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {},

    //选择业务员
    onSelectUser() {
        util.showActionSheet({
            itemList: this.data.businessUsers,
            showCancel: true
        }, (item) => {
            this.setData({
                'filter.BusinessUserName': item.name,
                'filter.BusinessUserId': item.id,
            });
            //刷新
            this.onLoad();
        });
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