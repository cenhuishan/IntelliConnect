const { request } = require('../utils/request');

const getAdminConfig = () => request({ url: '/api/v2/adminConfig', method: 'GET' });
const updateAdminConfig = (data) => request({ url: '/api/v2/adminConfig', method: 'PUT', data });
const addAdminConfig = (data) => request({ url: '/api/v2/adminConfig', method: 'POST', data });
const deleteAdminConfig = (id) => request({ url: '/api/v2/adminConfig', method: 'DELETE', data: { id } });

module.exports = { getAdminConfig, updateAdminConfig, addAdminConfig, deleteAdminConfig };
