const app = getApp()
const printer = require('./printer')
const BillTypeEnum = require('../models/typeEnum')

const printBill = async (deviceInfo, billType, billData, completeFun) => {
    //console.log('进入打印 deviceInfo ', deviceInfo)
    //console.log('进入打印 billType ', billType)
    //console.log('进入打印 billData ', billData)

    wx.showLoading({
        title: '请稍候...',
        mask: true
    });
    //检查蓝牙状态
    await checkBLEConnection(deviceInfo, billType, billData, completeFun)
}

function myOpenBluetoothAdapter(deviceInfo, billType, billData, completeFun) {
    wx.openBluetoothAdapter({
        success(res) {
            //console.log('openBluetoothAdapter success', res)
            //获取蓝牙设备状态
            myGetBluetoothAdapterState(deviceInfo, billType, billData, completeFun)
        },
        fail(sre) {
            //console.log('openBluetoothAdapter fail', sre)
            wx.hideLoading()
            wx.showToast({
                title: '请检查蓝牙是否打开',
                icon: 'none'
            })
        }
    })
}

function myGetBluetoothAdapterState(deviceInfo, billType, billData, completeFun) {
    wx.getBluetoothAdapterState({
        success: res => {
            if (res.available) {
                if (res.discovering) {
                    //蓝牙可用，停止搜索
                    wx.stopBluetoothDevicesDiscovery({
                        success: function (res) {
                            //console.log('stopBluetoothDevicesDiscovery getBluetoothAdapterState', res)
                        }
                    })
                }
            }
            //开启蓝牙搜索
            myStartBluetoothDevicesDiscovery(deviceInfo, billType, billData, completeFun)
        },
        fail: res => {
            //console.log('getBluetoothAdapterState  蓝牙设备不可用', res)
            wx.hideLoading()
            wx.showToast({
                title: '蓝牙设备不可用',
                icon: 'error'
            })
        }
    })
}

function myStartBluetoothDevicesDiscovery(deviceInfo, billType, billData, completeFun) {
    //搜索蓝牙
    wx.startBluetoothDevicesDiscovery({
        //services: [`${deviceInfo.serviceId}`], //characteristicId、deviceId、name、serviceId  如果填写了此UUID，那么只会搜索出含有这个UUID的设备
        success(res) {
            //console.log('startBluetoothDevicesDiscovery success', res)
            setTimeout(function () {
                //获取蓝牙设备
                wx.getBluetoothDevices({
                    success: function (res) {
                        //console.log('getBluetoothDevices', res)
                        let deviceTemp = res.devices.find(item => item.deviceId == deviceInfo.deviceId)
                        if (deviceTemp) {
                            //建立蓝牙连接
                            myCreateBLEConnection(deviceInfo, billType, billData, completeFun)
                        } else {
                            wx.hideLoading()
                            wx.showToast({
                                title: '未发现配对设备，请确保蓝牙设备已打开',
                                icon: 'none'
                            })
                        }
                    },
                    fail: bdres => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '获取蓝牙列表失败请重新尝试',
                            icon: 'none'
                        })
                    }
                })
            }, 3000)
        },
        fail(res) {
            //console.log('startBluetoothDevicesDiscovery fail', res)
            wx.hideLoading()
            //console.log('搜索蓝牙失败', res)
            if (res.errno == 1509009) {
                wx.showToast({
                    title: '请先开启定位服务',
                    icon: 'none'
                })
            } else {
                wx.showToast({
                    title: '请先开启蓝牙服务',
                    icon: 'none'
                })
            }
        }
    })
}

function myOnBluetoothDeviceFound() {
    //监听新设备
    wx.onBluetoothDeviceFound(function (res) {
        //console.log('onBluetoothDeviceFound success', res)
        var devices = res.devices;
        //console.log('onBluetoothDeviceFound success devices', devices)
        res.devices.forEach(item => {
            if (item.name != '' && deviceInfo.deviceId == item.deviceId) {
                //console.log('onBluetoothDeviceFound success deviceId', item)
            }
        })
        let deviceTemp = res.devices.find(deviceInfo.deviceId == item.deviceId)
        if (deviceTemp) {
            //console.log('createBLEConnection', deviceTemp)

        }

    })
}

