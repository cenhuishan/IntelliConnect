const { request } = require('../utils/request')

const getConnectedNum = () => request({ url: '/api/v2/connectedNum', method: 'GET' })

module.exports = { getConnectedNum }
