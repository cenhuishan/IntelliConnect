const { request } = require('../utils/request');

const getToolsBanList = (params) => request({ url: '/api/v2/productToolsBan', method: 'GET', params });
const addToolsBan = (data) => request({ url: '/api/v2/productToolsBan', method: 'POST', data });
const deleteToolsBan = (id) => request({ url: '/api/v2/productToolsBan', method: 'DELETE', data: { id } });

module.exports = { getToolsBanList, addToolsBan, deleteToolsBan };
