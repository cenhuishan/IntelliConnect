const { request } = require('../utils/request');

const getProductList = () => request({ url: '/api/v2/Product', method: 'GET' });
const addProduct = (data) => request({ url: '/api/v2/Product', method: 'POST', data });
const deleteProduct = (id) => request({ url: '/api/v2/Product', method: 'DELETE', data: { id } });
const getProductName = (productId) => request({ url: '/api/v2/getProductName', method: 'GET', params: { productId } });

module.exports = { getProductList, addProduct, deleteProduct, getProductName };
