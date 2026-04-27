const { request } = require('../utils/request')

const getAlarmEvent = () => request({ url: '/api/v2/alarmEvent', method: 'GET' })
const postAlarmEvent = (data) => request({ url: '/api/v2/alarmEvent', method: 'POST', data })
const deleteAlarmEvent = (params) => request({ url: '/api/v2/alarmEvent', method: 'DELETE', params })

module.exports = { getAlarmEvent, postAlarmEvent, deleteAlarmEvent }
