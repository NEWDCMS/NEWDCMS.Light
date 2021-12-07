import http from './http';
const app = getApp();
const URL = "rtc";
var format = require('string-format')


/* 获取在线业务员 */
const getOnlineUserAsync = async function () {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/online';
        return await http.get(format(_url, storeId), {
                storeId: storeId
            })
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

const sendMessageAsync = async function (to, msg) {
    try {

        let storeId = app.global.storeId;
        let user = app.global.userInfo;

        let params = {
            storeId: storeId,

            toUser: to.UserId,
            toUserName: to.Name,
            toUserAvatar: to.Avatar,

            fromUser: user.Id,
            fromUserName: user.UserRealName,
            fromUserAvatar: user.FaceImage,

            type: 'text',
            images: '',
            msg: msg,

        }

        //?call=callBack
        let _url = URL + '/send/message?call=callBack';
        return await http.post(format(_url, storeId), params)
            .then((res) => {
                return res
            });
    } catch (error) {
        //console.log(error)
        return null;
    }
}


module.exports = {
    getOnlineUserAsync,
    sendMessageAsync
}