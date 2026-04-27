const { request } = require('../utils/request')

const getProductMcp = () => request({ url: '/api/v2/productMcp', method: 'GET' })
const postProductMcp = (data) => request({ url: '/api/v2/productMcp', method: 'POST', data })
const deleteProductMcp = (params) => request({ url: '/api/v2/productMcp', method: 'DELETE', params })

module.exports = { getProductMcp, postProductMcp, deleteProductMcp }
