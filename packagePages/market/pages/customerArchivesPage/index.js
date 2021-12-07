const app = getApp()
const util = require('../../../../utils/util')
const locationUtilWx = require('../../../../utils/location/location.wx')
const locationUtil = require('../../../../utils/location/location.util')
const terminalService = require('../../../../services/terminal.service')
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
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
        index: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "终端档案"
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
        //console.log('onshow')
        this.setData({
            districts: app.global.districts,
            channels: app.global.channels,
            lineTiers: app.global.lineTiers,
            ranks: app.global.ranks,
            locationRanges: app.global.locationRanges
        }, () => {
            locationUtilWx.myGetWxLocation().then((res) => {
                this.loadData(true)
            });
        })
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
        if (this.data.loading && this.data.index === 0) {
            this.setData({
                show: true,
                type: 'loading'
            });
            this.loadMoreData();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    //导航
    onNaviTerminal: function (e) {
        let terminal = e.currentTarget.dataset.item
        let gcjo2 = locationUtil.bd09IIToGCJ02({
            lon: terminal.Location_Lng,
            lat: terminal.Location_Lat
        })
        wx.openLocation({
            latitude: gcjo2.lat,
            longitude: gcjo2.lon,
            name: terminal.Name,
            address: terminal.Address
        })
    },
    //编辑终端
    onEditTerminal: function (e) {
        wx.navigateTo({
            url: '/packagePages/market/pages/addCustomerPage/index?type=edit&id=' + e.currentTarget.dataset.value
        });
    },
    //添加终端
    onAddTerminal: function () {
        wx.navigateTo({
            url: '/packagePages/market/pages/addCustomerPage/index?type=add'
        });
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

        if (!util.isNotEmpty(e.detail.value)) {
            wx.showToast({
                title: '请输入关键字！',
                icon: 'none'
            });
            return;
        }

        this.setData({
            'searchData.searchStr': e.detail.value,
            'searchData.pageIndex': 0
        }, () => {
            this.loadData(true)
        })
    },
    loadData(isRefresh) {
        //districtId searchStr channelId rankId range 
        var params = {
            searchStr: this.data.searchData.searchStr,
            pageIndex: this.data.searchData.pageIndex,
            pageSize: app.global.pageSize,
            districtId: this.data.searchData.districtId,
            channelId: this.data.searchData.channelId,
            rankId: this.data.searchData.rankId,
            range: this.data.searchData.locationRange,
            lineId: this.data.searchData.lineTierId
        }
        terminalService.getTerminalsAsync(params, isRefresh).then((res) => {
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
            this.setData({
                terminaldata: terTemp
            })
            //console.log(terTemp)

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
    }
})