const { request } = require('../utils/request');

const getLlmModelList = (params) => request({ url: '/api/v2/productLlmModel', method: 'GET', params });
const addLlmModel = (data) => request({ url: '/api/v2/productLlmModel', method: 'POST', data });
const deleteLlmModel = (id) => request({ url: '/api/v2/productLlmModel', method: 'DELETE', data: { id } });

module.exports = { getLlmModelList, addLlmModel, deleteLlmModel };
