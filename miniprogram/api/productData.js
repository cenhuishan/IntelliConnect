const { request } = require('../utils/request')

const getProductData = () => request({ url: '/api/v2/ProductData', method: 'GET' })
const postProductData = (data) => request({ url: '/api/v2/ProductData', method: 'POST', data })
const deleteProductData = (params) => request({ url: '/api/v2/ProductData', method: 'DELETE', params })

module.exports = { getProductData, postProductData, deleteProductData }
