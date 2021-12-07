const terminalService = require('../../../../services/terminal.service')
const userService = require('../../../../services/user.service')
const util = require('../../../../utils/util')
const app = getApp()

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            terminal: {}
        },
        placement: 'left',
        dubbleTabs: [],
        totalFormat: '0',

        calenderShow: false,
        defaultDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
        ).getTime(),
        minSelect: '12',
        maxSelect: '1',
        type: 'single',
        color: '',
        maxDate: util.now(0),
        minDate: '',
        title: '',
        confirmText: '确定',
        formatter: ''
    },
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "业务拜访达成情况"
        })
        app.global.hasLoading = true;
        await this.getReachDatasAsync('', util.now(0), util.now(0))
    },

    //获取业务员拜访达成情况
    async getReachDatasAsync(businessUserId, start, end) {

        wx.showLoading({
            title: '加载中...',
        })

        await terminalService
            .getReachDatasAsync(businessUserId, start, end)
            .then((res) => {

                wx.hideLoading()

                console.log('getReachDatasAsync', res);

                if (res != null && res.length > 0) {

                    let fdatas = res.filter(obj => {
                        return obj.LineId > 0
                    });

                    let datas = fdatas.map(item => {
                        item.RecordDatas.forEach(s => {
                            s.OnStoreSeconds = util.formatDateTime(s.OnStoreSeconds)
                        })

                        return {
                            tab: item.UserName,
                            key: 'User_' + item.UserId,
                            subKey: 'Line_' + item.LineId,
                            subTab: item.LineName,
                            recordDatas: item.RecordDatas
                        }
                    })

                    console.log('datas', datas);

                    this.setData({
                        'dubbleTabs': datas
                    })
                }
            })
    },
    //菜单选择
    onShowPopupMenus(e) {
        const m = e.currentTarget.dataset.item;
        this.setData({
            calenderShow: true,
            defaultDate: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                new Date().getDate()
            ).getTime(),
            minSelect: '',
            maxSelect: '',
            type: 'single',
            title: ''
        });
    },
    //选择日期范围
    async selectCalender(e) {
        let date = util.getDate(e.detail)
        console.log('e.detail:', date)
        if (e.detail == null) {
            return;
        }
        await this.getReachDatasAsync('', date, date)
    }
})