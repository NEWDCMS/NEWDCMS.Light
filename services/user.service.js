import http from './http';
const app = getApp();
const util = require('../utils/util')
var format = require('string-format')

const getSubUsersAsync = (userId = 0, loading = false) => {
    try {
        if (util.isEmpty(userId) || userId == 0) {
            userId = app.global.userInfo.Id
        }
        let params = {
            userId: userId
        }
        // userId
        return http.get('users/getSubUsers/' + app.global.storeId, params, loading);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getBusinessUsersAsync = (params, loading = false) => {
    try {
        // params{ ids , roleName:{Users,Administrators,Delivers,Financials,Users,Employees}}
        return http.get('users/getBusinessUsers/' + app.global.storeId, params, loading);
    } catch (error) {
        //console.log(error)
        return
    }
}

const getUsersAsync = async function (roleName = 'Employees', loading = false) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let params = {
            roleName: roleName
        }
        let _url = 'users/getBusinessUsers/{0}';
        return await http.get(format(_url, storeId), params, loading)
            .then((res) => {
                //console.log('res:', res);
                if (res.code >= 0) {
                    return res?.data;
                } else
                    return null;
            });
    } catch (error) {
        //console.log(error)
        return null;
    }
}

module.exports = {
    getSubUsersAsync,
    getBusinessUsersAsync,
    getUsersAsync

}