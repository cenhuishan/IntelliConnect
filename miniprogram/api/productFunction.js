const { request } = require('../utils/request')

const getProductFunction = () => request({ url: '/api/v2/ProductFunction', method: 'GET' })
const postProductFunction = (data) => request({ url: '/api/v2/ProductFunction', method: 'POST', data })
const deleteProductFunction = (params) => request({ url: '/api/v2/ProductFunction', method: 'DELETE', params })

module.exports = { getProductFunction, postProductFunction, deleteProductFunction }
