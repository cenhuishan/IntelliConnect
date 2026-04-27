const { request } = require('../utils/request')

const getProductOta = () => request({ url: '/api/v2/otaList', method: 'GET' })
const postProductOta = (data) => request({ url: '/api/v2/otaEnable', method: 'POST', data })
const deleteProductOta = (params) => request({ url: '/api/v2/otaDelete', method: 'DELETE', params })
const getOtaPassive = () => request({ url: '/api/v2/otaPassive', method: 'GET' })
const postOtaPassive = (data) => request({ url: '/api/v2/otaPassive', method: 'POST', data })
const deleteOtaPassive = (params) => request({ url: '/api/v2/otaPassive', method: 'DELETE', params })

module.exports = { getProductOta, postProductOta, deleteProductOta, getOtaPassive, postOtaPassive, deleteOtaPassive }
