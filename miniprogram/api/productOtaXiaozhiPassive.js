const { request } = require('../utils/request');

const getXiaozhiPassiveList = (params) => request({ url: '/api/v2/xiaozhi/otaPassive', method: 'GET', params });
const addXiaozhiPassive = (data) => request({ url: '/api/v2/xiaozhi/otaPassive', method: 'POST', data });
const deleteXiaozhiPassive = (id) => request({ url: '/api/v2/xiaozhi/otaPassive', method: 'DELETE', params: { id } });

module.exports = { getXiaozhiPassiveList, addXiaozhiPassive, deleteXiaozhiPassive };
