const { request } = require('../utils/request');

const getXiaozhiList = (params) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'GET', params });
const addXiaozhi = (data) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'POST', data });
const updateXiaozhi = (data) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'PUT', data });
const deleteXiaozhi = (id) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'DELETE', data: { id } });

module.exports = { getXiaozhiList, addXiaozhi, updateXiaozhi, deleteXiaozhi };
