const { request } = require('../utils/request')

/**
 * List devices for the currently active product.
 */
function getProductDevices() {
  return request({ url: '/api/wx/v1/wxProductDevices', method: 'GET' })
}

/**
 * Query historical property data for a device.
 * @param {string} deviceName
 * @param {string} jsonKey     property key
 * @param {number} time1       start epoch ms
 * @param {number} time2       end epoch ms
 */
function getDeviceData(deviceName, jsonKey, time1, time2) {
  return request({
    url: '/api/wx/v1/wxDeviceData',
    method: 'GET',
    params: { deviceName, jsonKey, time1, time2 },
  })
}

/**
 * Get event data schema definitions for the user's bound products.
 */
function getEventData() {
  return request({ url: '/api/wx/v1/wxEventData', method: 'GET' })
}

module.exports = { getProductDevices, getDeviceData, getEventData }
