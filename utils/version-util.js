// 小程序启动时检查版本
class VersionUtil {
  /**
   * 检查更新
   * 
   */
  checkUpdate(auto = false) {
    //console.log('checkUpdate', wx.canIUse('getUpdateManager'))
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        //console.log('hasUpdate', res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已上线，是否重启应用？',
              success(res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });

          updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            wx.showModal({
              title: '更新提示',
              content: '有新版本啦！删除当前小程序，重新打开就能更新啦！'
            });
          });
        } else {
          if (auto) {
            wx.showModal({
              title: '抱歉！',
              content: '没有发现有可用更新！'
            });
          }
        }
      });
    }
  }

  /* 获取版本号 */
  version() {
    const accountInfo = wx.getAccountInfoSync();
    let version = accountInfo.miniProgram.version
    //console.log('version', version)
    return version == '' ? 'V1.0.0.2' : 'V' + version
  }
}

const versionUtil = new VersionUtil();
export default versionUtil;