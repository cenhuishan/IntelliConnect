const { request } = require('../utils/request')

/**
 * Send a chat message to the AI agent for the active product.
 * @param {string} message
 */
function sendChat(message) {
  return request({
    url: '/api/wx/v1/wxChat',
    method: 'POST',
    data: { message },
  })
}

module.exports = { sendChat }
