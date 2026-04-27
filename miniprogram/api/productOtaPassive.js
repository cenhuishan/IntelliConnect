const { request } = require('../utils/request');

const getPassiveList = (params) => request({ url: '/api/v2/otaPassive', method: 'GET', params });
const addPassive = (data) => request({ url: '/api/v2/otaPassive', method: 'POST', data });
const deletePassive = (id) => request({ url: '/api/v2/otaPassive', method: 'DELETE', data: { id } });

module.exports = { getPassiveList, addPassive, deletePassive };
