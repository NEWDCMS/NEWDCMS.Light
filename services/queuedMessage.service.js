import http from './http';
const app = getApp();
const URL = "skd";
var format = require('string-format')

const getQueuedMessagesAsync = async function (mTypeIds, params) {
    try {
        let storeId = app.global.storeId;
        //let userId = app.global.userId;
        let ms = 'mTypeId=' + mTypeIds.join('&mTypeId=')
        let _url = URL + '/getqueuedmessages/{0}?' + ms;
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
    getQueuedMessagesAsync
}