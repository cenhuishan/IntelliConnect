const { request } = require('../utils/request');

const getModelList = (params) => request({ url: '/api/v2/ProductModel', method: 'GET', params });
const addModel = (data) => request({ url: '/api/v2/ProductModel', method: 'POST', data });
const deleteModel = (id) => request({ url: '/api/v2/ProductModel', method: 'DELETE', data: { id } });

module.exports = { getModelList, addModel, deleteModel };
