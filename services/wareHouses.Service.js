import http from './http';
const app = getApp();
const util = require('../utils/util')
var format = require('string-format')

const getWareHousesAsync = (btype, searchStr = '', pageIndex = 0, pageSize = 50) => {
    try {
        let params = {
            makeuserId: app.global.userInfo.Id,
            btype: btype,
            searchStr: searchStr,
            pageIndex: pageIndex,
            pageSize: pageSize
        }
        // makeuserId btype searchStr=0 pageIndex pageSize
        return http.get('warehouse/wareHouse/getWareHouses/' + app.global.storeId, params);
    } catch (error) {
        //console.log(error)
        return
    }
}

/* 提交单据 */
const createOrUpdateAsync = async function (data, billId = 0) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let _url = 'warehouse/allocationbill/createorupdate/{0}/{1}/{2}';
        return http.post(format(_url, storeId, userId, billId), data)
    } catch (error) {
        //console.log(error)
        return null;
    }
}

/* 审核 */
const AuditingAsync = async function (billId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            billId: billId
        }

        let _url = URL + '/auditing/{0}/{1}/{2}';
        return http.get(format(_url, storeId, userId, billId), params);
        // .then((res) => {
        //     //console.log('res:', res);
        //     if (res.code >= 0) {
        //         return res?.data;
        //     } else
        //         return null;
        // });
    } catch (error) {
        //console.log(error)
        return null;
    }
}

/* 红冲 */
const ReverseAsync = async function (billId = 0, remark = "") {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            billId: billId,
            remark: remark
        }

        let _url = URL + '/reverse/{0}/{1}/{2}';
        return http.get(format(_url, storeId, userId, billId), params)
        // .then((res) => {
        //     //console.log('res:', res);
        //     if (res.code >= 0) {
        //         return res?.data;
        //     } else
        //         return null;
        // });
    } catch (error) {
        //console.log(error)
        return null;
    }
}
module.exports = {
    getWareHousesAsync,
    createOrUpdateAsync
}