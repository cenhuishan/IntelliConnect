const { request } = require('../utils/request')

const getProductRole = () => request({ url: '/api/v2/productRole', method: 'GET' })
const postProductRole = (data) => request({ url: '/api/v2/productRole', method: 'POST', data })
const deleteProductRole = (params) => request({ url: '/api/v2/productRole', method: 'DELETE', params })

module.exports = { getProductRole, postProductRole, deleteProductRole }
