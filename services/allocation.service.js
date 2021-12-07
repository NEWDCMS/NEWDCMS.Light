import http from './http';
const app = getApp();
const util = require('../utils/util')
var format = require('string-format')

const getAllocationsAsync = (parames) => {
    try {
        let params = {
            billNumber: parames.billNumber,
            remark: parames.remark,
            auditedStatus: parames.auditedStatus,
            startTime: parames.startTime,
            endTime: parames.endTime,
            showReverse: parames.showReverse,
            sortByAuditedTime: parames.sortByAuditedTime,
            pagenumber: parames.pageIndex,
            pageSize: parames.pageSize
        }
        return http.get(`warehouse/allocationbill/getbills/${app.global.storeId}/${parames.businessId}/${parames.makeuserId}/${parames.outWareId}/${parames.inWareId}`, params);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getAllocationBill = (billId) => {
    try {
        return http.get(`warehouse/allocationbill/getallocationbill/${app.global.storeId}/${billId}/${app.global.userInfo.Id}`);
    } catch (error) {
        //console.log(error)
        return
    }
}
/* 审核 */
const auditingAsync = async function (billId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            billId: billId
        }

        let _url = 'warehouse/allocationbill/auditing/{0}/{1}/{2}'
        return http.get(format(_url, storeId, userId, billId), params)
    } catch (error) {
        //console.log(error)
        return null;
    }
}

/* 红冲 */
const reverseAsync = async function (billId = 0, remark = "") {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let params = {
            billId: billId,
            remark: remark
        }
        let _url = 'warehouse/allocationbill/reverse/{0}/{1}/{2}'
        return http.get(format(_url, storeId, userId, billId), params)
    } catch (error) {
        //console.log(error)
        return null;
    }
}
module.exports = {
    getAllocationsAsync,
    getAllocationBill,
    auditingAsync,
    reverseAsync
}