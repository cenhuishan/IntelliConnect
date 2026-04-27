const { request } = require('../utils/request');

const getRouterSetList = (params) => request({ url: '/api/v2/productRouterSet', method: 'GET', params });
const addRouterSet = (data) => request({ url: '/api/v2/productRouterSet', method: 'POST', data });
const deleteRouterSet = (id) => request({ url: '/api/v2/productRouterSet', method: 'DELETE', data: { id } });

module.exports = { getRouterSetList, addRouterSet, deleteRouterSet };
