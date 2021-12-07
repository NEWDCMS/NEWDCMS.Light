import http from './http';
const app = getApp();
const URL = "archives";
var format = require('string-format')

const getAllCampaigns = async function (parames) {
    try {
        let storeId = app.global.storeId;
        let _url = URL + '/campaign/getAllCampaigns/{0}';
        return http.get(format(_url, storeId), parames)
    } catch (error) {
        //console.log(error)
        return null;
    }
}

module.exports = {
    getAllCampaigns

}