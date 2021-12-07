import http from './http';
const app = getApp();
const URL = "config/accounting";
var format = require('string-format')

/* 获取指定单据类型的收付款方式 */
const getPaymentMethodsAsync = async function (billTypeId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            billTypeId: billTypeId
        }

        let _url = URL + '/getpaymentmethods/{0}';
        return await http.get(format(_url, storeId), params)
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

/* 获取指定单据类型的初始默认收付款方式 */
const getDefaultAccountingAsync = async function (billTypeId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;


        let params = {
            billTypeId: billTypeId
        }

        let _url = URL + '/getdefaultaccounting/{0}';
        return await http.get(format(_url, storeId), params)
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
    getPaymentMethodsAsync,
    getDefaultAccountingAsync

}