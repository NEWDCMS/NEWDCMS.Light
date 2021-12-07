/* 用于收款单服务 */
import http from './http';
const app = getApp();
const URL = "finances/receiptcashbill";
var format = require('string-format')

/* 获取表单创建初始绑定 */
const GetInitDataAsync = async function (billTypeId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            billTypeId: billTypeId
        }

        let _url = URL + '/getinitdataasync/{0}/{1}';
        return await http.get(format(_url, storeId, userId), params)
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

/* 提交单据 */
const CreateOrUpdateAsync = async function (data, billId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/createorupdate/{0}/{1}/{2}';

        return await http.post(format(_url, storeId, userId, billId), data)
            .then((res) => {
                //console.log('res:', res);
                // if (res.code >= 0) {
                //     return res?.data;
                // } else
                //     return null;
                return res
            });
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
        return await http.get(format(_url, storeId, userId, billId), params)
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
        return await http.get(format(_url, storeId, userId, billId), params)
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

/* 获取单据列表 */
const GetBillsAsync = async function (customerId, payeer, params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        /*
        int storeId, int? makeuserId, int? customerId, string customerName, int? payeer, string billNumber, string remark, bool? auditedStatus = null, DateTime? startTime = null, DateTime? endTime = null, bool? showReverse = null, bool? sortByAuditedTime = null, bool? handleStatus = null, int pagenumber = 0, int pageSize = 20
        */
        let _url = URL + '/getbills/{0}/{1}/{2}';
        return http.get(format(_url, storeId, customerId, payeer), params)
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

/* 获取单据 */
const GetBillAsync = async function (billId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/getCashReceiptBill/{0}/{1}/{2}';
        return await http.get(format(_url, storeId, billId, userId), {})
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


/* 获取应收欠款单据 */
const GetOwecashBillsAsync = async function (params, businessUserId) {
    try {

        let storeId = app.global.storeId;
        let userId = businessUserId;

        //https://api.jsdcms.com/api/v3/dcms/finances/receiptcashbill/getowecashbills/118/0?terminalId=223149&pageIndex=0&pageSize=20

        let _url = URL + '/getowecashbills/{0}/{1}';
        return await http.get(format(_url, storeId, userId), params)
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
    GetInitDataAsync,
    CreateOrUpdateAsync,
    AuditingAsync,
    ReverseAsync,
    GetBillsAsync,
    GetBillAsync,
    GetOwecashBillsAsync
}