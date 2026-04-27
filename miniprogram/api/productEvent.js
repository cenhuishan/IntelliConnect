const { request } = require('../utils/request')

const getProductEvent = () => request({ url: '/api/v2/ProductEvent', method: 'GET' })
const postProductEvent = (data) => request({ url: '/api/v2/ProductEvent', method: 'POST', data })
const deleteProductEvent = (params) => request({ url: '/api/v2/ProductEvent', method: 'DELETE', params })

module.exports = { getProductEvent, postProductEvent, deleteProductEvent }
