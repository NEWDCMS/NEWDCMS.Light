import http from './http';
const app = getApp();

const getCompanySettingAsync = () => {
    try {
        let params = {
            userId: app.global.userInfo.Id
        }
        return http.get('config/setting/getCompanySetting/' + app.global.storeId, params, false);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getRemarkConfigListSetting = () => {
    try {
        return http.get('config/setting/getRemarkConfigListSetting/' + app.global.storeId);
    } catch (error) {
        //console.log(error)
        return
    }
}

const getRemarkConfigList = async () => {
    return await getRemarkConfigListSetting().then(res => {
        if (res.success == true) {
            let remarks = [{
                Id: "0",
                Name: '备注'
            }];
            for (const key in res.data) {
                remarks.push({
                    Id: key,
                    Name: res.data[key]
                })
            }
            return remarks;
        }
    })
}
const getAppFeatures = () => {
    try {
        let userId = app.global.userInfo.Id
        let storeId = app.global.storeId
        let params = {
            storeId: storeId,
            userId: userId
        }
        return http.get('system/getappfeatures', params);
    } catch (error) {
        //console.log(error)
        return
    }
}
module.exports = {
    getCompanySettingAsync,
    getRemarkConfigListSetting,
    getRemarkConfigList,
    getAppFeatures
}