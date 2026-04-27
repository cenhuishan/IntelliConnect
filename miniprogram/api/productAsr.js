const { request } = require('../utils/request')

const getProductAsr = () => request({ url: '/api/v2/productAsr', method: 'GET' })
const postProductAsr = (data) => request({ url: '/api/v2/productAsr', method: 'POST', data })
const deleteProductAsr = (params) => request({ url: '/api/v2/productAsr', method: 'DELETE', params })

module.exports = { getProductAsr, postProductAsr, deleteProductAsr }
