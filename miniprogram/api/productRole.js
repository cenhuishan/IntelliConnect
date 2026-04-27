const { request } = require('../utils/request');

const getRoleList = (params) => request({ url: '/api/v2/productRole', method: 'GET', params });
const addRole = (data) => request({ url: '/api/v2/productRole', method: 'POST', data });
const updateRole = (data) => request({ url: '/api/v2/productRole', method: 'PUT', data });
const deleteRole = (id) => request({ url: '/api/v2/productRole', method: 'DELETE', data: { id } });

module.exports = { getRoleList, addRole, updateRole, deleteRole };
