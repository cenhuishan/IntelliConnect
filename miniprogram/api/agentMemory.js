const { request } = require('../utils/request');

const getMemoryList = (params) => request({ url: '/api/v2/memory', method: 'GET', params });
const updateMemory = (data) => request({ url: '/api/v2/memory', method: 'PUT', data });
const deleteMemory = (id) => request({ url: '/api/v2/memory', method: 'DELETE', data: { id } });

module.exports = { getMemoryList, updateMemory, deleteMemory };
