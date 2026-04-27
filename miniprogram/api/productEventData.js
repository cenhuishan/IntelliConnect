const { request } = require('../utils/request')

const getProductEventData = () => request({ url: '/api/v2/EventData', method: 'GET' })
const postProductEventData = (data) => request({ url: '/api/v2/EventData', method: 'POST', data })
const deleteProductEventData = (params) => request({ url: '/api/v2/EventData', method: 'DELETE', params })

module.exports = { getProductEventData, postProductEventData, deleteProductEventData }
