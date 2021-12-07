import http from './http';
const app = getApp();
const URL = "sales/financereceiveaccount";
var format = require('string-format')

/* 获取待上交对账单汇总 */
const getFinanceReceiveAccounts = async function (start, end, businessUserId, payeer = 0, accountingOptionId = 0, billNumber = "", pageIndex = 0, pageSize = 20) {
    try {

        let storeId = app.global.storeId;
        let userId = businessUserId;

        let params = {
            start: start,
            end: end,
            payeer: payeer,
            accountingOptionId: accountingOptionId,
            billNumber: billNumber,
            pageIndex: pageIndex,
            pageSize: pageSize
        }

        let _url = URL + '/getfinancereceiveaccounts/{0}/{1}';
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

/* 上交对账单(批量) */
const submitAccountStatementAsync = async function (params) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let _url = URL + '/batchsubmitaccountstatements/{0}/{1}';
        return await http.post(format(_url, storeId, userId), params)
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
    getFinanceReceiveAccounts,
    submitAccountStatementAsync
}