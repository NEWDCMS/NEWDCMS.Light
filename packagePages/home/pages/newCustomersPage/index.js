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
                Count: 0,
                TerminalIds: []
            },
            ChartDatas: null,
            LastMonth: {
                Count: 0,
                TerminalIds: []
            },
            LastWeek: {
                Count: 0,
                TerminalIds: []
            },
            SamePeriodLastWeek: {
                Count: 0,
                TerminalIds: []
            },
            ThisMonth: {
                Count: 0,
                TerminalIds: []
            },
            ThisWeek: {
                Count: 0,
                TerminalIds: []
            },
            ThisYear: {
                Count: 906,
                TerminalIds: []
            },
            Today: {
                Count: 0,
                TerminalIds: []
            },
            Yesterday: {
                Count: 0,
                TerminalIds: []
            }
        },
        lineChart: {},
    },

    randomScalingFactor: function () {
        return Math.round(Math.random() * 100);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "新增客户分析"
        })

        this.lineChart = {};

        let businessUserId = app.global.userId;
        await reportingService
            .getNewCustomerAnalysisAsync(businessUserId)
            .then((res) => {
                //console.log('getNewCustomerAnalysisAsync:', res)
                if (!util.isNull(res.ChartDatas)) {

                    this.setData({
                        data: res
                    });

                    let labels = res.ChartDatas.map(s => {
                        return {
                            key: s[0]
                        };
                    })

                    let datas = res.ChartDatas.map(s => {
                        return {
                            value: s[1]
                        };
                    })

                    let lineConfig = {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: '拜访',
                                backgroundColor: 'transparent',
                                borderColor: '#3B5998',
                                pointBackgroundColor: 'white',
                                pointBorderColor: 'rgba(45, 127, 219, 1)',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(77,83,96,1)',
                                data: datas,
                                fill: false,
                            }]
                        },
                        options: {
                            responsive: true,
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    ticks: {
                                        minRotation: 45
                                    },
                                    position: 'bottom'
                                }],
                                yAxes: [{
                                    display: true
                                }]
                            }
                        }
                    }
                    this.lineChart.config = lineConfig;
                    this.lineChart.instance = new Chart('newCustomersPageChart', this.lineChart.config);
                }

            });


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