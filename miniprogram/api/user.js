const { request } = require('../utils/request')

const getUsers = () => request({ url: '/api/v2/user', method: 'GET' })
const deleteUser = (params) => request({ url: '/api/v2/user', method: 'DELETE', params })
const updateUserRole = (data) => request({ url: '/api/v2/user/role', method: 'PUT', data })

module.exports = { getUsers, deleteUser, updateUserRole }
