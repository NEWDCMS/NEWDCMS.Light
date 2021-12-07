const app = getApp()
const reportingService = require('../../../../services/reporting.service')
const terminalService = require('../../../../services/terminal.service')
const util = require('../../../../utils/util')
const Chart = require('../../../../components/chartjs/Chart.umd.min')
import cdProvider from '../chartDataProvider';

Page({
    data: {
        parames: {
            title: '',
            type: 51,
            navigatemark: ''
        },
        //过滤条件
        filter: {
            BusinessUserId: app.global.userId,
            BusinessUserName: app.global.userInfo.UserRealName,
            brandId: 0,
            dateType: 'month',
            productId: 0,
            categoryId: 0,
            terminalId: 0,
            districtId: 0,
            Start: util.now(-31),
            End: util.now(0),
            ShowDistrict: false
        },
        currentLine: 0,
        records: [],
        lines: [],
    },
    //生命周期函数--监听页面加载
    onLoad: async function (options) {
        let type = 8;
        if (!util.isNull(options)) {
            this.setData({
                'parames.type': options.type,
                'parames.title': options.title,
            });
            type = options.type ?? 8
            wx.setNavigationBarTitle({
                title: options.title
            })
        }
        //今日1 昨天3 前天4  上周5 本周6 上月7 本月8 本年9
    },
    loadData: function () {
        let filter = this.data.filter
        let userId = filter.BusinessUserId
        let start = filter.Start
        let end = filter.End
        let lineId = this.data.currentLine
        terminalService.getBusinessUserVisitReached(userId, lineId, start, end).then(res => {
            console.log('getBusinessUserVisitReached', res)
            let lines = this.data.lines
            let line = lines.find(l => l.value == lineId)
            if (res.code > 0) {
                if (line) {
                    if (res.data) {
                        line.data = res.data.map(vc => {
                            if (util.isEmpty(vc.ActualVisitCount) || util.isEmpty(vc.TerminalCount) || vc.ActualVisitCount == 0 || vc.TerminalCount == 0) {
                                vc.VisitCountRate = 0
                            } else {
                                vc.VisitCountRate = parseFloat(vc.ActualVisitCount) / parseFloat(vc.TerminalCount) * 100
                            }
                            vc.SigninDateStr = util.moment("yyyy-MM-dd", vc.SigninDateTime)
                            return vc
                        })
                    } else {
                        line.data = []
                    }
                    this.setData({
                        lines: lines
                    })
                } else {
                    line.data = []
                    this.setData({
                        lines: lines
                    })
                    wx.showToast({
                        title: '获取当前线路失败，请重新进入该页面',
                        icon: 'none'
                    })
                }
            } else {
                wx.showToast({
                    title: '查询失败，请重新尝试',
                    icon: 'none'
                })
            }
        })
    },
    //切换Tab
    linchange: function (e) {
        //console.log('e.detail.activeKey', e.detail.activeKey)
        //参数
        this.setData({
            'records': [],
            'filter.pageIndex': 0,
            currentLine: e.detail.activeKey
        }, res => {
            this.loadData()
        })
    },
    //生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    //生命周期函数--监听页面显示
    onShow: function () {
        let linesTemp = app.global.lineTiers.slice()
        linesTemp.shift()
        let currentLine = 0
        if (linesTemp.length > 0) {
            currentLine = linesTemp[0].value
        }
        this.setData({
            lines: linesTemp,
            currentLine: currentLine
        })
        //筛选条件后查询
        this.loadData()
    },
    //生命周期函数--监听页面隐藏
    onHide: function () {},
    //生命周期函数--监听页面卸载
    onUnload: function () {},
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    //页面上拉触底事件的处理函数
    onReachBottom: function () {},
    //过滤筛选
    onFilter: function (e) {
        let filterStr = JSON.stringify(this.data.filter)
        wx.navigateTo({
            url: `/packagePages/common/pages/filterPage/index?parames=${filterStr}`
        });
    }
})