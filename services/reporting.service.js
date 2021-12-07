import http from './http';
const app = getApp();
const URL = "reporting";
var format = require('string-format')

/* 首页统计面板 */
const getDashboardReportAsync = function (showloading = false) {
    try {
        let storeId = app.global.storeId;
        let userId = app.global.userId;
        let params = {
            businessUserIds: app.global.userInfo.Id
        }
        let _url = URL + '/dashboard/getDashboardReport/{0}';
        return http.get(format(_url, storeId), params, showloading);
    } catch (error) {
        //console.log(error)
        return
    }
}

/* 业务员综合分析 */
const getBusinessAnalysis = async function (type = 0, showLoading = true) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            type: type,
            userId: userId
        }

        let _url = URL + '/saleReport/getBusinessAnalysis/{0}';
        return await http.get(format(_url, storeId), params, showLoading)
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

/* 销售额分析 */
const getSaleAnalysisAsync = async function (businessUserId = 0, brandId = 0, productId = 0, categoryId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            businessUserId: businessUserId,
            brandId: brandId,
            productId: productId,
            categoryId: categoryId
        }

        let _url = URL + '/saleReport/getSaleAnalysis/{0}';
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

/* 客户拜访分析 */
const getCustomerVistAnalysisAsync = async function (businessUserId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            businessUserId: businessUserId
        }

        let _url = URL + '/saleReport/getCustomerVistAnalysis/{0}';
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

/* 新增加客户分析 */
const getNewCustomerAnalysisAsync = async function (businessUserId = 0) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let params = {
            businessUserId: businessUserId
        }

        let _url = URL + '/saleReport/getNewCustomerAnalysis/{0}';
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


/* 获取客户排行榜 */
const getCustomerRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getCustomerRanking/{0}';
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

/* 获取业务员销售排行榜 */
const getBusinessRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getBusinessRanking/{0}';
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

/* 获取经销商品牌销量汇总 */
const getBrandRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getBrandRanking/{0}';
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

/* 热销排行榜 */
const getHotSaleRankingAsync = async function (params, showLoading = true) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getHotSaleRanking/{0}';
        return await http.get(format(_url, storeId), params, showLoading)
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

/* 获取销量走势图 */
const getSaleTrendingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getSaleTrending/{0}/{1}';
        return await http.get(format(_url, storeId, params.dateType), {})
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

/* 销售商品成本利润排行榜 */
const getCostProfitRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getCostProfitRanking/{0}';
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

/* 获取业务员拜访排行 */
const getBusinessVisitRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = 'census/vist/getVisitedRanking/{0}';
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

/* 热定排行榜 */
const getHotOrderRankingAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getHotOrderRanking/{0}';
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

/* 订单额分析 */
const getOrderQuantityAnalysisAsync = async function (params) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = URL + '/saleReport/getOrderQuantityAnalysis/{0}';
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
    getDashboardReportAsync,
    getHotSaleRankingAsync,
    getBusinessAnalysis,
    getCustomerVistAnalysisAsync,
    getNewCustomerAnalysisAsync,
    getCustomerRankingAsync,
    getBusinessRankingAsync,
    getBrandRankingAsync,
    getSaleTrendingAsync,
    getCostProfitRankingAsync,
    getBusinessVisitRankingAsync,
    getHotOrderRankingAsync,
    getOrderQuantityAnalysisAsync,
    getSaleAnalysisAsync
}