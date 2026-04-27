const { request } = require('../utils/request')

const getAgentLongMemory = () => request({ url: '/api/v2/agentLongMemory', method: 'GET' })
const postAgentLongMemory = (data) => request({ url: '/api/v2/agentLongMemory', method: 'POST', data })
const deleteAgentLongMemory = (params) => request({ url: '/api/v2/agentLongMemory', method: 'DELETE', params })

module.exports = { getAgentLongMemory, postAgentLongMemory, deleteAgentLongMemory }
