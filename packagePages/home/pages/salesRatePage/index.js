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
            BusinessUserId: 0,
            BrandId: 0,
            ProductId: 0,
            CatagoryId: 0,
        },
        data: {
            BeforeYesterday: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            LastMonth: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            LastWeek: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            SamePeriodLastWeek: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            ThisMonth: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            ThisWeek: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            ThisYear: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            Today: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            },
            Yesterday: {
                SaleAmount: 0,
                SaleReturnAmount: 0,
                NetAmount: 0
            }
        },
        doughnutChart: {},
    },

    randomScalingFactor: function () {
        return Math.round(Math.random() * 100);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "销售净额"
        })

        //销售额分析
        this.doughnutChart = {};
        let businessUserId = app.global.userId;
        let brandId = this.data.filter.BrandId;
        let productId = this.data.filter.ProductId;
        let categoryId = this.data.filter.BrandId;
        await reportingService
            .getSaleAnalysisAsync(businessUserId, brandId, productId, categoryId)
            .then((res) => {
                //console.log('getSaleAnalysisAsync:', res)
                var datas = [
                    res.Today?.NetAmount ?? 0,
                    res.Yesterday?.NetAmount ?? 0,
                    res.BeforeYesterday?.NetAmount ?? 0,
                    res.LastWeek?.NetAmount ?? 0,
                    res.ThisWeek?.NetAmount ?? 0,
                    res.LastMonth?.NetAmount ?? 0,
                    res.ThisQuarter?.NetAmount ?? 0,
                    res.ThisYear?.NetAmount ?? 0,
                ];

                this.setData({
                    data: res
                });

                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: datas,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(54, 45, 235)',
                                'rgba(255, 99, 132)',
                                'rgba(255, 159, 64)',
                                'rgba(255, 205, 86)',
                                'rgba(75, 192, 192)',
                                'rgba(54, 162, 235)'
                            ],
                            label: ''
                        }],
                        labels: [
                            "今日净额", "昨天净额", "前天净额", "上周净额", "本周净额", "上月净额", "本季净额", "本年净额"
                        ]
                    },
                    options: {
                        responsive: true,
                        legend: {
                            position: 'top',
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                };

                this.doughnutChart.instance = new Chart('salesRatePageChart', config);
            });
    },

    touchBarHandler:function()
    {
        ////console.log('touchBarHandler')
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