const app = getApp()
const util = require('../../../../utils/util')
const chartService = require('../../../../services/chart.service')
const userService = require('../../../../services/user.service')

Page({
    data: {
        userInfo: {},
        onlineUsers: [],
        outlineUsers: [],
        businessUsers: []
    },
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
            title: "业务在线状态"
        })

        this.setData({
            userInfo: app.global.userInfo
        })

        let params = {
            roleName: 'Employees'
        }

        //获取业务员
        await userService
            .getBusinessUsersAsync(params, false)
            .then(res => {
                //console.log('getBusinessUsersAsync', res)
                if (!util.isEmpty(res)) {
                    let users = res.data.map(item => {
                        return {
                            Avatar: item.FaceImage,
                            Name: item.UserRealName,
                            MobileNumber: item.MobileNumber,
                            UserId: item.Id
                        }
                    })
                    this.setData({
                        'businessUsers': users
                    })
                }
            })

        //获取当前在线用户
        await chartService
            .getOnlineUserAsync()
            .then(res => {
                //console.log('getOnlineUserAsync', res)
                if (res != null && res.length > 0) {

                    let allusers = this.data.businessUsers
                    let onlines = res.map(s => {
                        return s.UserId
                    })

                    let onlineUsers = allusers.filter(s => {
                        return onlines.indexOf(s.UserId) >= 0 && s.UserId != this.data.userInfo.Id
                    })

                    let outlineUsers = allusers.filter(s => {
                        return onlines.indexOf(s.UserId) < 0
                    });

                    //console.log('onlineUsers', onlineUsers)
                    //console.log('outlineUsers', outlineUsers)

                    this.setData({
                        onlineUsers: onlineUsers,
                        outlineUsers: outlineUsers,
                    })
                }
            })
    },
    onUnload: function () {

    },
    onMessage: function (e) {
        let user = e.currentTarget.dataset.value
        wx.navigateTo({
            url: '/packagePages/chat/pages/message/index?user=' + JSON.stringify(user)
        });
    }
})