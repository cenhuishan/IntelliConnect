const { request } = require('../utils/request')

const getDeviceData = (params) => request({ url: '/api/v2/readData', method: 'GET', params })
const getEventData = (params) => request({ url: '/api/v2/readEvent', method: 'GET', params })
const getMetaData = (params) => request({ url: '/api/v2/metaData', method: 'GET', params })

module.exports = { getDeviceData, getEventData, getMetaData }
