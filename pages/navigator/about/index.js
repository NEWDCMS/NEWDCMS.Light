import tabbar from '../../tabbar';
import userModel from '../../../models/userModel';
import versionUtil from '../../../utils/version-util';
const app = getApp();

Page({
  data: {
    parames: {
      title: '',
      type: '',
      navigatemark: ''
    },
    isBusy: true,
    version: app.version,
    list: tabbar,
    userInfo: userModel,
    menuDatas: [{
      id: 1,
      nav: '/packagePages/root/pages/systemSettingPage/index',
      title: '开单设置',
      icon: 'setting',
      show: false,
      badge: 0
    }, {
      id: 2,
      nav: '/packagePages/workflow/pages/message/index',
      title: '待办',
      icon: 'comment',
      show: false,
      badge: 0
    }, {
      id: 3,
      nav: '/packagePages/workflow/pages/notice/index',
      title: '通知',
      icon: 'bell',
      show: false,
      badge: 0
    }, {
      id: 4,
      nav: '/packagePages/chat/pages/online/index',
      title: '内部业务交流',
      icon: 'friends',
      show: false,
      badge: 0
    }, {
      id: 5,
      nav: '/packagePages/root/pages/printSettingPage/index',
      title: '打印设置',
      icon: 'printer',
      show: false,
      badge: 0
    }, {
      id: 6,
      nav: '/packagePages/root/pages/updatePage/index',
      title: '版本更新',
      icon: 'new',
      show: true,
      badge: app.version
    }, {
      id: 7,
      nav: '/packagePages/root/pages/securityPage/index',
      title: '账户安全',
      icon: 'youzan-shield',
      show: false,
      badge: 0
    }, {
      id: 8,
      nav: '/packagePages/root/pages/aboutPage/index',
      title: '关于我们',
      icon: 'smile',
      show: false,
      badge: 0
    }, {
      id: 9,
      nav: '/packagePages/root/pages/issuesPage/index',
      title: '市场反馈',
      icon: 'service',
      show: false,
      badge: 0
    }],
    currentConf: {}
  },

  //点击事件
  clickListItem(e) {
    let nav = e.currentTarget.dataset.nav;
    let type = e.currentTarget.dataset.id;
    if ([1, 2, 3, 4, 5, 7, 8, 9].indexOf(type) >= 0) {
      wx.navigateTo({
        url: nav
      });
    } else if (type == 6) {
      // 检查更新
      versionUtil.checkUpdate(true);
    } else {
      wx.showToast({
        title: `功能完善中～`,
        icon: 'none'
      });
    }
  },

  onLoad: function () {
    //初始化
    setTimeout(() => {
      this.setData({
        userInfo: app.global.userInfo,
        isBusy: false
      })
    }, 500);
  },

  // 注销账户
  signOut(e) {

    wx.showModal({
      title: '提示',
      content: '你确定要注销账户并退出吗？',
      complete(res) {
        if (res.confirm) {

          wx.clearStorageSync();
          app.global.token = '';
          app.global.userInfo = {}
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/index',
              complete: (res) => {}
            })
          }, 100);
        }
      }
    });
  },
  //复制连接
  // copyLink(e) {
  //   wx.setClipboardData({
  //     data: e.currentTarget.dataset.link,
  //     success: () => {
  //       wx.showToast({
  //         title: '已复制',
  //         duration: 1000,
  //       });
  //     }
  //   });
  // },
  //个人中心
  upload(e) {
    wx.navigateTo({
      url: '/packagePages/root/pages/clipperFacePage/index'
    });
  }
});