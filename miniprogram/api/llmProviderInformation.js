const { request } = require('../utils/request');

const getProviderList = (params) => request({ url: '/api/v2/llmProviderInformation', method: 'GET', params });
const addProvider = (data) => request({ url: '/api/v2/llmProviderInformation', method: 'POST', data });
const deleteProvider = (id) => request({ url: '/api/v2/llmProviderInformation', method: 'DELETE', data: { id } });

module.exports = { getProviderList, addProvider, deleteProvider };
