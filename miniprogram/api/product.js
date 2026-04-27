const { request } = require('../utils/request')

const getProduct = () => request({ url: '/api/v2/Product', method: 'GET' })
const postProduct = (data) => request({ url: '/api/v2/Product', method: 'POST', data })
const deleteProduct = (params) => request({ url: '/api/v2/Product', method: 'DELETE', params })
const getProductName = (params) => request({ url: '/api/v2/getProductName', method: 'GET', params })

module.exports = { getProduct, postProduct, deleteProduct, getProductName }
