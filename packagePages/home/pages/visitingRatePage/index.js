const app = getApp()
const reportingService = require('../../../../services/reporting.service')
const util = require('../../../../utils/util')
const Chart = require('../../../../components/chartjs/Chart.umd.min')

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
        filter: {
            BusinessUserId: 0
        },
        data: {
            BeforeYesterday: {
                VistCount: 0,
                Percentage: 0
            },
            LastMonth: {
                VistCount: 0,
                Percentage: 0
            },
            LastWeek: {
                VistCount: 0,
                Percentage: 0
            },
            ThisMonth: {
                VistCount: 0,
                Percentage: 0
            },
            ThisWeek: {
                VistCount: 0,
                Percentage: 0
            },
            ThisYear: {
                VistCount: 0,
                Percentage: 0
            },
            Today: {
                VistCount: 0,
                Percentage: 0
            },
            Yesterday: {
                VistCount: 0,
                Percentage: 0
            }
        },
        polarAreaChart: {},
    },

    randomScalingFactor: function () {
        return Math.round(Math.random() * 100);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "客户拜访分析"
        })

        this.polarAreaChart = {};

        let businessUserId = app.global.userId;
        await reportingService
            .getCustomerVistAnalysisAsync(businessUserId)
            .then((res) => {
                //console.log('getCustomerVistAnalysisAsync:', res)

                this.setData({
                    data: res
                });

                var datas = [
                    res.Today?.VistCount ?? 0,
                    res.Yesterday?.VistCount ?? 0,
                    res.BeforeYesterday?.VistCount ?? 0,
                    res.LastWeek?.VistCount ?? 0,
                    res.ThisWeek?.VistCount ?? 0,
                    res.LastMonth?.VistCount ?? 0,
                    res.ThisYear?.VistCount ?? 0,
                ];

                const data = {
                    labels: ["今日拜访", "昨天拜访", "前天拜访", "上周拜访", "本周拜访", "上月拜访", "本年拜访"],
                    datasets: [{
                        label: '',
                        data: datas,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 205, 86)',
                            'rgb(201, 203, 207)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)'
                        ]
                    }]
                };

                const config = {
                    type: 'polarArea',
                    data: data,
                    options: {
                        title: {
                            display: true,
                            text: '共计 ' + (res?.TotalCustomer ?? 0) + ' 家'
                        }
                    }
                };

                this.polarAreaChart.instance = new Chart('visitingRateChart', config);

            });
    },
    onTapDate(e) {
        //console.log('onTapDate', e)
        let dateFlag = e.currentTarget.dataset.dateflag
        //今日1 昨天3 前天4  上周5 本周6 上月7 本月8 本年9
        wx.navigateTo({
            url: `/packagePages/reporting/pages/VisitReportPage/index?title=业务拜访统计&type=${dateFlag}`
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

    }
})