/*
 * @Title: 树形选择器
 * @Descripttion:支持搜索的树形数据选择器
 * @Author:cx
 * @Date: 2021-09-30
 */
Component({
    properties: {
        datas: {
            type: Array,
            value: []
        },
        isOpenAll: { //是否展开全部
            type: Boolean,
            value: true
        },
        isCheckedAll: { //是否全部选中
            type: Boolean,
            value: false
        }
    },
    data: {
        getData: {},
        dataList: [],
        keyword: ""
    },
    observers: {
        'datas': function (newDatas) {
            if (newDatas.length) {
                const data = this.updateData(newDatas, {
                    checked: this.properties.isCheckedAll,
                    open: this.properties.isOpenAll,
                    isHide: false
                })
                this.setData({
                    dataList: data
                })
            }
        }
    },
    methods: {
        updateData(data, {
            checked,
            open,
            isHide
        } = {}) {
            return data.map(item => {
                if (checked !== undefined) {
                    item.checked = checked
                }
                if (open !== undefined) {
                    item.open = open
                }
                if (isHide !== undefined) {
                    item.isHide = isHide
                }

                if (item.children?.length) {
                    item.children = this.updateData(item.children, {
                        checked,
                        open,
                        isHide
                    })
                }
                return item
            })
        },
        onReset: function () {
            wx:wx.navigateBack({
              delta: 0,
              success: (res) => {},
              fail: (res) => {},
              complete: (res) => {},
            })

        },
        onComfim: function () {
            const child = this.selectComponent('.tree-select');
            const data = this.getDeepArrName(child.data.datas)
            this.setData({
                getData: {
                    selectedValues: data
                }
            })
            this.triggerEvent('getConfirmData', this.data.getData)
        },
        // 递归获取name
        getDeepArrName(arr) {
            let name = []
            arr.forEach(item => {
                if (item.children.length) {
                    let children = this.getDeepArrName(item.children);
                    name = [...name, ...children]
                } else {
                    if (item.checked && !item.isHide) {
                        name.push(item)
                    }
                }
            })
            return name
        },
        // 递归搜索
        deepSearch(keyword, arr, type = "") {
            return arr.map(obj => {
                if (type) {
                    if (obj.name.indexOf(keyword) > -1) {
                        obj.isHide = false
                    } else {
                        obj.isHide = true
                    }
                    if (obj.children && obj.children.length) {
                        obj.children = this.deepSearch(keyword, obj.children, "hide")
                        const hasChild = obj.children.filter(item => item.isHide === false)
                        if (hasChild.length) {
                            obj.isHide = false
                        }
                    }
                } else {
                    obj.isHide = false
                    if (obj.children && obj.children.length) {
                        obj.children = this.deepSearch("", obj.children)
                    }
                }
                return obj
            })
        },
        // 搜索
        search: function (e) {
            const keyword = e.detail.value;
            if (keyword) {
                // 隐藏过滤数据
                const data = this.deepSearch(keyword, this.properties.datas, 'hide')
                this.setData({
                    dataList: data
                })
            } else {
                // 显示全部数据
                this.setData({
                    dataList: this.deepSearch('', this.properties.datas)
                })
            }
        },
        // 递归更新值
        updateTree(tree, select) {
            return tree.map(item => {
                if (item.id === select.id) {
                    item = select
                } else if (item.children.length) {
                    item.children = this.updateTree(item.children, select)
                }
                if (item.children.length) {
                    const childHasFalse = item.children.filter(item => (item.isHide === false && item.checked === false))
                    if (childHasFalse.length) {
                        item.checked = false
                    } else {
                        item.checked = true
                    }
                }
                return item
            })
        },
        handleSelect(e) {
            const item = e.detail.item;
            let select = []
            switch (e.type) {
                case "open":
                    item.open = !item.open;
                    select = [item]
                    break;
                case 'select':
                    select = this.updateData([item], {
                        checked: !item.checked
                    });
                    break;
            }
            const data = this.selectComponent('.tree-select')?.datas?.tree || this.data.dataList;
            this.setData({
                dataList: this.updateTree(data, select[0])
            })
        },
    }
})