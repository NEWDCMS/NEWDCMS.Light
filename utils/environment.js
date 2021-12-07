// 开发环境配置
module.exports = {
  //#region 不同环境公用配置
  defaultConfig: {
    appId: ''
  },
  //#endregion
  //#region 开发环境配置
  dev: {
     api: '',
    resourceUploadApi: '',
    resourceDownloadApi: ''
  },
  //#endregion
  //#region 生产环境配置
  prod: {
    api: '',
    resourceUploadApi: '',
    resourceDownloadApi: ''
  }
  //#endregion
}