const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: null,
      observer: function (newVal, oldVal) {
        this.update(newVal);
        // var val = util.moment(this.properties.format, newVal);
        // //console.log('val', val.indexOf('NaN'))
        // if (val.indexOf('NaN') < 0) {
        //   //console.log('val', val)
        //   this.setData({
        //     value: val
        //   })
        // }
      }
    },
    format: {
      type: String,
      value: 'h:mm:ss',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    update: function (value) {
      var val = util.moment(this.properties.format, value);
      if (val.indexOf('NaN') < 0) {
        ////console.log('val', val)
        this.setData({
          value: val
        })
      }
    }
  },
  ready: function () {
    this.update(this.properties.value);
  }
});