const { request } = require('../utils/request');

const login = (data) => request({ url: '/api/v2/login', method: 'POST', data });
const register = (data) => request({ url: '/api/v2/newUser', method: 'POST', data });
const forgotPassword = (data) => request({ url: '/api/v2/forgotPassword', method: 'POST', data });
const getUserCode = (data) => request({ url: '/api/v2/getUserCode', method: 'POST', data });
const getUserConfig = () => request({ url: '/api/v2/user/config', method: 'GET' });
const updateUserConfig = (data) => request({ url: '/api/v2/user/config', method: 'PUT', data });

module.exports = { login, register, forgotPassword, getUserCode, getUserConfig, updateUserConfig };
