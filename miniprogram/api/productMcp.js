const { request } = require('../utils/request')

const getProductMcp = () => request({ url: '/api/v2/mcpServer', method: 'GET' })
const postProductMcp = (data) => request({ url: '/api/v2/mcpServer', method: 'POST', data })
const deleteProductMcp = (params) => request({ url: '/api/v2/mcpServer', method: 'DELETE', params })

module.exports = { getProductMcp, postProductMcp, deleteProductMcp }
