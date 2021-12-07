import http from './http';
const app = getApp();
var format = require('string-format')

const getAllCategoriesAsync = () => {
    try {
        return http.get('archives/category/getAllCategories/' + app.global.storeId);
    } catch (error) {
        //console.log(error)
        return
    }
}

const getProductByIdAsync = (productId = 0) => {
    try {
        return http.get(`archives/product/getproductbyid/${app.global.storeId}/${productId}`);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getSpecificationAttributeOptionsAsync = () => {
    try {
        return http.get(`archives/product/getSpecificationAttributeOptions/${app.global.storeId}`);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getBrandsAsync = (name = '', pagenumber = 0, pageSize = 500) => {
    try {
        let params = {
            name: name,
            pagenumber: pagenumber,
            pageSize: pageSize
        }
        return http.get(`archives/getAllBrands/${app.global.storeId}`, params);
    } catch (error) {
        //console.log(error)
        return
    }
}
const getProductsAsync = (key = '', categoryIds = [], terminalid = 0, wareHouseId = 0, pageIndex = 0, pageSize = 20, usablequantity = true, excludeIds = '') => {
    try {
        // 
        let params = {
            key: key,
            terminalid: terminalid,
            wareHouseId: wareHouseId,
            pageIndex: pageIndex,
            pageSize: pageSize,
            usablequantity: usablequantity
        }
        let queryString = ''
        let cids = categoryIds.slice()
        if (cids && cids.length > 0) {
            let categoryIdRemove = cids.findIndex(c => c == 0)
            if (categoryIdRemove >= 0) {
                cids.splice(categoryIdRemove, 1)
            }
            if (cids && cids.length > 0) {
                queryString = '?categoryIds=' + cids.join('&categoryIds=')
            }
        }
        return http.get('archives/product/getProducts/' + app.global.storeId + queryString, params);
    } catch (error) {
        //console.log(error)
        return
    }
}

const createOrUpdateAsync = async function (data) {
    try {

        let storeId = app.global.storeId;
        let userId = app.global.userId;

        let _url = 'archives/product/createOrUpdateProduct/{0}/{1}';

        return await http.post(format(_url, storeId, userId), data)
            .then((res) => {
                //console.log('res:', res);
                return res
            });
    } catch (error) {
        //console.log(error)
        return null;
    }
}
module.exports = {
    getAllCategoriesAsync,
    getProductsAsync,
    getProductByIdAsync,
    getBrandsAsync,
    getSpecificationAttributeOptionsAsync,
    createOrUpdateAsync
}