const { request } = require('../utils/request');

const getAsrList = (params) => request({ url: '/api/v2/productAsr', method: 'GET', params });
const addAsr = (data) => request({ url: '/api/v2/productAsr', method: 'POST', data });
const updateAsr = (data) => request({ url: '/api/v2/productAsr', method: 'PUT', data });
const deleteAsr = (id) => request({ url: '/api/v2/productAsr', method: 'DELETE', data: { id } });

module.exports = { getAsrList, addAsr, updateAsr, deleteAsr };
