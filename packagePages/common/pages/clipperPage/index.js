const app = getApp()
const util = require('../../../../utils/util')
const terminalService = require('../../../../services/terminal.service')
import {
    isDef,
    isNumber,
    isPlainObject,
    isPromise
} from '../../../../dist/common/validator';

const FormData = require('../../../../utils/wx-formdata/formData')

Page({
    data: {
        parames: {
            title: '',
            type: 'OSS',
            navigatemark: '',
            path: ''
        },
        device: true,
        tempImagePath: "",
        camera: false,
        ctx: {},
        type: "takePhoto",
        startRecord: false,
        //图片裁切
        clipperConfig: {
            show: false,
            zIndex: 99,
            imageUrl: '',
            type: 'url',
            quality: 1,
            // 裁剪框宽度
            width: 500,
            height: 500,
            // 裁剪框最小宽度
            minWidth: 100,
            maxWidth: 700,
            minHeight: 100,
            maxHeight: 700,
            //是否锁定裁剪框宽度
            lockWidth: false,
            //是否锁定裁剪框高度
            lockHeight: false,
            //是否锁定裁剪框比例
            lockRatio: false,
            //生成图片相对于裁剪框的比例
            scaleRatio: 1,
            //图片最小缩放比
            minRatio: 1,
            //图片最大缩放比
            maxRatio: 2,
            //是否禁止缩放
            disableScale: false,
            disableRotate: false,
            //是否限制移动范围
            limitMove: true,
            resultImageUrl: '',
            rotateAlong: true,
            rotateAlongIcon: './images/rotate-along.png',
            rotateInverse: true,
            rotateInverseIcon: './images/rotate-inverse.png',
            // 是否显示确定按钮
            sure: true,
            sureIcon: './images/sure.png',
            close: true,
            closeIcon: './images/close.png',
        },
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '智能识别'
        })

        if (!util.isNull(options)) {
            this.setData({
                'parames.type': options.type == '' ? 'OSS' : options.type,
                ctx: wx.createCameraContext(),
                'clipperConfig.imageUrl': options.path,
                'camera': true,
                'clipperConfig.show': false
            });
        }
    },
    linclip(e) {
        let url = e.detail.url
        //console.log('linclip', e)
        //console.log('url', url);
        let p = this.data.parames
        //OSS
        this.uploadOSS(url)
    },
    linclose() {
        wx.navigateBack()
    },
    onCameraBack(url) {
        wx.setStorageSync('DCMS_CAMERA_PHOTOPATH', url)
        wx.navigateBack()
    },
    //选择排除
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
    //上传OSS
    async uploadOSS(url) {

        wx.showLoading({
            title: '请稍候...',
            mask: true
        });

        //====================================

        let formData = new FormData();
        formData.appendFile("file", url);
        let data = formData.getData();

        //上传OSS
        let ossURL = `${app.config['api']}oss/upload/${app.global.storeId}/${app.global.userId}`
        //console.log('ossURL', ossURL)
        await wx.request({
            method: 'POST',
            url: ossURL,
            header: {
                'Authorization': 'Bearer ' + app.global.token,
                'content-type': data.contentType
            },
            data: data.buffer,
            success: async res => {
                let d = res.data
                //console.log('upload', d)

                wx.hideLoading()

                this.setData({
                    'clipperConfig.show': false
                });

                if (d.code > 0) {
                    let keys = JSON.stringify(d.data)
                    let rurl = '/packagePages/common/pages/selectCustomerPage/index?type=visit&keys=' + keys

                    //console.log('rurl', rurl)

                    wx.redirectTo({
                        url: rurl
                    });
                }

            },
            fail: res => {

                //console.log('fail', res)
                wx.showToast({
                    title: '识别失败',
                    icon: 'error'
                });

                this.setData({
                    'clipperConfig.show': false
                });

                wx.navigateBack()
            }
        });


    },
    // 拍照
    camera() {
        let {
            ctx
        } = this.data;

        //console.log("拍照");
        ctx.takePhoto({
            quality: "normal", //低质量
            success: (res) => {
                //console.log('res', res);
                //console.log('res.tempImagePath', res.tempImagePath);
                this.setData({
                    'clipperConfig.imageUrl': res.tempImagePath,
                    'camera': false,
                    'clipperConfig.show': true
                });
            },
            fail: (e) => {
                wx.navigateBack()
            }
        })
    },
    // 关闭相机
    close() {
        this.setData({
            camera: false
        })
        wx.navigateBack()
    }
})