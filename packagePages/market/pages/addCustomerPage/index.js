const app = getApp()
const util = require('../../../../utils/util')
const terminalService = require('../../../../services/terminal.service')
const locationUtil = require('../../../../utils/location/location.util')
const FormData = require('../../../../utils/wx-formdata/formData')
Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        districts: app.global.districts,
        channels: app.global.channels,
        lineTiers: app.global.lineTiers,
        ranks: app.global.ranks,
        terminal: {
            Id: 0,
            Name: '',
            BossName: '',
            DoorwayPhoto: '',
            BossCall: '',
            DistrictId: '',
            DistrictName: '',
            ChannelId: '',
            ChannelName: '',
            LineId: '',
            LineName: '',
            RankId: '',
            RankName: '',
            Location_Lng: '',
            Location_Lat: '',
            Code: '',
            BusinessNo: '',
            Address: '',
            Remark: '',
            IsAgreement: false,
            Cooperation: '',
            IsDisplay: false,
            IsVivid: false,
            IsPromotion: false,
            OtherRamark: '',

            FoodBusinessLicenseNo: '',
            EnterpriseRegNo: '',
            MaxAmountOwed: 0,
            Status: true,
            Deleted: false
        },
        terminalRule: {
            nameRule: {
                type: 'string',
                required: true,
                message: '请输入终端名称',
                trigger: 'blur'
            },
            bossNameRule: {
                required: true,
                message: '请输入终端负责人名称',
                trigger: 'blur'
            },
            bossCallRule: [{
                required: true,
                message: '请输入终端负责人电话',
                trigger: 'blur'
            }, {
                pattern: '^1(2|3|4|5|6|7|8|9)\\d{9}$',
                message: '手机号不正确，请重新输入'
            }],
            addressRule: {
                required: true,
                message: '请输入终端详细地址',
                trigger: 'blur'
            }
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.lin.initValidateForm(this)
        let title = '维护终端档案';
        if (options.type == 'edit') {
            title = '编辑终端档案'
            this.loadTerminalInfo(options.id)
        } else if (options.type == 'add') {
            title = '添加终端档案'
            try {
                var value = wx.getStorageSync('protectTerminalInfo')
                if (value) {
                    this.setData({
                        terminal: value
                    })
                }
            } catch (e) {
                //console.log(e)
            }
        }

        wx.setNavigationBarTitle({
            title: title
        })
        this.initBaseData()
    },
    loadTerminalInfo(terminalId) {
        //console.log('terminalId', terminalId)
        terminalService.getTerminalAsync({
            terminalId: terminalId
        }).then(res => {
            //console.log('terminalId', res)
            if (util.isEmpty(res) || util.isEmpty(res.data) || res.success != true) {

            } else {
                if (util.isEmpty(res.data.DoorwayPhoto)) {
                    res.data.DoorwayPhoto = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ynshangji.com%2F00user%2Fproduct0_24%2F2015-8-8%2F447961-16283365.jpg&refer=http%3A%2F%2Fpic.ynshangji.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636615696&t=bf76c224ef3fc3645bf8b117689098aa'
                } else if (!res.data.DoorwayPhoto.startsWith('http')) {
                    res.data.DoorwayPhotos = [`${app.config['resourceDownloadApi']}${res.data.DoorwayPhoto}`]
                } else {
                    res.data.DoorwayPhotos = [res.data.DoorwayPhoto]
                }
                this.setData({
                    terminal: res.data
                })
            }
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
        this.initBaseData()
    },
    initBaseData() {
        let districts = app.global.districts.slice(0)
        let channels = app.global.channels.slice(0)
        let lineTiers = app.global.lineTiers.slice(0)
        let ranks = app.global.ranks.slice(0)
        districts.shift()
        channels.shift()
        lineTiers.shift()
        ranks.shift()
        this.setData({
            districts: districts,
            channels: channels,
            lineTiers: lineTiers,
            ranks: ranks
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    clear() {
        this.setData({
            clear: true
        });
    },
    onClearTap(e) {
        //console.log('onClearTap', e)

        this.setData({
            'terminal.DoorwayPhotos': [],
            'terminal.DoorwayPhoto': ''
        })
        wx.setStorage({
            key: 'protectTerminalInfo',
            data: this.data.terminal
        })
    },
    onChangeTap(e) {
        const count = e.detail.current.length;
        wx.lin.showToast({
            title: `添加${count}张图片~`,
            icon: 'picture',
            duration: 2000,
            iconStyle: 'color:#7ec699; size: 60'
        });
    },
    onRemoveTap(e) {
        const index = e.detail.index;
        wx.lin.showMessage({
            type: 'error',
            content: `删除下标为${index}图片~`,
            duration: 1500,
            icon: 'warning'
        });
    },
    doorHeadPhotoChange(res) {
        //console.log('doorHeadPhotoChange', res)
        let imageTemp = res.detail.current[0]
        //console.log('photoChange', imageTemp)
        //new一个FormData对象
        let formData = new FormData();
        //调用它的append()方法来添加字段或者调用appendFile()方法添加文件
        formData.appendFile("file", imageTemp);
        let data = formData.getData();
        //添加完成后调用它的getData()生成上传数据，之后调用小程序的wx.request提交请求
        wx.request({
            method: 'POST',
            url: `${app.config['resourceUploadApi']}${app.global.storeId}`,
            header: {
                'Authorization': `${app.global.token ? 'Bearer '+app.global.token : 'Basic 123123'}`,
                'content-type': data.contentType
            },
            data: data.buffer,
            success: res => {
                //console.log('up success', res)
                let tempPhotos = this.data.terminal.DoorwayPhotos;
                if (!util.isEmpty(res) && res.statusCode == 200 && res.data.success == true) {
                    let resData = res.data.data
                    if (!util.isEmpty(resData) && !util.isEmpty(resData.Id)) {
                        this.setData({
                            'terminal.DoorwayPhotos': [`${app.config['resourceDownloadApi']}${resData.Id}`],
                            'terminal.DoorwayPhoto': resData.Id
                        })
                        wx.setStorage({
                            key: 'protectTerminalInfo',
                            data: this.data.terminal
                        })
                    } else {
                        wx.showToast({
                            title: '上传照片失败',
                            icon: 'none'
                        });
                    }
                } else {
                    wx.showToast({
                        title: '上传照片失败' + res.errMsg,
                        icon: 'none'
                    });
                }
            },
            fail: res => {
                //console.log('up fail', res)
                wx.showToast({
                    title: '上传照片失败' + res,
                    icon: 'none'
                });
            }
        });
    },
    onNameEdit(e) {
        //console.log('Name', e)
        this.setData({
            'terminal.Name': e.detail.value
        })
    },
    onBossNameEdit(e) {
        this.setData({
            'terminal.BossName': e.detail.value
        })
    },
    onBossCallEdit(e) {
        this.setData({
            'terminal.BossCall': e.detail.value
        })
    },
    onCodeEdit(e) {
        this.setData({
            'terminal.Code': e.detail.value
        })
    },
    onBusinessNoEdit(e) {
        this.setData({
            'terminal.BusinessNo': e.detail.value
        })
    },
    onChannelIdEdit(e) {
        //console.log('onChannelIdEdit', e)
        this.setData({
            'terminal.ChannelId': e.detail.key
        })
    },
    onDistrictIdEdit(e) {
        this.setData({
            'terminal.DistrictId': e.detail.key
        })
    },
    onLineIdEdit(e) {
        this.setData({
            'terminal.LineId': e.detail.key
        })
    },
    onRankIdEdit(e) {
        this.setData({
            'terminal.RankId': e.detail.key
        })
    },
    onIsAgreementEdit(e) {
        //console.log('onIsAgreementEdit', e)
        this.setData({
            'terminal.IsAgreement': e.detail.value
        })
    },
    onIsDisplayEdit(e) {
        this.setData({
            'terminal.IsDisplay': e.detail.value
        })
    },
    onIsVividEdit(e) {
        this.setData({
            'terminal.IsVivid': e.detail.value
        })
    },
    onIsPromotionEdit(e) {
        this.setData({
            'terminal.IsPromotion': e.detail.value
        })
    },
    onOtherRamarkEdit(e) {
        this.setData({
            'terminal.OtherRamark': e.detail.value
        })
    },
    onAddressEdit(e) {
        this.setData({
            'terminal.Address': e.detail.value
        })
    },
    submitterminal(e) {
        //console.log('form', e)
        //手动验证图片
        if (util.isEmpty(this.data.terminal.DoorwayPhoto)) {
            wx.showToast({
                title: '请选择门头照片',
                icon: 'error'
            });
            return
        }
        if (util.isEmpty(this.data.terminal.Name)) {
            wx.showToast({
                title: '请输入终端名称',
                icon: 'error'
            });
            return
        }
        //手动验证渠道
        if (util.isEmpty(this.data.terminal.ChannelId)) {
            wx.showToast({
                title: '请选择终端渠道',
                icon: 'error'
            });
            return
        }
        if (util.isEmpty(this.data.terminal.BossName)) {
            wx.showToast({
                title: '请输入负责人',
                icon: 'error'
            });
            return
        }
        if (util.isEmpty(this.data.terminal.BossCall)) {
            wx.showToast({
                title: '请输入联系电话',
                icon: 'error'
            });
            return
        }
        if (util.isEmpty(this.data.terminal.Address)) {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'error'
            });
            return
        }
        if ((e?.detail?.isValidate) ?? false) {
            //console.log('post terminal', this.data.terminal)
            terminalService.terminalCreateOrUpdateAsync(this.data.terminal).then(res => {
                //console.log('terminalCreateOrUpdateAsync', res)
                if (!util.isEmpty(res) && !util.isEmpty(res.data) && res.data.Success == true) {
                    wx.setStorage({
                        key: 'protectTerminalInfo',
                        data: {}
                    })

                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 3000,
                        complete: function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    });
                } else {
                    wx.showToast({
                        title: `操作失败${res.data.Message}`,
                        icon: 'none',
                        duration: 3000
                    });
                }

            })

        }
    },
    onNaviTerminal(e) {
        wx.chooseLocation({
            success: (res) => {
                //console.log('success', res)
                let bd09 = locationUtil.GCJ02Tobd09II({
                    "lon": res.longitude,
                    "lat": res.latitude
                })
                //console.log(bd09)
                this.setData({
                    'terminal.Address': res.address + res.name,
                    'terminal.Location_Lng': bd09.lon,
                    'terminal.Location_Lat': bd09.lat
                })
            },
            complete: (res) => {
                //console.log('complete', res)

            }
        })
    }
})