const { request } = require('../utils/request')

const getProductKnowledge = () => request({ url: '/api/v2/productKnowledge', method: 'GET' })
const postProductKnowledge = (data) => request({ url: '/api/v2/productKnowledge', method: 'POST', data })
const deleteProductKnowledge = (params) => request({ url: '/api/v2/productKnowledge', method: 'DELETE', params })

module.exports = { getProductKnowledge, postProductKnowledge, deleteProductKnowledge }
