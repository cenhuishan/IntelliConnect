const { request } = require('../utils/request')

const getProductLlmModel = () => request({ url: '/api/v2/productLlmModel', method: 'GET' })
const postProductLlmModel = (data) => request({ url: '/api/v2/productLlmModel', method: 'POST', data })
const deleteProductLlmModel = (params) => request({ url: '/api/v2/productLlmModel', method: 'DELETE', params })

module.exports = { getProductLlmModel, postProductLlmModel, deleteProductLlmModel }
