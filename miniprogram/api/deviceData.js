const { request } = require('../utils/request')

const getDeviceData = (data) => request({ url: '/api/v2/readData', method: 'POST', data })
const getEventData = (data) => request({ url: '/api/v2/readEvent', method: 'POST', data })
const getMetaData = (data) => request({ url: '/api/v2/metaData', method: 'POST', data })

module.exports = { getDeviceData, getEventData, getMetaData }
