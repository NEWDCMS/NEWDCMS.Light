import http from './http';
const app = getApp();
const URL = "census/vist";
var format = require('string-format')

const getTerminalsAsync = (params, showloading = true) => {
    try {
        let userId = app.global.userInfo.Id
        // let districtId = params.districtId ?? 0
        // if (districtId > 0) {
        //     userId = 0
        // }
        //districtId searchStr channelId rankId range status    
        return http.get('archives/terminal/getallterminals/' + app.global.storeId + '/' + userId + '/' + app.global.bd09_location.lat + '/' + app.global.bd09_location.lon + '/' + params.range, params, showloading);
    } catch (error) {
        //console.log(error)
        return
    }
}
//
const getOutVisitStoreAsync = () => {
    try {
        let params = {
            businessUserId: app.global.userInfo.Id
        }
        return http.get('census/vist/getOutVisitStore/' + app.global.storeId, params);
    } catch (error) {
        //console.log(error)
        return
    }

}
//通过id获取终端ID
const getTerminalAsync = (params) => {
    try {
        //params:{terminalId} 
        return http.get('archives/terminal/' + app.global.storeId, params);
    } catch (error) {
        //console.log(error)
        return
    }
}

//获取经销商账户余额
const getTerminalBalanceAsync = (terminalId) => {
    try {
        //params:{terminalId} 
        let params = {
            terminalId: terminalId
        }
        return http.get('archives/terminal/getterminalbalance/' + app.global.storeId, params);
    } catch (error) {
        //console.log(error)
        return
    }
}
///获取上次拜访信息
const getLastVisitStoreAsync = params => {
    try {
        let paramstemp = {
            terminalId: params.terminalId,
            businessUserId: app.global.userInfo.Id
        }
        return http.get('census/vist/getLastVisitStore/' + app.global.storeId, paramstemp);
    } catch (error) {
        //console.log(error)
        return
    }
}
const signInVisitStoreAsync = params => {
    try {
        return http.post('census/vist/signInVisitStore/' + app.global.storeId + '?userId=' + app.global.userInfo.Id, params);
    } catch (error) {
        //console.log(error)
        return
    }
}
const signOutVisitStoreAsync = params => {
    try {
        return http.post('census/vist/signOutVisitStore/' + app.global.storeId + '?userId=' + app.global.userInfo.Id, params);
    } catch (error) {
        //console.log(error)
        return
    }
}

//片区
const getDistrictsAsync = () => {
    try {
        return http.get(`archives/terminal/getAllDistricts/${app.global.storeId}/${app.global.userInfo.Id}`, {}, false);
    } catch (error) {
        //console.log(error)
        return
    }
}
//渠道
const getChannelsAsync = () => {
    try {
        return http.get(`archives/channel/getChannels/${app.global.storeId}`, {}, false);
    } catch (error) {
        //console.log(error)
        return
    }
}
//线路
const getLineTiersAsync = () => {

    try {
        let userId = app.global.userId;
        let params = {
            userId: userId
        }
        return http.get(`archives/linetier/getLineTiers/${app.global.storeId}`, params, false);
    } catch (error) {
        //console.log(error)
        return
    }
}
//等级
const getRanksAsync = () => {
    try {
        return http.get(`archives/rank/getRanks/${app.global.storeId}`, {}, false);
    } catch (error) {
        //console.log(error)
        return
    }
}

const getVisitStoresAsync = (params, showloading = true) => {
    try {
        //terminalId districtId businessUserId start end
        return http.get(`census/vist/getVisitStores/${app.global.storeId}`, params, showloading);
    } catch (error) {
        //console.log(error)
        return
    }
}
const terminalCreateOrUpdateAsync = params => {
    try {
        return http.post('archives/terminal/createTerminal/' + app.global.storeId + '/' + app.global.userInfo.Id, params);
    } catch (error) {
        //console.log(error)
        return
    }
}
const updateTerminalAsync = (terminalId, lat, lng) => {
    try {
        return http.post(`archives/terminal/updateterminal/${app.global.storeId}?terminalId=${terminalId}&location_lat=${lat}&location_lng=${lng}`);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getBusinessUserVisitReached = (userId, lineId, start, end, showloading = true) => {
    try {
        let params = {
            startTime: start,
            endTime: end
        }
        return http.get(`census/vist/getBusinessUserVisitReached/${app.global.storeId}/${userId}/${lineId}`, params, showloading);
    } catch (error) {
        console.log(error)
        return
    }
}

/* 获取业务员拜访达成情况 */
const getReachDatasAsync = async function (businessUserId, start, end) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            userId: businessUserId,
            start: start,
            end: end
        }

        let _url = URL + '/getreachdatas/{0}';
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
    getTerminalsAsync,
    getOutVisitStoreAsync,
    getTerminalAsync,
    getTerminalBalanceAsync,
    getLastVisitStoreAsync,
    signInVisitStoreAsync,
    signOutVisitStoreAsync,
    getDistrictsAsync,
    getChannelsAsync,
    getLineTiersAsync,
    getRanksAsync,
    getVisitStoresAsync,
    terminalCreateOrUpdateAsync,
    updateTerminalAsync,
    getBusinessUserVisitReached,
    getReachDatasAsync
}