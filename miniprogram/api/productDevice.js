const { request } = require('../utils/request')

const getProductDevice = () => request({ url: '/api/v2/ProductDevice', method: 'GET' })
const postProductDevice = (data) => request({ url: '/api/v2/ProductDevice', method: 'POST', data })
const deleteProductDevice = (params) => request({ url: '/api/v2/ProductDevice', method: 'DELETE', params })

module.exports = { getProductDevice, postProductDevice, deleteProductDevice }
