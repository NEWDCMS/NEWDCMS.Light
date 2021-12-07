var app = getApp();
let arrval = [];
let number = '';
Component({
    externalClasses: ['mykeyboard'],
    //对外引用资源
    properties: {
        //显示键盘
        isShow: {
            type: Boolean,
            value: false,
        },
        //键盘按压背景颜色
        keyBoradBackground: {
            type: String,
            value: "#2DA2F1"
        },
        //键盘边角大小
        bordradius: {
            type: String,
            value: "5px",
        },
    },

    // 数据集
    data: {
        keynumber: ['1','2','3','4','5','6','7','8','9','.','0','-'],
        canclebt: '取消',
        submitbt: '确定',
        deletebt: '删除',
        numberval: [],
        numbertext: '',

    },

    //方法函数
    methods: {
        keyboadrTap: function (e) {
            // //console.log(e)
            let val = e.target.dataset.value; //获取data-vaule值
            switch (val) {
                case 'delete':
                    // //console.log('删除')
                    arrval.pop();
                    this.setData({
                        numberval: arrval,
                        numbertext: arrval.join(''),
                    })
                    this.triggerEvent('delete');
                    break;
                case 'cancle':
                    this.triggerEvent('cancle');
                    // //console.log('退出')
                    //退出置空键盘数据集
                    arrval = [];
                    this.setData({
                        numbertext: "",
                    })
                    break;
                case 'submit':
                    // //console.log('提交')
                    // //console.log(this.data.numbertext);
                    //数字为空不允许点击确定按钮
                    if (this.data.numbertext == "") {
                        wx.showToast({
                            title: '数据为空',
                        })
                        return true;
                    }
                    //正则判断
                    this.triggerEvent('submit', this.data.numbertext);
                    arrval = [];
                    this.setData({
                        numbertext: "",
                    })
                    break;
                default:
                    // //console.log('数字键盘');
                    // //console.log(val); 
                    arrval.push(val);
                    var arr = arrval.join('').replace(/^\./g, "").replace(".", "#").replace(/\./g, "").replace("#", ".").replace("X", "*").replace(/\X/g, "").replace("*", "x");
                    this.setData({
                        numberval: arrval,
                        numbertext: arr,
                    })
                    this.triggerEvent('inputChange', this.data.numbertext);
            }
        },
    },
});