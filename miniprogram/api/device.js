const { request } = require('../utils/request');

const getDeviceList = (params) => request({ url: '/api/v2/ProductDevice', method: 'GET', params });
const addDevice = (data) => request({ url: '/api/v2/ProductDevice', method: 'POST', data });
const deleteDevice = (id) => request({ url: '/api/v2/ProductDevice', method: 'DELETE', data: { id } });

module.exports = { getDeviceList, addDevice, deleteDevice };
