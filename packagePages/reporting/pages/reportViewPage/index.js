const app = getApp()
const reportingService = require('../../../../services/reporting.service')
const util = require('../../../../utils/util')
const Chart = require('../../../../components/chartjs/Chart.umd.min')
import cdProvider from '../chartDataProvider';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        parames: {
            title: '',
            type: 51,
            navigatemark: ''
        },
        totalFormat: '0',
        //过滤条件
        filter: {
            businessUserId: app.global.userId,
            brandIds: 0,
            brandId: 0,
            dateType: 'month',
            productId: 0,
            categoryId: 0,
            terminalId: 0,
            districtId: 0,
            startTime: util.now(-30),
            endTime: util.now(0)
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
        data: {
            chartDatas: []
        },
        chart: {}
    },
    randomScalingFactor: function () {
        return Math.round(Math.random() * 100);
    },
    //Chart点击
    touchHandler(e) {
        this.chart.instance.touchHandler(e);
    },
    //生命周期函数--监听页面加载
    onLoad: async function (options) {
        if (!util.isNull(options)) {
            this.setData({
                'parames.type': options.type,
                'parames.title': options.title,
            });
            wx.setNavigationBarTitle({
                title: options.title
            })
        }

        let datas = [];
        let type = this.data.parames.type

        //客户排行榜
        if (type == 51) {

            //console.log('this.data.filter:', this.data.filter)

            let filter = this.data.filter
            let params = {
                terminalId: filter.terminalId,
                districtId: filter.districtId,
                businessUserId: filter.businessUserId,
                startTime: filter.startTime,
                endTime: filter.endTime
            }

            //console.log('params:', params)

            await reportingService
                .getCustomerRankingAsync(params)
                .then((res) => {

                    //console.log('getCustomerRankingAsync:', res)

                    if (!util.isNull(res)) {
                        if (res.length > 0) {

                            datas = res

                            //当前单据数据
                            this.setData({
                                totalFormat: res.length ?? 0,
                                'data.chartDatas': res
                            });

                            //绑定chart
                            this.chart = {};
                            this.chart.config = cdProvider.getCustomerRanking(datas);
                            this.chart.instance = new Chart('canvas', this.chart.config)
                        }
                    }
                });
        }
        //业务销售排行
        else if (type == 52) {

            let filter = this.data.filter
            let params = {
                businessUserId: filter.businessUserId,
                startTime: filter.startTime,
                endTime: filter.endTime
            }

            await reportingService
                .getBusinessRankingAsync(params)
                .then((res) => {

                    //console.log('getBusinessRankingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getBusinessRanking(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)


                    }
                });
        }
        //品牌销量汇总
        else if (type == 55) {

            let filter = this.data.filter
            let params = {
                brandIds: filter.brandIds,
                businessUserId: 0,
                startTime: filter.startTime,
                endTime: filter.endTime
            }

            await reportingService
                .getBrandRankingAsync(params)
                .then((res) => {

                    //console.log('getBrandRankingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getBrandRanking(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)

                    }
                });
        }
        //热销排行榜
        else if (type == 61) {

            let filter = this.data.filter
            let params = {
                terminalId: filter.terminalId,
                businessUserId: 0,
                brandId: filter.brandId,
                categoryId: filter.categoryId,
                startTime: filter.startTime,
                endTime: filter.endTime,
            }

            await reportingService
                .getHotSaleRankingAsync(params)
                .then((res) => {
                    //console.log('getHotSaleRankingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });
                    }

                    //绑定chart
                    this.chart = {};
                    this.chart.config = cdProvider.getHotSaleRanking(datas);
                    this.chart.instance = new Chart('canvas', this.chart.config)



                });
        }
        //销量走势图
        else if (type == 62) {

            let filter = this.data.filter
            //month 当前日期前12个月
            //week 当前日期前7天
            //day 当前日期前15天
            let params = {
                dateType: filter.dateType,
            }

            await reportingService
                .getSaleTrendingAsync(params)
                .then((res) => {

                    //console.log('getSaleTrendingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getSaleTrending(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)

                    }

                });
        }
        //销售利润排行
        else if (type == 116) {

            let filter = this.data.filter
            let params = {
                terminalId: filter.terminalId,
                businessUserId: 0,
                brandId: filter.brandId,
                categoryId: filter.categoryId,
                startTime: filter.startTime,
                endTime: filter.endTime
            }

            await reportingService
                .getCostProfitRankingAsync(params)
                .then((res) => {
                    //console.log('getCostProfitRankingAsync:', res)

                    if (!util.isNull(res)) {

                        datas = res
                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getCostProfitRanking(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)


                    }
                });
        }
        //客户拜访排行
        else if (type == 161) {

            let filter = this.data.filter
            let params = {
                businessUserId: 0,
                start: filter.startTime,
                end: filter.endTime,
            }

            await reportingService
                .getBusinessVisitRankingAsync(params)
                .then((res) => {

                    //console.log('getBusinessVisitRankingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getBusinessVisitRanking(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)

                    }

                });

        }
        //热定排行榜
        else if (type == 66) {

            let filter = this.data.filter

            let params = {
                terminalId: filter.terminalId,
                businessUserId: 0,
                brandId: filter.brandId,
                categoryId: filter.categoryId,
                startTime: filter.startTime,
                endTime: filter.endTime
            }

            await reportingService
                .getHotOrderRankingAsync(params)
                .then((res) => {
                    //console.log('getHotOrderRankingAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getHotOrderRanking(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)

                    }
                });

        }
        //订单额分析
        else if (type == 65) {

            let filter = this.data.filter

            let params = {
                businessUserId: 0,
                brandId: filter.brandId,
                productId: filter.productId,
                categoryId: filter.categoryId,
            }

            await reportingService
                .getOrderQuantityAnalysisAsync(params)
                .then((res) => {
                    //console.log('getSaleAnalysisAsync:', res)

                    if (!util.isNull(res)) {
                        datas = res

                        //当前单据数据
                        this.setData({
                            totalFormat: res.length ?? 0,
                            'data.chartDatas': res
                        });

                        //绑定chart
                        this.chart = {};
                        this.chart.config = cdProvider.getSaleAnalysis(datas);
                        this.chart.instance = new Chart('canvas', this.chart.config)

                    }
                });
        }
    },

    //生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    //生命周期函数--监听页面显示
    onShow: function () {},
    //生命周期函数--监听页面隐藏
    onHide: function () {},
    //生命周期函数--监听页面卸载
    onUnload: function () {},
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    //页面上拉触底事件的处理函数
    onReachBottom: function () {},
    //溢出菜单
    onShowPopupMenus(e) {
        this.setData({
            menusConf: {
                show: true,
                animation: 'show',
                zIndex: 99,
                contentAlign: 'bottom',
                locked: false,
                menus: [{
                    name: '今日',
                    id: 1,
                    icon: 'label'
                }, {
                    name: '昨日',
                    id: 2,
                    icon: 'label'
                }, {
                    name: '其它',
                    id: 3,
                    icon: 'label'
                }]
            }
        });
    },
    //菜单选择
    clickMenuItem(e) {
        const m = e.currentTarget.dataset.item;

        //关闭菜单
        this.data.menusConf = false;
        this.setData({
            menusConf: {
                show: false
            }
        })

        switch (m.id) {
            //今日
            case 1: {
                this.setData({
                    'filter.Start': util.now(0),
                    'filter.End': util.now(0),
                });
                break;
            }
            //昨日
            case 2: {
                this.setData({
                    'filter.Start': util.now(-1),
                    'filter.End': util.now(0),
                });
                break;
            }
            //其它
            case 3: {
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
                return;
            }
        }
        //刷新
        this.onLoad();
    },
    //选择日期范围
    selectCalender(e) {
        ////console.log('e.detail:', e.detail)
        if (e.detail[0] == null || e.detail[1] == null) {
            return;
        }
        // //console.log('Start:', util.getDate(e.detail[0]))
        // //console.log('End:', util.getDate(e.detail[1]))
        this.setData({
            'filter.Start': util.now(-1),
            'filter.End': util.now(0),
        });
        //刷新
        this.onLoad();
    },
    //过滤筛选
    onFilter: function (e) {
        wx.navigateTo({
            url: '/packagePages/common/pages/filterPage/index?title=' + e.currentTarget.dataset.key
        });
    },
    onRedict(e) {
        //console.log('onRedict', e)
        //客户拜访排行
        if (161 == this.data.parames.type) {
            let userId = e.currentTarget.dataset.userid
            let userName = e.currentTarget.dataset.username
            let start = this.data.filter.startTime
            let end = this.data.filter.endTime
            wx.navigateTo({
                url: `/packagePages/market/pages/visitRecordsPage/index?businessUserId=${userId}&businessUserName=${userName}&start=${start}&end=${end}`,
            })
        }
    }
})