const { request } = require('../utils/request')

const login = (data) => request({ url: '/api/v2/login', method: 'POST', data })
const register = (data) => request({ url: '/api/v2/newUser', method: 'POST', data })
const forgotPassword = (data) => request({ url: '/api/v2/forgotPassword', method: 'POST', data })
const getEmailCode = (data) => request({ url: '/api/v2/getUserCode', method: 'POST', data })

module.exports = { login, register, forgotPassword, getEmailCode }
