const app = getApp();
const authService = require('../../../../services/authentication.service')
const util = require('../../../../utils/util')
const FormData = require('../../../../utils/wx-formdata/formData')

import {
    isDef,
    isNumber,
    isPlainObject,
    isPromise
} from '../../../../dist/common/validator';

Page({
    data: {
        type: 1,
        currentConfig: {
            show: false,
            zIndex: 99,
            imageUrl: '',
            type: 'url',
            quality: 1,
            width: 400,
            height: 400,
            minWidth: 200,
            maxWidth: 600,
            minHeight: 200,
            maxHeight: 600,
            lockWidth: false,
            lockHeight: false,
            lockRatio: false,
            scaleRatio: 1,
            minRatio: 0.5,
            maxRatio: 2,
            disableScale: false,
            disableRotate: false,
            limitMove: false,
            resultImageUrl: app.global.userInfo.FaceImage,
            checkImage: true,
            checkImageIcon: './images/photo.png',
            rotateAlong: true,
            rotateAlongIcon: './images/rotate-along.png',
            rotateInverse: true,
            rotateInverseIcon: './images/rotate-inverse.png',
            sure: true,
            sureIcon: './images/sure.png',
            close: true,
            closeIcon: './images/close.png',
        },
        toolsConfig: {
            zIndex: 999,
            rotateAngle: 90,
            lockWidth: false,
            lockHeight: false,
            lockRatio: false,
            disableScale: false,
            disableRotate: false,
            limitMove: false
        }
    },
    onLoad: function () {
        this.setData({
            userInfo: app.global.userInfo,
            currentConfig: this.data.currentConfig,
            toolsConfig: this.data.toolsConfig
        });

        wx.setNavigationBarTitle({
            title: "个人信息"
        })
    },
    linclip(event) {
        this.data.currentConfig.resultImageUrl = event.detail.url;
        this.setData({
            'currentConfig.show': false
        });
    },
    pickExclude(obj, keys) {
        if (!isPlainObject(obj)) {
            return {};
        }
        return Object.keys(obj).reduce((prev, key) => {
            if (!keys.includes(key)) {
                prev[key] = obj[key];
            }
            return prev;
        }, {});
    },
    //上传头像
    upload(event) {
        let currentConfig = this.data.currentConfig;
        let toolsConfig = this.data.toolsConfig;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {

                if (util.isNull(res)) {
                    return false;
                }

                let file = res.tempFiles.map((item) => (Object.assign(Object.assign({}, this.pickExclude(item, ['path'])), {
                    type: 'image',
                    url: item.path,
                    thumb: item.path
                })))[0];

                //console.log('res', res)
                //console.log('file', file)

                //console.log('file.type', file.type)
                //console.log('file.size', file.size)
                //console.log('file.url', file.url)

                //====================================

                let formData = new FormData();
                formData.appendFile("file", file.url);
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

                                currentConfig.imageUrl = url;
                                currentConfig.show = true;

                                //console.log('url', url)
                                //console.log('resData.Id', resData.Id)

                                wx.showToast({
                                    title: '上传照片成功',
                                    icon: 'success'
                                });

                                //更新照片
                                await authService
                                    .upLoadFaceImageAsync(resData.Id)
                                    .then((res) => {
                                        //console.log('upLoadFaceImageAsync-->', res)
                                        if (res.code > 0) {

                                            //更新用户
                                            let user = app.global.userInfo;
                                            user.FaceImage = resData.Id
                                            wx.setStorage({
                                                key: 'workContext',
                                                data: user
                                            })

                                        }
                                    });

                                this.setData({
                                    currentConfig,
                                    toolsConfig
                                });
                            } else {
                                wx.showToast({
                                    title: '上传照片失败',
                                    icon: 'error'
                                });
                            }
                        } else {
                            wx.showToast({
                                title: '上传照片失败' + res.errMsg,
                                icon: 'error'
                            });
                        }
                    },
                    fail: res => {
                        wx.showToast({
                            title: '上传照片失败',
                            icon: 'error'
                        });
                    }
                });
                //====================================
            }
        });
    },
    //剪切头像
    showClipper(event) {
        let currentConfig = this.data.currentConfig;
        let toolsConfig = this.data.toolsConfig;
        currentConfig.show = true;
        this.setData({
            currentConfig,
            toolsConfig
        });
    },
});