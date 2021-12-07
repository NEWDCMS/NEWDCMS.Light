 Component({
     properties: {
         datas: {
             type: Array,
             value: []
         },
     },
     observers: {
         'datas': function (params) {
             this.setData({
                 tree: params
             })
         }
     },
     data: {
         tree: []
     },
     methods: {
         isOpen(e) {
             const item = e.currentTarget.dataset.item;
             this.triggerEvent('open', {
                 item: item
             }, {
                 bubbles: true,
                 composed: true
             })
         },
         select(e) {
             const item = e.currentTarget.dataset.item;
             this.triggerEvent('select', {
                 item: item
             }, {
                 bubbles: true,
                 composed: true
             })
         },
     }
 })