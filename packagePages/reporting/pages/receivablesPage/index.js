const app = getApp()
const util = require('../../../../utils/util')
const receiptCashService = require('../../../../services/receiptCashBill.service')
const terminalService = require('../../../../services/terminal.service')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            TerminalId: 0,
            TerminalName: '请选择客户',
        },
        //过滤器
        filter: {
            Keys: '',
            TerminalId: 0,
            TerminalName: '请选择客户',
            DistrictId: 0,
            DistrictName: '选择片区...',
            BusinessUserId: 0,
            BusinessUserName: '选择员工...',
            Start: util.now(-365),
            End: util.now(0),
            ShowBusinessUser: false
        },
        totalCollectionAmount: 0,
        detailItems: []
    },

    //搜索
    onSearchConfirm: function (e) {
        if (!util.isNotEmpty(e.detail.value)) {
            wx.showToast({
                title: '请输入关键字！',
                icon: 'none'
            });
            return;
        }
        this.setData({
            'filter.Keys': e.detail.value
        })
    },

    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: '应收款'
        })
        if (!util.isNull(options)) {
            this.setData({
                'parames.TerminalId': options.TerminalId,
                'parames.TerminalName': options.TerminalName,
                'filter.TerminalId': options.TerminalId,
                'filter.TerminalName': options.TerminalName
            });
        }
        await this.loadData()
    },

    //加载数据
    loadData: async function () {
        let businessUserId = app.global.userId
        let params = {
            terminalId: this.data.filter?.TerminalId ?? 0,
            billTypeId: 0,
            billNumber: '',
            remark: '',
            startTime: this.data.filter.Start,
            endTime: this.data.filter.End,
            districtId: this.data.filter.DistrictId,
            pageIndex: 0,
            pageSize: 50
        }

        await receiptCashService
            .GetOwecashBillsAsync(params, businessUserId)
            .then((res) => {

                //隐藏loading 提示框
                //wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading();
                //停止下拉刷新
                wx.stopPullDownRefresh();

                //console.log('GetOwecashBillsAsync', res)
                if (res != null) {
                    //按客户分组
                    let map = {};
                    let group = [];
                    for (var i = 0; i < res.length; i++) {
                        var ai = res[i];
                        if (!map[ai.CustomerId]) {
                            group.push({
                                CustomerId: ai.CustomerId,
                                CustomerName: typeof (ai.CustomerName) == 'undefined' ? '----' : ai.CustomerName,
                                CustomerPointCode: ai.CustomerId,
                                Amount: ai.ArrearsAmount,
                                data: [ai]
                            });
                            map[ai.CustomerId] = ai;
                        } else {
                            for (var j = 0; j < group.length; j++) {
                                var dj = group[j];
                                if (dj.CustomerId == ai.CustomerId) {
                                    dj.data.push(ai);
                                    break;
                                }
                            }
                        }
                    }

                    group.forEach(s => {
                        s.Amount = util.sum(s.data, 'ArrearsAmount').ArrearsAmount ?? 0
                    })

                    //console.log('map', map)
                    //console.log('group', group)
                    this.setData({
                        detailItems: group,
                        totalCollectionAmount: util.sum(group, 'Amount').Amount ?? 0,
                    })
                }
            });
    },

    //刷新
    onRefresh() {
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        this.loadData()
    },
    onPullDownRefresh: function () {
        this.onRefresh();
    },
    onSelectAll: function () {
        this.setData({
            'filter.Start': util.now(-365),
            'filter.End': util.now(0),
            'filter.TerminalName': '',
            'filter.TerminalId': 0
        })
        this.loadData()
    },
    onShow: function () {
        //console.log('filter.Start', this.data.filter.Start)
        //console.log('filter.End', this.data.filter.End)
        //console.log('filter.parames', this.data.parames)
        this.setData({
            'filter.TerminalName': this.data.parames?.TerminalName ?? '',
            'filter.TerminalId': this.data.parames?.TerminalId ?? 0
        }, () => {
            this.loadData()
        })
    },
    onHide: function () {},
    onUnload: function () {},
    //过滤筛选
    onFilter: function (e) {
        let f = this.data.filter
        wx.navigateTo({
            url: '/packagePages/common/pages/filterPage/index?parames=' + JSON.stringify(f)
        });
    },
    onRedirect: function (e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '/packagePages/bills/pages/receiptBillPage/index?TerminalId=' + item.CustomerId + '&TerminalName=' + item.CustomerName + '&type=ADD'
        });
    },

    //选择客户
    onSelectTerminal: function (e) {
        wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=select&navigatemark=/packagePages/bills/pages/saleBillPage/index'
        });
    },
})