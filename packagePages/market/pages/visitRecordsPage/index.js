const terminalService = require('../../../../services/terminal.service')
const userService = require('../../../../services/user.service')
const util = require('../../../../utils/util')
const {
    default: versionUtil
} = require('../../../../utils/version-util')
const app = getApp()

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: '',
            terminal: {}
        },
        isBusy: true,
        searchData: {
            pageIndex: 0,
            districtId: 0,
            terminalId: 0,
            terminalName: '请选择终端',
            businessUserId: app.global.userInfo.Id,
            businessUserName: app.global.userInfo.UserRealName,
            businessUserUrl: app.global.userInfo.FaceImage,
            start: util.now(-31),
            end: util.now(0),
            datetimeScope: 0
        },
        switchTitle1: '时间',
        switch1: true,
        switch2: false,
        districts: app.global.districts,
        businessUsers: [],
        datetimeScopes: [{
                text: '范围',
                value: 0
            },
            {
                text: '今日',
                value: 1
            },
            {
                text: '本周',
                value: 2
            },
            {
                text: '上周',
                value: 3
            },
            {
                text: '本月',
                value: 4
            }
        ],
        recordDatas: [],

        closeOnClickOverlay: false,
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
        }
    },
    filterViewMove: function () {},
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "拜访记录"
        })

        app.global.hasLoading = true;

        this.setData({
            isBusy: true
        });
        let selectUserId = app.global.userInfo.Id
        //console.log('options', options)
        if (!util.isNull(options)) {
            if (!util.isEmpty(options.terminalId)) {
                this.setData({
                    'searchData.terminalId': options?.terminalId ?? 0,
                    'searchData.terminalName': options.terminalName
                })
            }
            if (!util.isEmpty(options.businessUserId)) {
                this.setData({
                    'searchData.businessUserId': options.businessUserId,
                    'searchData.businessUserName': options.businessUserName
                })
                selectUserId = options.businessUserId
            }
            if (!util.isEmpty(options.start)) {
                this.setData({
                    'searchData.start': options.start
                })
            }
            if (!util.isEmpty(options.end)) {
                this.setData({
                    'searchData.end': options.end
                })
            }
        }

        let params = {
            roleName: 'Employees'
        }
        //初始业务员绑定
        await userService
            .getBusinessUsersAsync(params, false)
            .then(res => {
                //console.log('getBusinessUsersAsync', res)
                if (!util.isEmpty(res)) {
                    let users = res.data.map(item => {
                        return {
                            value: item.Id,
                            text: item.UserRealName,
                            faceImage: item.FaceImage
                        }
                    })
                    //console.log('res.users', users);
                    let selectUser = users.find(item => item.value == selectUserId)
                    if (!util.isEmpty(selectUser)) {
                        this.setData({
                            'searchData.businessUserId': selectUser.value,
                            'searchData.pageIndex': 0,
                            'searchData.businessUserName': selectUser.text,
                            'searchData.businessUserUrl': selectUser.faceImage
                        })
                    } else if (user.length >= 1) {
                        this.setData({
                            'searchData.businessUserId': user[0].value,
                            'searchData.pageIndex': 0,
                            'searchData.businessUserName': user[0].text,
                            'searchData.businessUserUrl': user[0].faceImage
                        })
                    } else {
                        user = [{
                            value: 0,
                            text: '员工',
                            businessUserUrl: ''
                        }]
                        this.setData({
                            'searchData.businessUserId': 0,
                            'searchData.pageIndex': 0,
                            'searchData.businessUserName': '员工'
                        })
                    }
                    this.setData({
                        'businessUsers': users
                    })
                }
            })

        //加载终端数据
        this.loadData(true)
    },

    onReady: function () {},
    onShow: function () {
        //console.log('data', this.data)
        this.setData({
            'districts': app.global.districts,
        })
        if (!util.isEmpty(this.data.parames.TerminalId)) {
            this.setData({
                'searchData.terminalId': this.data.parames.TerminalId,
                'searchData.terminalName': this.data.parames.TerminalName,
                'searchData.pageIndex': 0
            }, () => {
                this.loadData()
            })
        }
    },
    onHide: function () {},
    onUnload: function () {},
    //刷新
    onRefresh() {
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
        wx.showLoading({
            title: '刷新中...',
        })
        this.loadData(true)
    },
    onPullDownRefresh: function () {
        this.onRefresh();
    },
    districtIdOptionTap(e) {
        //console.log('districtIdOptionTap', e)
        this.setData({
            'searchData.districtId': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    businessUserIdOptionTap(e) {
        //console.log('businessUserIdOptionTap', e)
        let selectUser = this.data.businessUsers.find(item => item.value == e.detail)
        if (!util.isEmpty(selectUser)) {
            this.setData({
                'searchData.businessUserId': e.detail,
                'searchData.pageIndex': 0,
                'searchData.businessUserName': selectUser.text,
                'searchData.businessUserUrl': selectUser.faceImage
            }, () => {
                this.loadData(true)
            })
        }
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
        this.setData({
            'searchData.start': util.getDate(e.detail[0]),
            'searchData.end': util.getDate(e.detail[1]),
            'searchData.pageIndex': 0
        }, () => {
            //this.loadData(true)
        })
    },
    //选择终端
    terminalChanged(e) {
        wx.navigateTo({
            url: '/packagePages/common/pages/selectCustomerPage/index?type=select'
        });
    },
    terminalClear(e) {
        this.setData({
            'searchData.terminalId': 0,
            'searchData.terminalName': '',
            'parames.terminal': {}
        }, this.loadData(true))
    },
    onReachBottom: function () {
        this.loadMoreData()
    },

    //加载终端数据
    async loadData(isRefresh = true) {
        //条件参数
        var params = {
            pageIndex: this.data.searchData.pageIndex,
            pageSize: app.global.pageSize,
            districtId: this.data.searchData.districtId,
            terminalId: this.data.searchData.terminalId,
            businessUserId: this.data.searchData.businessUserId,
            start: this.data.searchData.start,
            end: this.data.searchData.end
        }

        this.setData({
            isBusy: true
        });

        await terminalService
            .getVisitStoresAsync(params, false)
            .then((res) => {

                this.setData({
                    isBusy: false
                });

                //隐藏loading 提示框
                wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading();
                //停止下拉刷新
                wx.stopPullDownRefresh();


                let terTemp = this.data.recordDatas;
                if (isRefresh) {
                    terTemp = [];
                }
                if (res.data && res.data.length > 0) {
                    //console.log('res.data', res.data)
                    let newData = res.data.map(item => {
                        //签到时间
                        item.SigninDateTimeString = util.moment("yyyy-MM-dd hh:mm:ss", item.SigninDateTime)
                        //销额
                        item.SaleAmountFixed = item.SaleAmount.toFixed(2)
                        //退额
                        item.ReturnAmountFixed = item.ReturnAmount.toFixed(2)
                        //销订额
                        item.SaleOrderAmountFixed = item.SaleOrderAmount.toFixed(2)
                        //退订额
                        item.ReturnOrderAmountFixed = item.ReturnOrderAmount.toFixed(2)
                        //签退时间
                        item.SignOutDateTimeString = util.moment("yyyy-MM-dd hh:mm:ss", item.SignOutDateTime)
                        //在店时间
                        item.OnStoreStopSecondsString = util.twoTimeInterval(item.SigninDateTimeString, item.SignOutDateTimeString)
                        return item
                    });
                    this.setData({
                        recordDatas: terTemp.concat(newData)
                    })
                } else if (isRefresh) {
                    this.setData({
                        recordDatas: terTemp
                    })
                }
            });
    },
    loadMoreData() {
        this.setData({
            'searchData.pageIndex': this.data.searchData.pageIndex + 1
        }, () => {
            this.loadData(false);
        })
    },
    searchDateStartChange(res) {
        //console.log('searchDateStartChange', res);
        this.setData({
            'searchData.start': res.detail.dateString
        })
    },
    searchDateEndChange(res) {
        //console.log('searchDateEndChange', res);
        this.setData({
            'searchData.end': res.detail.dateString
        })
    },
    //确认过滤
    searchDataTap(res) {
        let menu = this.selectComponent('.toolsdropdown')
        menu && menu.close()
        this.loadData(true)
    },
    //签退
    goSignOutTap(e) {
        //console.log('goSignOutTap', e)
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/packagePages/market/pages/visitStorePage/index?terminalId=${id}`
        });
    }
})