function myCreateBLEConnection(deviceInfo, billType, billData, completeFun) {
    //连接蓝牙
    wx.createBLEConnection({
        deviceId: `${deviceInfo.deviceId}`,
        timeout: 9000,
        success(rse) {
            //蓝牙连接成功,获取服务
            myGetBLEDeviceServices(deviceInfo, billType, billData, completeFun)
        },
        fail(rse) {
            //console.log('createBLEConnection fail', rse)
            if (rse.errno == 1509007) {
                //错误为已经连接
                myGetBLEDeviceServices(deviceInfo, billType, billData, completeFun)
            } else {
                wx.hideLoading()
                wx.showToast({
                    title: '蓝牙连接失败' + rse.errMsg,
                    icon: 'none'
                })
            }
        },
        complete() {
            wx.stopBluetoothDevicesDiscovery()
        }
    })
}

function checkBLEConnection(deviceInfo, billType, billData, completeFun) {
    wx.getConnectedBluetoothDevices({
        services: [deviceInfo.serviceId],
        success: (res) => {
            //console.log('getConnectedBluetoothDevices success res', res)
            //蓝牙连接成功,获取服务打印
            myGetBLEDeviceServices(deviceInfo, billType, billData, completeFun)
            //wx.hideLoading()
        },
        fail: res => {
            //console.log('getConnectedBluetoothDevices fail res', res)
            //打开蓝牙适配
            myOpenBluetoothAdapter(deviceInfo, billType, billData, completeFun)
        }
    })
}

function myGetBLEDeviceServices(deviceInfo, billType, billData, completeFun) {
    wx.getBLEDeviceServices({
        deviceId: `${deviceInfo.deviceId}`,
        success: async (rse) => {
            if (rse.errCode != 0) {
                if (rse.errCode == 10012) {
                    wx.showToast({
                        title: '连接蓝牙超时请重试',
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    wx.showToast({
                        title: '连接蓝牙异常',
                        icon: 'error',
                        duration: 3000
                    })
                }
                wx.hideLoading()
                return false
            } else {
                //console.log('getBLEDeviceServices complete ', rse)
                let service = rse.services.find(s => s.uuid == deviceInfo.serviceId)
                if (service) {
                    let cur_deviceId = `${deviceInfo.deviceId}`
                    let cur_serviceId = service.uuid;
                    //console.log('getBLEDeviceServices service ', service)
                    await wx.getBLEDeviceCharacteristics({
                        deviceId: cur_deviceId,
                        serviceId: cur_serviceId,
                    }).then(async (srse) => {
                        //console.log('getBLEDeviceCharacteristics service ', srse)
                        wx.hideLoading()
                        for (var j in srse.characteristics) {
                            if (srse.characteristics[j].properties.write) {
                                //console.log('setData ---> arr')
                                let inactive = {
                                    deviceId: cur_deviceId,
                                    serviceId: cur_serviceId,
                                    characteristicId: srse.characteristics[j].uuid,
                                    name: deviceInfo.name
                                }
                                //console.log('srse.characteristics[j].properties.write ', srse)
                                let print = new printer();
                                // print.addEventListener("Completed", function (e) {
                                //     wx.hideLoading()
                                //     wx.showToast({
                                //         title: '打印发送完成',
                                //     })
                                //     if (completeFun) {
                                //         completeFun()
                                //     }
                                // }, false);
                                await print.printBill(billType, billData, inactive)
                                break
                            }
                        }
                        // if (!that.data.inactive[0]) {
                        // wx.showToast({
                        //     title: '获取蓝牙服务失败',
                        //     icon: 'error',
                        //     duration: 3000
                        // })
                        // }
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '未发现蓝牙打印服务，请重新适配蓝',
                        icon: 'none',
                        duration: 5000
                    })
                }
            }

        },
        fail: res => {
            wx.hideLoading()
            //console.log('getBLEDeviceServices fail ', res)
            wx.showToast({
                title: '获取蓝牙服务失败，请重新尝试',
                icon: 'none'
            })
        }
    })
}
const myCloseBLEConnection = (deviceInfo) => {
    wx.closeBLEConnection({
        deviceId: deviceInfo.deviceId,
        success: (rse) => {
            //console.log('myCloseBLEConnection success', rse)
            wx.closeBluetoothAdapter({
                success() {
                    //console.log('关闭蓝牙设备')
                }
            })
        },
        fail: (rse) => {
            //console.log('closeBLEConnection rse', rse)
            // wx.showToast({
            //     title: '蓝牙设备关闭失败，请重新打开蓝牙',
            //     icon: 'none'
            // })
        },
    })
}

module.exports = {
    printBill,
    myCloseBLEConnection
}