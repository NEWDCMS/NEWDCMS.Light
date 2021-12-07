const locationUtilWx = require('../../../../utils/location/location.wx')
const locationUtil = require('../../../../utils/location/location.util')
const terminalService = require('../../../../services/terminal.service')
const app = getApp()
const util = require('../../../../utils/util')

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        isBusy: true,
        mapMode: false,
        latitude: app.global.bd09_location.lat,
        longitude: app.global.bd09_location.lon,
        markers: [{
            id: 1,
            iconPath: '../../../../images/water_drop.png',
            latitude: app.global.bd09_location.lat,
            longitude: app.global.bd09_location.lon,
            width: 40,
            height: 40
        }],
        searchData: {
            pageIndex: 0,
            searchStr: '',
            districtId: 0,
            channelId: 0,
            lineTierId: 0,
            rankId: 0,
            locationRange: app.global.locationRange
        },
        terminaldata: [],
        districts: app.global.districts,
        channels: app.global.channels,
        lineTiers: app.global.lineTiers,
        ranks: app.global.ranks,
        locationRanges: app.global.locationRanges,
        imgShow: false,
        show: false,
        loading: true,
        index: 0
    },
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "选择终端客户"
        })

        if (!util.isNull(options)) {

            this.setData({
                parames: options
            });

            //页面传递参数
            if (!util.isNull(options.keys)) {
                let keys = JSON.parse(options.keys)
                //console.log('keys==============================')
                //console.log('keys', keys)
                this.setData({
                    'searchData.searchStr': keys.length > 0 ? keys.join(',') : ''
                });
            }

            await locationUtilWx.myGetWxLocation()
                .then((res) => {
                    //console.log('myGetWxLocation', res)
                    this.loadData(true)
                });
        }

        //初始加载终端
        await locationUtilWx.myGetWxLocation()
            .then((res) => {
                //console.log('myGetWxLocation', res)
                this.loadData(true)
            });

    },
    filterViewMove: function () {},
    onReady: function () {
        var that = this
        that.mapCtx = wx.createMapContext('mymap')
    },
    onShow: function () {
        this.setData({
            'districts': app.global.districts,
            'channels': app.global.channels,
            'lineTiers': app.global.lineTiers,
            'ranks': app.global.ranks,
            'locationRanges': app.global.locationRanges,
        }, () => {
            locationUtilWx.myGetWxLocation().then((res) => {
                //console.log('myGetWxLocation', res)
                this.loadData(true)
            });
        })
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    goSignIn(e) {
        wx.navigateTo({
            url: this.data.parames.navigatemark + '?terminalId=' + e.currentTarget.dataset.item.Id
        });
    },
    //选择
    goSelect(e) {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        let item = e.currentTarget.dataset.item
        prePage.setData({
            'parames.TerminalId': item.Id,
            'parames.TerminalName': item.Name,
            'parames.TerminalBossCall': item.BossCall,
            'parames.TerminalAddress': item.Address
        }, () => {
            wx.navigateBack()
        })

    },
    //阻止冒泡
    doNothing() {},
    //新增终端
    onAddTerminal() {
        wx.navigateTo({
            url: '/packagePages/market/pages/addCustomerPage/index?type=add'
        });
    },
    //切换地图模式
    onMapMarked() {
        this.setData({
            mapMode: !this.data.mapMode
        })
    },
    // tag事件
    ontaglintap(event) {
        const index = event.currentTarget.dataset.index;
        const type = event.currentTarget.dataset.type;
        //console.log(index);
        //console.log(type);
        let filterDemo = this.data.filterDemo;
        filterDemo[type][index].active = !filterDemo[type][index].active;
        this.setData({
            filterDemo
        });
    },

    onReachBottom: function () {
        if (this.data.loading && this.data.index === 0) {
            this.setData({
                show: true,
                type: 'loading'
            });
            this.loadMoreData();
        }
        if (this.data.loading && this.data.index === 1) {
            this.setData({
                show: true,
                type: 'loading'
            });
            setTimeout(() => {
                this.setData({
                    show: true,
                    type: 'end',
                    loading: false
                });
            }, 800);
        }
    },
    searchBarClear() {
        this.setData({
            'searchData.searchStr': '',
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    searchBarInput(e) {
        this.setData({
            'searchData.searchStr': e.detail.value,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    async loadData(isRefresh) {

        this.setData({
            isBusy: true
        });

        var params = {
            searchStr: this.data.searchData.searchStr,
            pageIndex: this.data.searchData.pageIndex,
            pageSize: app.global.pageSize,
            districtId: this.data.searchData.districtId,
            channelId: this.data.searchData.channelId,
            rankId: this.data.searchData.rankId,
            range: this.data.searchData.locationRange,
            lineId:this.data.searchData.lineTierId
        }
        await terminalService
            .getTerminalsAsync(params, false)
            .then((res) => {
                //console.log('getTerminalsAsync', res)
                let terTemp = this.data.terminaldata;
                if (isRefresh) {
                    terTemp = [];
                }
                if (res.data && res.data.length > 0) {
                    res.data.forEach(e => {
                        let isExist = terTemp.find(t => {
                            return t.Id == e.Id;
                        });
                        if (!isExist) {
                            var dis = locationUtil.getDistance(e.Location_Lat, e.Location_Lng, app.global.bd09_location.lat, app.global.bd09_location.lon);
                            e.Distance = dis;
                            terTemp.push(e);
                        }
                    });
                }
                if (terTemp.length > 0) {
                    terTemp.sort((a, b) => {
                        return a - b;
                    })
                }
                let markers = terTemp.map(s => {
                    return {
                        id: s.Id,
                        name: s.Name,
                        iconPath: '../../../../images/water_drop.png',
                        latitude: s.Location_Lat,
                        longitude: s.Location_Lng,
                        width: 40,
                        height: 40
                    };
                });
                //console.log('markers', markers)
                //markers
                this.setData({
                    markers: markers,
                    terminaldata: terTemp
                })
                //console.log(terTemp)
            });

        this.setData({
            isBusy: false
        });
    },
    loadMoreData() {
        this.setData({
            'searchData.pageIndex': this.data.searchData.pageIndex + 1
        }, () => {
            this.loadData(false);
        })
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
    channelIdOptionTap(e) {
        //console.log('channelId', e)
        this.setData({
            'searchData.channelId': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    lineTierIdOptionTap(e) {
        //console.log('lineTierId', e)
        this.setData({
            'searchData.lineTierId': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    rankIdOptionTap(e) {
        //console.log('rankId', e)
        this.setData({
            'searchData.rankId': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    locationRangeOptionTap(e) {
        //console.log('locationRange', e)
        this.setData({
            'searchData.locationRange': e.detail,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    //拨打电话事件
    onCall: function (e) {
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    // 获取用户的位置
    getLocationInfo() {
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                //console.log(res)
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [{
                        id: 1,
                        iconPath: '../../../../images/water_drop.png',
                        latitude: res.latitude,
                        longitude: res.longitude,
                        width: 40,
                        height: 40
                    }]
                })
            },
        })
    },
    // d定位当前位置
    getlocation() {
        var that = this
        wx.getLocation({
            type: 'gcj02', //最好带上type
            success: function (res) {
                //console.log(res)
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [{
                        id: 1,
                        iconPath: '../../../../images/water_drop.png',
                        latitude: res.latitude,
                        longitude: res.longitude,
                        width: 40,
                        height: 40
                    }]
                })
            },
        })
    },
    // 当视图发生变化时触发
    bindregionchange(e) {
        var that = this
        if (e.type == 'end') {
            that.mapCtx.getCenterLocation({
                success: function (res) {
                    // //console.log(res)
                    // that.setData({
                    //     markers: [{
                    //         id: 1,
                    //         iconPath: '../../../../images/water_drop.png',
                    //         latitude: res.latitude,
                    //         longitude: res.longitude,
                    //         width: 40,
                    //         height: 40
                    //     }]
                    // })
                }
            })
        }
    }
})