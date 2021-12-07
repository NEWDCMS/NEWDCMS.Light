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
      }
    },
    fix: {
      type: String,
      value: '',
    },
    format: {
      type: Number,
      value: 2,
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
      value = parseFloat(value).toFixed(this.properties.format)
      var val = (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      if (val.indexOf('NaN') < 0) {
        //console.log('val', val)
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