const { request } = require('../utils/request')

const getAgentMemory = () => request({ url: '/api/v2/memory', method: 'GET' })
const postAgentMemory = (data) => request({ url: '/api/v2/memory', method: 'PUT', data })
const deleteAgentMemory = (params) => request({ url: '/api/v2/memory', method: 'DELETE', params })

module.exports = { getAgentMemory, postAgentMemory, deleteAgentMemory }
