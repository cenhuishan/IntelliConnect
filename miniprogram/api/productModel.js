const { request } = require('../utils/request')

const getProductModel = () => request({ url: '/api/v2/ProductModel', method: 'GET' })
const postProductModel = (data) => request({ url: '/api/v2/ProductModel', method: 'POST', data })
const deleteProductModel = (params) => request({ url: '/api/v2/ProductModel', method: 'DELETE', params })

module.exports = { getProductModel, postProductModel, deleteProductModel }
