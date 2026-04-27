const { request } = require('../utils/request')

const getProductRouterSet = () => request({ url: '/api/v2/productRouterSet', method: 'GET' })
const postProductRouterSet = (data) => request({ url: '/api/v2/productRouterSet', method: 'POST', data })
const deleteProductRouterSet = (params) => request({ url: '/api/v2/productRouterSet', method: 'DELETE', params })

module.exports = { getProductRouterSet, postProductRouterSet, deleteProductRouterSet }
