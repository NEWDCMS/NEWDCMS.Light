var util = require('../../../../utils/util')
const printer = require('../../../../printer/printer')
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        parameter: '',
        userInfo: {},
        //URL参数体
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        showloading: false,
        //启用蓝牙
        disabledPrint: true,
        //启用蓝牙
        serchChangeChecked: false,
        //启用间断打印方式
        intermittentChangeChecked: false,
        //设备集合{deviceId:'',name:'',tag:'',state：true}
        deviceList: [],
        //当前适配的设备Id
        deviceId: '',
        //已经适配的适设备信息
        inactive: [],
        //断开连接状态
        disabledDisconnect: true,
        //打印测试数据
        printData: {
            typeName: '销售凭证',
            billNumber: 'XS2021034343434343',
            bossCall: '13958595599',
            terminalName: '桃心岛商场',
            address: '陕西省汉中市天汉大道',
            wareHouse: '主仓库',
            items: [{
                name: '雪花勇闯天涯500ML1*12',
                unitName: '10箱',
                price: '8.00',
                amount: '赠品'
            }, {
                name: '勇闯天涯瓶装1*6纸箱有奖版',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }, {
                name: '雪花勇闯天涯8度500ml听6*4塑膜六连包运输装纸箱',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }, {
                name: '雪花勇闯天涯',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }, {
                name: '雪花勇闯天涯',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }, {
                name: '雪花勇闯天涯',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }, {
                name: '雪花勇闯天涯',
                unitName: '10箱',
                price: '8.00',
                amount: '232.33'
            }]
        },
        //纸张类型
        paperTypes: [{
                name: '58MM打印样式',
                value: '58',
                checked: 'false'
            },
            {
                name: '76MM打印样式',
                value: '76',
            }, {
                name: '80MM打印样式',
                value: '80',
            }
        ]
    },

    //纸张配置
    paperChange(e) {
        //console.log('e.detail.value:', e.detail.value)
        switch (e.detail.value) {
            case '58': {
                app.global.MAX_CHAR_COUNT_EACH_LINE = 31
                app.global.PAGE_WIDTH = 380
                break;
            }
            case '76': {
                app.global.MAX_CHAR_COUNT_EACH_LINE = 35
                app.global.PAGE_WIDTH = 420
                break;
            }
            case '80': {
                app.global.MAX_CHAR_COUNT_EACH_LINE = 47
                app.global.PAGE_WIDTH = 470
                break;
            }
        }
        //console.log('MAX_CHAR_COUNT_EACH_LINE:', app.global.MAX_CHAR_COUNT_EACH_LINE)
    },

    //启用蓝牙搜索
    async serchChange(e) {
        if (e.detail.value) {
            //初始化
            this.setData({
                deviceList: []
            })

            wx.showLoading({
                mask: true,
                title: '扫描中...'
            })
            await util.sleep(2000);
            var that = this
            //搜索设备
            wx.startBluetoothDevicesDiscovery({
                //services: ['180A'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写
                success(res) {
                    wx.hideLoading()
                    //console.log('搜索设备', res)
                    //监听新设备
                    wx.onBluetoothDeviceFound(function (res) {
                        var devices = res.devices;
                        //console.log(devices)
                        that.setData({
                            showloading: true
                        })
                        if (devices[0].name != '') {
                            //console.log(devices[0])
                            var list = that.data.deviceList
                            var cur = devices[0];
                            cur.tag = "连接";
                            cur.state = false;
                            list.push(cur)
                            //更新列表
                            that.setData({
                                deviceList: list,
                                disabledPrint: false,
                                serchChangeChecked: true
                            })
                        }
                        // //console.log(util.ab2hex(devices[0].advertisData))
                    })
                },
                fail(res) {

                    wx.hideLoading()
                    //console.log('搜索蓝牙失败', res)
                    if (res.errno == 1509009) {
                        wx.showToast({
                            title: '请先开启定位服务'
                        })
                    } else {
                        wx.showToast({
                            title: '请先开启蓝牙服务'
                        })
                    }

                    that.setData({
                        disabledPrint: true,
                        serchChangeChecked: false,
                        intermittentChangeChecked: false
                    })
                }
            })
        } else {
            this.setData({
                disabledPrint: true,
                showloading: false
            })
        }
    },

    //启用间断打印方式
    intermittentChange() {

    },

    //连接蓝牙设备
    async connectOrdisconnect(v) {

        if (util.isNull(v)) {
            wx.showToast({
                title: '参数错误'
            })
            return false;
        }

        //当前选择设备
        let curItem = v.currentTarget.dataset.key;

        //console.log('curItem--->')
        //console.log(curItem)

        if (this.data.inactive.length > 0) {
            //console.log(this.data.inactive[0])
            //当前连接设备
            let deviceId = this.data.inactive[0].deviceId;

            //同时只能支持一台设备
            if (deviceId != curItem.deviceId) {
                wx.showToast({
                    title: '请先断开连接设备'
                })
                return false;
            }
        }

        this.setData({
            deviceId: curItem.deviceId
        })


        //连接状态时，断开设备
        if (curItem.state) {

            //console.log('-----------更新状态连接-----------------')
            //console.log(this.data.inactive)
            if (this.data.inactive.length == 0) {
                return false
            }


            let deviceId = this.data.inactive[0].deviceId
            if (util.isNull(deviceId)) {
                wx.showToast({
                    title: '没找到设备',
                    icon: 'success'
                })
                return false
            }

            //断开...
            let arrp = this.data.deviceList;
            var that = this
            this.closeDevice(that, curItem, arrp)

            //更新状态
            arrp.forEach(p => {
                if (p.deviceId == curItem.deviceId) {
                    p.state = false;
                    p.tag = "连接";
                }
            })
            this.setData({
                deviceList: arrp
            })

        } else {

            //关闭状态时，连接设备
            //console.log('-----------更新状态为断开-----------------')

            wx.showLoading({
                mask: true,
                title: '连接蓝牙中'
            })

            //连接中...
            let arrp = this.data.deviceList;
            var that = this

            await this.openDevice(that, curItem, arrp)
                .then((inactive) => {
                    wx.hideLoading();
                    //更新状态
                    arrp.forEach(p => {
                        if (p.deviceId == curItem.deviceId) {
                            p.state = true;
                            p.tag = "断开";
                        }
                    })

                }).catch((ex) => {
                    wx.hideLoading();
                })

            while (!that.data.disabledDisconnect) {
                await util.sleep(1000);
            }

            this.setData({
                deviceList: arrp
            })
        }
    },

    //连接设备
    openDevice(that, curItem, arrps) {
        return new Promise((resolve, reject) => {
            wx.createBLEConnection({
                deviceId: curItem.deviceId,
                timeout: 9000,
                success(rse) {
                    //console.log('连接蓝牙情况', rse)
                    wx.getBLEDeviceServices({
                        deviceId: curItem.deviceId,
                        complete(rse) {
                            if (rse.errCode != 0) {
                                if (rse.errCode == 10012) {
                                    wx.showToast({
                                        title: '连接蓝牙超时请重试',
                                        icon: 'error',
                                        duration: 1000
                                    })
                                } else {
                                    wx.showToast({
                                        title: '连接蓝牙异常',
                                        icon: 'error',
                                        duration: 1000
                                    })
                                }
                                return
                            }

                            //查询特征值
                            that.setData({
                                inactive: []
                            })

                            for (var i in rse.services) {

                                let cur_deviceId = curItem.deviceId;
                                let cur_serviceId = rse.services[i].uuid;

                                wx.getBLEDeviceCharacteristics({
                                    deviceId: cur_deviceId,
                                    serviceId: cur_serviceId,
                                    complete(srse) {

                                        if (that.data.inactive[0]) {
                                            return
                                        }

                                        for (var j in srse.characteristics) {
                                            if (srse.characteristics[j].properties.write) {

                                                var arr = that.data.inactive
                                                //console.log(that.data.inactive, '查询值')

                                                arr.push({
                                                    deviceId: cur_deviceId,
                                                    serviceId: cur_serviceId,
                                                    characteristicId: srse.characteristics[j].uuid,
                                                    name: curItem.name
                                                })

                                                wx.setStorageSync('bluetooth', curItem)

                                                //console.log('setData ---> arr')
                                                //console.log(arr)

                                                that.setData({
                                                    showloading: false,
                                                    disabledDisconnect: true,
                                                    inactive: arr
                                                })
                                                wx.setStorageSync('inactive', arr[0])

                                                //连接成功
                                                resolve(arr[0])

                                                that.speedUp(cur_deviceId)

                                                break
                                            }
                                        }
                                        if (!that.data.inactive[0]) {

                                            wx.showToast({
                                                title: '适配失败',
                                                icon: 'error',
                                                duration: 1000
                                            })

                                            reject()
                                        }
                                    }
                                })
                            }
                        }
                    })
                },
                fail(rse) {
                    that.setData({
                        disabledDisconnect: true
                    })
                    wx.showToast({
                        title: '适配失败',
                        icon: 'error',
                        duration: 1000
                    })
                    reject()
                },
                complete() {
                    that.setData({
                        showloading: false
                    })
                    wx.stopBluetoothDevicesDiscovery({
                        success() {
                            //console.log('停止搜索蓝牙')
                        }
                    })
                }
            })
        })
    },

    //关闭设备
    closeDevice(that, curItem, arrps) {

        wx.closeBLEConnection({
            deviceId: curItem.deviceId,
            success(rse) {
                //console.log(rse)
                wx.showToast({
                    title: '断开设备成功',
                    icon: 'success',
                    duration: 1000
                })
                that.setData({
                    disabledDisconnect: false,
                    inactive: []
                })
            },
            fail(res) {
                wx.showToast({
                    title: '断开失败',
                    icon: 'success'
                })
            },
            complete(res) {
                if (res.errCode == '10006') {
                    that.setData({
                        disabledDisconnect: false,
                        inactive: []
                    })
                    wx.showToast({
                        title: '连接已经断开',
                        icon: 'success'
                    })
                }
            }
        })
    },

    //提速
    speedUp(id) {
        wx.setBLEMTU({
            deviceId: id,
            mtu: 510
        })
    },

    //打印数据
    printData(e) {
        let print = new printer();
        //完成回调
        print.addEventListener("Completed", function (e) {
            wx.showToast({
                title: '打印完毕',
            })
            //console.log('打印完毕', e)
        }, false);

        let inactive = this.data.inactive[0];
        if (util.isNull(inactive)) {
            wx.showToast({
                title: '请连接打印机',
                icon: 'error',
                duration: 1000
            })
            return;
        }


        //调拨测试
        let test_31 = {
            BillNumber: 'XS2021034343434343',
            BossCall: '13958595599',
            TerminalName: '桃心岛商场',
            Address: '陕西省汉中市天汉大道',
            WareHouseName: '主仓库',
            CreatedOnUtc: util.time(),
            ShipmentWareHouseName: '主仓库',
            IncomeWareHouseName: '主仓库2',
            MakeUserName: '小李',
            Items: [{
                ProductName: '雪花勇闯天涯500ML1*12',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '勇闯天涯瓶装1*6纸箱有奖版',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '雪花勇闯天涯8度500ml听6*4塑膜六连包运输装纸箱',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                Subtotal: '赠品'
            }]
        }

        //销售订单测试
        let test_11 = {
            BillNumber: 'XD2021034343434343',
            BossCall: '13958595599',
            TerminalName: '桃心岛商场',
            Address: '陕西省汉中市天汉大道',
            WareHouseName: '主仓库',
            CreatedOnUtc: util.time(),
            SumAmount: 2323.88,
            PreferentialAmount: 0,
            OweCash: 0,
            Remark: '备注测试',
            BusinessUserName: '小李',
            Items: [{
                ProductName: '雪花勇闯天涯500ML1*12',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '勇闯天涯瓶装1*6纸箱有奖版',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: false,
                Remark: '',
                Subtotal: 3434.67
            }, {
                ProductName: '雪花勇闯天涯8度500ml听6*4塑膜六连包运输装纸箱',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: false,
                Remark: '',
                Subtotal: 3434.67
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }]
        }

        //销售单测试
        let test_12 = {
            BillNumber: 'XS2021034343434343',
            BossCall: '13958595599',
            TerminalName: '桃心岛商场',
            Address: '陕西省汉中市天汉大道',
            WareHouseName: '主仓库',
            CreatedOnUtc: util.time(),
            SumAmount: 2323.88,
            PreferentialAmount: 0,
            OweCash: 0,
            Remark: '备注测试',
            BusinessUserName: '小李',
            Items: [{
                ProductName: '雪花勇闯天涯500ML1*12',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '勇闯天涯瓶装1*6纸箱有奖版',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: false,
                Remark: '',
                Subtotal: 3434.67
            }, {
                ProductName: '雪花勇闯天涯8度500ml听6*4塑膜六连包运输装纸箱',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: false,
                Remark: '',
                Subtotal: 3434.67
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }, {
                ProductName: '雪花勇闯天涯',
                UnitName: '箱',
                Quantity: 10,
                IsGifts: true,
                Remark: '赠品',
                Subtotal: 0
            }]
        }

        //收款单测试
        let test_41 = {
            BillNumber: 'SK2021034343434343',
            BossCall: '13958595599',
            TerminalName: '桃心岛商场',
            Address: '陕西省汉中市天汉大道',
            CreatedOnUtc: util.time(),
            SumAmount: 2323.88,
            PreferentialAmount: 0,
            OweCash: 0,
            Remark: '备注测试',
            BusinessUserName: '小李',
            Items: [{
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }, {
                BillNumber: 'XS2021034343434343',
                DiscountAmountOnce: 3434.67,
                ReceivableAmountOnce: 455.66
            }]
        }

        // print.printBill(31, test_31, inactive);
        // print.printBill(11, test_11, inactive);
        print.printBill(12, test_12, inactive);
        // print.printBill(41, test_41, inactive);

    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "打印适配设置"
        })

        this.setData({
            userInfo: app.global.userInfo
        })
    },
    onReady: function () {
        var that = this
        if (that.data.parameter != '') {
            if (wx.getStorageSync('bluetooth')) {
                //console.log('自动连接')
                wx.getBluetoothAdapterState({
                    success(res) {
                        if (res.available) {
                            that.connect(wx.getStorageSync('bluetooth'))
                        }
                    }
                })
            } else {
                wx.showToast({
                    title: '请手动连接',
                    icon: 'error'
                })
            }
        }
        //打开蓝牙适配器
        wx.openBluetoothAdapter({
            success(res) {
                wx.showToast({
                    title: '蓝牙适配已打开',
                    icon: 'success'
                })
            },
            fail(sre) {
                //console.log(sre);
                wx.showToast({
                    title: '蓝牙打开失败',
                    icon: 'error',
                    duration: 5000
                })
            }
        })
    },
    onUnload: function () {
        var id = this.data.deviceId
        this.closeBluetoothAdapter(id)
    },
    closeBluetoothAdapter(id) {
        wx.closeBLEConnection({
            deviceId: id,
            success(rse) {
                //console.log('断开设备成功')
                wx.closeBluetoothAdapter({
                    success() {
                        //console.log('关闭蓝牙设备')
                    }
                })
            }
        })
    }
})