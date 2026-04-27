const { request } = require('../utils/request')

const getTimeSchedule = () => request({ url: '/api/v2/timeSchedule', method: 'GET' })
const postTimeSchedule = (data) => request({ url: '/api/v2/timeSchedule', method: 'POST', data })
const deleteTimeSchedule = (params) => request({ url: '/api/v2/timeSchedule', method: 'DELETE', params })
const triggerTimeSchedule = (params) => request({ url: '/api/v2/timeSchedule/trigger', method: 'POST', params })

module.exports = { getTimeSchedule, postTimeSchedule, deleteTimeSchedule, triggerTimeSchedule }
