const app = getApp()
const util = require('./util')
const terminalService = require('../services/terminal.service')
const settingService = require('../services/setting.service')
const userService = require('../services/user.service')
import MenuEnum from '../models/menuEnum'
import sessionStateEnum from '../models/sessionStateEnum'
const checkLogin = async () => {
    //TODO 加强token验证
    return new Promise((resolve, reject) => {
        if (util.isEmpty(app.global.token) || util.isEmpty(app.global.userInfo)) {
            app.global.sessionState = sessionStateEnum.activating
            wx.showToast({
                title: '请重新登录',
                icon: 'error',
                complete: () => {
                    app.global.token = '';
                    app.global.userInfo = {}
                    setTimeout(() => {
                      wx.reLaunch({
                        url: '/pages/login/index',
                        complete: (res) => {}
                      })
                    }, 100);
                }
            })
        } else {
            app.global.sessionState = sessionStateEnum.valid
            return resolve(true)
        }
        app.global.sessionState = sessionStateEnum.invalid
        return resolve(false)
    })
}
const getBasicData = async () => {
    return new Promise((resolve, reject) => {
        terminalService.getDistrictsAsync().then(res => {
            //console.log('getDistrictsAsync', res)
            if (!util.isEmpty(res) && res.Return == 0 && res.success == true) {
                app.global.districts = [{
                    text: '片区',
                    value: 0
                }].concat(res.data.map(res => {
                    return {
                        text: res.Name,
                        value: res.Id
                    }
                }))
            }
        })
        terminalService.getChannelsAsync().then(res => {
            //console.log('getChannelsAsync', res)
            if (!util.isEmpty(res) && res.Return == 0 && res.success == true) {
                app.global.channels = [{
                    text: '渠道',
                    value: 0
                }].concat(res.data.map(res => {
                    return {
                        text: res.Name,
                        value: res.Id
                    }
                }))
            }
        })
        terminalService.getLineTiersAsync().then(res => {
            //console.log('getLineTiersAsync', res)
            if (!util.isEmpty(res) && res.Return == 0 && res.success == true) {
                app.global.lineTiers = [{
                    text: '线路',
                    value: 0
                }].concat(res.data.map(res => {
                    return {
                        text: res.Name,
                        value: res.Id
                    }
                }))
            }
        })
        terminalService.getRanksAsync().then(res => {
            //console.log('getRanksAsync', res)
            if (!util.isEmpty(res) && res.Return == 0 && res.success == true) {
                app.global.ranks = [{
                    text: '等级',
                    value: 0
                }].concat(res.data.map(res => {
                    return {
                        text: res.Name,
                        value: res.Id
                    }
                }))
            }
        })
        settingService.getCompanySettingAsync().then(
            res => {
                //console.log('setting', res)
                app.global.companySetting = {}
                if (res.Return == 0 && res.success == true) {
                    app.global.companySetting = res.data
                }
            }
        )
        //初始化员工存储
        userService.getUsersAsync('Employees').then((users) => {
            ////console.log('users:', users)
            let data = users.map(s => {
                return {
                    id: s.Id,
                    name: s.UserRealName
                };
            });
            wx.setStorageSync('businessUsers', data)
        });
        userService.getSubUsersAsync().then((users) => {
            //console.log('getSubUsersAsync:', users)
            if (users.code > 0) {
                let data = users.data.map(s => {
                    return {
                        id: s.Id,
                        name: s.UserRealName
                    };
                });
                app.global.subUsers = data
            }
        });
    })
}

const checkBusinessTime = async (billType) => {
    let result = await settingService.getCompanySettingAsync().then(res => {
        let check = {
            isBillTime: false,
            startTime: ' ',
            endTime: ' '
        }
        //console.log('getCompanySettingAsync', res)
        if (res.Return == 0 && res.success == true) {
            //TODO 测试数据
            // res.data.EnableBusinessTime = true
            // res.data.BusinessStart = '2021-11-24T8:00:00'
            // res.data.BusinessEnd = '2021-11-24T10:00:00'
            if (util.isEmpty(res.data?.EnableBusinessTime) || res.data?.EnableBusinessTime == false) {
                check.isBillTime = true
                return check
            } else {
                let start = (res.data?.BusinessStart ?? '').toString()
                let end = (res.data?.BusinessEnd ?? '').toString()
                let startTIndex = start.lastIndexOf('T') >= 0 ? (start.lastIndexOf('T') + 1) : -1
                let endTIndex = end.lastIndexOf('T') >= 0 ? (end.lastIndexOf('T') + 1) : -1
                if (util.isEmpty(start) || util.isEmpty(end) || startTIndex == -1 || endTIndex == -1) {
                    check.isBillTime = true
                    return check
                }
                check.startTime = start.substring(startTIndex)
                check.endTime = end.substring(endTIndex)
                let startDateTime = new Date(Date.parse(util.now(0) + ' ' + check.startTime));
                let endTDateime = new Date(Date.parse(util.now(0) + ' ' + check.endTime));
                // util.time()
                let nowTime = new Date(Date.parse(util.time()))
                if (startDateTime <= nowTime && nowTime <= endTDateime) {
                    check.isBillTime = true
                    return check
                } else {
                    check.isBillTime = false
                    return check
                }
            }
            return check
        } else {
            return check
        }
    })
    return result
}

const checkPermission = (permission) => {
    let perIndex = app.global.userInfo.PermissionRecords.findIndex(item => {
        return item.Code == permission
    })
    if (perIndex >= 0) {
        return true
    }
    return false
}

module.exports = {
    checkLogin,
    getBasicData,
    checkPermission,
    checkBusinessTime
}