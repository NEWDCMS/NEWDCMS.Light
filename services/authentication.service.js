import http from './http';
var format = require('string-format')
const app = getApp();

const loginAsync = function (params) {
    try {
        return http.post('auth/user/login', params);
    } catch (error) {}
}

const upLoadFaceImageAsync = async function (image) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let _url = 'auth/user/profiles/updateFaceImage/{0}?store={1}&image={2}';
        return await http.post(format(_url, userId, storeId, image), {})
            .then((res) => {
                //console.log('res:', res);
                return res;
            });
    } catch (error) {
        //console.log(error)
        return null;
    }
}

const changePasswordAsync = async function (data) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let params = {
            model: data
        }
        let _url = 'auth/user/profiles/changePassword/{0}?store={1}';
        return await http.post(format(_url, userId, storeId), params)
            .then((res) => {
                //console.log('res:', res);
                return res;
            });
    } catch (error) {
        //console.log(error)
        return null;
    }
}

module.exports = {
    loginAsync,
    upLoadFaceImageAsync,
    changePasswordAsync
}