const { request } = require('../utils/request')

/**
 * Get alarm events for all products bound to the current user.
 */
function getAlarmEvents() {
  return request({ url: '/api/wx/v1/wxAlarmEvents', method: 'GET' })
}

module.exports = { getAlarmEvents }
