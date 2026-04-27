const { request } = require('../utils/request')

const getAgentLongMemory = () => request({ url: '/api/v2/longMemory', method: 'GET' })
const postAgentLongMemory = (data) => request({ url: '/api/v2/longMemory', method: 'POST', data })
const deleteAgentLongMemory = (params) => request({ url: '/api/v2/longMemory', method: 'DELETE', params })

module.exports = { getAgentLongMemory, postAgentLongMemory, deleteAgentLongMemory }
