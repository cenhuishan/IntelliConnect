const { request } = require('../utils/request')

const getAgentMemory = () => request({ url: '/api/v2/agentMemory', method: 'GET' })
const postAgentMemory = (data) => request({ url: '/api/v2/agentMemory', method: 'POST', data })
const deleteAgentMemory = (params) => request({ url: '/api/v2/agentMemory', method: 'DELETE', params })

module.exports = { getAgentMemory, postAgentMemory, deleteAgentMemory }
