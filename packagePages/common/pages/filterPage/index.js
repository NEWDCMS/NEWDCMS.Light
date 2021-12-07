const app = getApp()
const util = require('../../../../utils/util')
const terminalService = require('../../../../services/terminal.service')

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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '筛选'
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

                'filter.ShowDistrict': f.ShowDistrict,
                'filter.ShowBusinessUser': f.ShowBusinessUser,
                'filter.ShowTime': f.ShowTime,
            });
        }
    },
    onShow: function () {
        this.setData({
            businessUsers: app.global.businessUsers,
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    //重置
    onReset: function () {
        this.setData({
            'filter.DistrictId': 0,
            'filter.DistrictName': '选择片区...',
            'filter.BusinessUserId': 0,
            'filter.BusinessUserName': '选择员工...',
            'filter.Start': '',
            'filter.End': ''
        });
    },
    //确定
    onComfim: function () {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        let f = this.data.filter
        prevPage.setData({
            'filter.DistrictId': f.DistrictId,
            'filter.BusinessUserId': f.BusinessUserId,
            'filter.BusinessUserName': f.BusinessUserName,
            'filter.Start': f.Start,
            'filter.End': f.End,
            'filter.Payeer': f.Payeer
        }, () => {
            wx.navigateBack()
        })

    },
    //选择日期
    onSelectDate: function () {
        const {
            defaultDate,
            minSelect,
            maxSelect,
            type,
            title,
            color = '',
            minDate = '',
            maxDate = '',
            confirmText = '确定',
            formatter
        } = this.data['base_range'];
        this.setData({
            calenderShow: true,
            defaultDate,
            minSelect,
            maxSelect,
            type,
            title,
            color,
            maxDate,
            minDate,
            confirmText,
            formatter
        });

    },
    //获取选择日期范围
    selectCalender(e) {
        //console.log('e.detail:', e.detail)
        if (e.detail[0] == null || e.detail[1] == null) {
            return;
        }
        // //console.log('Start:', util.getDate(e.detail[0]))
        // //console.log('End:', util.getDate(e.detail[1]))
        this.setData({
            'filter.Start': util.getDate(e.detail[0]),
            'filter.End': util.getDate(e.detail[1]),
        });
    },

    //ActionSheet菜单
    _showActionSheet({
        itemList,
        showCancel = false,
        title = '',
        locked = false
    }, callback) {
        wx.lin.showActionSheet({
            itemList: itemList,
            showCancel: showCancel,
            title: title,
            locked,
            success: (res) => {
                callback(res.item)
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },
    //选择业务员
    onSelectUser() {
        this._showActionSheet({
            type: 'businessUsers',
            itemList: this.data.businessUsers,
            showCancel: true
        }, (item) => {
            this.setData({
                'filter.BusinessUserId': item.id,
                'filter.BusinessUserName': item.name,
            });
        });
    },
    //选择片区
    async onSelectDistrict() {
        await terminalService
            .getDistrictsAsync()
            .then((res) => {
                //console.log(res)
                if (res.code > 0) {
                    let datas = res.data.map(s => {
                        return {
                            id: s.Id,
                            name: s.Name
                        };
                    });
                    this._showActionSheet({
                        itemList: datas,
                        showCancel: true
                    }, (item) => {
                        this.setData({
                            'filter.DistrictId': item.id,
                            'filter.DistrictName': item.name,
                        });
                    });
                }
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