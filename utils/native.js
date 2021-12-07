const toast = (title, extra = { icon: "none", mask: true, duration: 1500 }) => {
  return new Promise((resolve, reject) => {
    let { icon, mask, duration } = extra;
    wx.showToast({
      title,
      icon,
      mask: mask || true,
      duration: duration || 1500,
      success: () => {
        setTimeout(() => {
          resolve();
        }, duration || 1500)
      }
    })
  })
}
// 开启加载效果
const showLoading = (title = '加载中', mask = true) => {
  wx.showLoading({
    title, mask
  })
}
// 关闭加载效果
const hideLoading = () => {
  wx.hideLoading()
}

const wxLogin = () => {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        if (res.code) {
          resolve(res.code);
        } else {
          toast('获取微信用户code失败')
        }
      },
      fail: err => {
        toast(err)
      }
    })
  })
}
// 粘贴
const setClipboardData = (data) => {
  if (data) {
    wx.setClipboardData({
      data,
      success() {
        toast('订单号已复制到粘贴板中');
      }
    })
  } else {
    toast('复制失败')
  }
}

//展示模态框
const showModal = (title, content, showCancel = true, confirmText = '确认', cancelText = '取消') => {
  return new Promise(resolve => {
    wx.showModal({
      title,
      content,
      showCancel,
      confirmText,
      cancelText,
      confirmColor: '#ff4d48',
      cancelColor: '#999999',
      success: (res) => {
        resolve(res)
      }
    })
  })
}
const copy = (value) => {
  wx.setClipboardData({
    data: value,
    success() {
      toast('复制成功')
    }
  })
}
module.exports = {
  toast,
  showLoading,
  hideLoading,
  wxLogin,
  setClipboardData,
  showModal,
  copy
}