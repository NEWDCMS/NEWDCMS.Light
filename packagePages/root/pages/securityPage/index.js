const app = getApp();
const authService = require('../../../../services/authentication.service')
const util = require('../../../../utils/util')

Page({
    data: {
        parames: {
            title: '',
            type: '',
            navigatemark: ''
        },
        pageForm: {
            oldPassword: '',
            password: '',
            confirm: ''
        },
        oldPasswordRules: [{
                required: true,
                message: '请输入旧密码',
                trigger: 'blur'
            },
            {
                min: 6,
                max: 20,
                message: '密码长度在6-20个字符之间',
                trigger: 'blur'
            },
            {
                pattern: '^(?![A-Za-z]+$)(?!\\d+$)(?![\\W_]+$)',
                message: '密码必须由数字字母符号组成',
                trigger: 'blur'
            }
        ],
        passwordRules: [{
                required: true,
                message: '请输入新密码',
                trigger: 'blur'
            },
            {
                min: 6,
                max: 20,
                message: '密码长度在6-20个字符之间',
                trigger: 'blur'
            },
            {
                pattern: '^(?![A-Za-z]+$)(?!\\d+$)(?![\\W_]+$)',
                message: '密码必须由数字字母符号组成',
                trigger: 'blur'
            }
        ],
        confirmRules: [{
            validator(rule, value, callback, source) {
                const {
                    password,
                    confirm
                } = source;
                if (password !== confirm) {
                    callback(false);
                }
                callback();
            },
            message: '旧密码和新密码输入不一致',
            trigger: 'change'
        }]

    },
    oldPasswordInput(e) {
        this.setData({
            'pageForm.oldPassword': e.detail.value
        });
    },
    newPasswordInput(e) {
        this.setData({
            'pageForm.password': e.detail.value
        });
    },
    confirmInput(e) {
        this.setData({
            'pageForm.confirm': e.detail.value
        });
    },

    //修改密码
    async resetPassword(e) {

        //console.log(e?.detail?.isValidate)

        if ((e?.detail?.isValidate) ?? false) {

            let data = {
                Password: this.data.pageForm.oldPassword,
                NewPassword: this.data.pageForm.password,
                AgainPassword: this.data.pageForm.confirm,
            }
            await authService
                .changePasswordAsync(data)
                .then((res) => {
                    //console.log('changePasswordAsync-->', res)
                    if (res.code > 0) {

                        wx.showToast({
                            title: '更新成功,重新登录！',
                            icon: 'error',
                            duration: 5000
                        })

                        app.global.token = '';
                        app.global.userInfo = {}
                        setTimeout(() => {
                            wx.reLaunch({
                                url: '/pages/login/index',
                                complete: (res) => {}
                            })
                        }, 3000);

                    } else {
                        wx.showToast({
                            title: e.message,
                            icon: 'none',
                            duration: 3000
                        });
                    }
                });
        }
    },

    onLoad: function (options) {
        wx.lin.initValidateForm(this);
        wx.setNavigationBarTitle({
            title: "账户安全"
        })
    }
})