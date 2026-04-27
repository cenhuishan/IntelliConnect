const { request } = require('../utils/request');

const getLongMemoryList = (params) => request({ url: '/api/v2/longMemory', method: 'GET', params });
const addLongMemory = (data) => request({ url: '/api/v2/longMemory', method: 'POST', data });
const deleteLongMemory = (id) => request({ url: '/api/v2/longMemory', method: 'DELETE', data: { id } });

module.exports = { getLongMemoryList, addLongMemory, deleteLongMemory };
