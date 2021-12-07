const app = getApp()
const util = require('../../../../utils/util')
const chartService = require('../../../../services/chart.service')
const userService = require('../../../../services/user.service')
const FormData = require('../../../../utils/wx-formdata/formData')


Page({

    data: {
        newslist: [],
        userInfo: {},
        curUserInfo: {},
        scrollTop: 0,
        increase: false, //图片添加区域隐藏
        aniStyle: true, //动画效果
        message: "",
        previewImgList: [],
        socketUrl: "",
        loadingHidden: true
    },

    onLoad: async function (options) {
        if (options != null) {

            let u = JSON.parse(options.user)

            //console.log('curUserInfo', u)
            //console.log('userInfo', app.global.userInfo)


            this.setData({
                curUserInfo: u,
                userInfo: app.global.userInfo
            })

            let touser = '与' + u.Name + "聊天中..."
            wx.setNavigationBarTitle({
                title: touser
            })
        }

        //接收服务端消息
        try {
            if (app.hubConnect != null) {

                //获取用户消息
                this.getMessages()

                //接收消息
                app.hubConnect.on("ReceiveMessage", res => {
                    //console.log('ReceiveMessage', res)

                    var list = []
                    list = this.data.newslist
                    if (res != null) {
                        list.push(res)
                    }
                    //console.log('newslist', list)
                    this.setData({
                        newslist: list
                    })
                    this.bottom()
                })
            }

        } catch (ex) {
            //console.log(ex)
        }
    },

    getMessages: async function () {
        //接收服务端消息
        try {
            let receiver = this.data.curUserInfo
            let sender = app.global.userInfo;

            if (app.hubConnect != null) {

                await app.hubConnect
                    .invoke("GetMessagesByUsers",
                        sender.Id,
                        receiver.UserId,
                        100).then((res) => {

                        //console.log('GetMessagesByUsers', res)

                        var list = []
                        list = this.data.newslist
                        if (res != null && res.length > 0) {
                            res.forEach(m => {
                                list.push(m)
                            })
                        }

                        //console.log('newslist', list)

                        this.setData({
                            newslist: list
                        })

                        this.bottom()
                    });

            }

        } catch (ex) {
            //console.log(ex)
        }
    },

    //事件处理函数
    send: async function () {

        this.setLoadingHidden(false)
        var flag = this
        if (this.data.increase) {
            wx.showToast({
                title: '不要发送太快哦',
                icon: "none",
                duration: 2000
            })
        }
        let tempData = this.data.message.trim();
        if (tempData === "") {
            wx.showToast({
                title: '消息不能为空哦',
                icon: "none",
                duration: 2000
            })
        } else {
            setTimeout(function () {
                flag.setData({
                    increase: false,
                })
            }, 1000)

             //发送文本
            this.sendMsg('text', this.data.message, '')

            this.bottom()
        }

        this.setLoadingHidden(true)
    },

    sendMsg(type, msg, img) {
        let user = this.data.curUserInfo
        let storeId = app.global.storeId;
        let me = this.data.userInfo;

        let tomessage = {
            content: msg,
            images: img,
            recieverId: user.UserId,
            recieverName: user.Name,
            senderAvatar: me.FaceImage,
            senderId: me.Id,
            senderName: me.UserRealName,
            storeId: storeId,
            type: type
        }

        //console.log('tomessage', tomessage)

        //发送消息
        app.hubConnect.send("SendMessageToUser",
            tomessage,
            storeId,
            user.Name,
            user.UserId);

        var list = []
        list = this.data.newslist
        list.push(tomessage)

        //console.log('list', list)

        this.setData({
            newslist: list,
            message: ""
        })
    },

    //监听input值的改变
    bindChange(res) {
        this.setData({
            message: res.detail.value
        })
    },
    cleanInput() {
        //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
        this.setData({
            message: this.data.message
        })
    },
    increase() {
        this.setData({
            increase: true,
            aniStyle: true
        })
    },
    //点击空白隐藏message下选框
    outbtn() {
        this.setData({
            increase: false,
            aniStyle: true
        })
    },
    chooseImage() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {

                that.setLoadingHidden(false)

                if (util.isNull(res)) {
                    return false;
                }

                var tempFilePaths = res.tempFilePaths
                let filePath = tempFilePaths[0]

                let formData = new FormData();
                formData.appendFile("file", filePath);
                let data = formData.getData();

                wx.request({
                    method: 'POST',
                    url: `${app.config['resourceUploadApi']}${app.global.storeId}`,
                    header: {
                        'Authorization': 'Bearer ' + app.global.token,
                        'content-type': data.contentType
                    },
                    data: data.buffer,
                    success: async res => {
                        //console.log('request', res)
                        if (!util.isEmpty(res) &&
                            res.statusCode == 200 &&
                            res.data.success == true) {
                            let resData = res.data.data
                            if (!util.isEmpty(resData) && !util.isEmpty(resData.Id)) {

                                let url = `${app.config['resourceDownloadApi']}${resData.Id}`
                                //console.log('url', url)

                                //发送图文
                                this.sendMsg('image', '', url)
                            }
                        }

                        that.setLoadingHidden(true)
                        that.bottom()
                    },
                    fail: res => {
                        that.setLoadingHidden(true)
                    }
                });
            }
        })
    },

    //图片预览
    previewImg(e) {
        var that = this
        //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
        var res = e.target.dataset.src
        var list = that.data.previewImgList //页面的图片集合数组
        
        //console.log('e',e)
        //console.log('res',res)
        //console.log('list',list)


        //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
        if (list.indexOf(res) == -1) {
            that.data.previewImgList.push(res)
        }
        wx.previewImage({
            current: res, // 当前显示图片的http链接
            urls: that.data.previewImgList // 需要预览的图片http链接列表
        })
    },
    //聊天消息始终显示最底端
    bottom: function () {
        let that = this
        wx.pageScrollTo({
            // scrollTop: res[0].bottom  // #the-id节点的下边界坐标
            scrollTop: that.data.newslist.length * 1000 // #the-id节点的下边界坐标
        })
    },
    setLoadingHidden(isHidden) {
        this.setData({
            loadingHidden: isHidden
        })
    },
})