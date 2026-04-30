const { request } = require('../utils/request');

const getDataList = (params) => request({ url: '/api/v2/ProductData', method: 'GET', params });
const addData = (data) => request({ url: '/api/v2/ProductData', method: 'POST', data });
const deleteData = (id) => request({ url: '/api/v2/ProductData', method: 'DELETE', params: { id } });

module.exports = { getDataList, addData, deleteData };
