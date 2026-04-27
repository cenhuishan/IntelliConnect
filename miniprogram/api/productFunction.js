const { request } = require('../utils/request');

const getFunctionList = (params) => request({ url: '/api/v2/ProductFunction', method: 'GET', params });
const addFunction = (data) => request({ url: '/api/v2/ProductFunction', method: 'POST', data });
const deleteFunction = (id) => request({ url: '/api/v2/ProductFunction', method: 'DELETE', data: { id } });

module.exports = { getFunctionList, addFunction, deleteFunction };
