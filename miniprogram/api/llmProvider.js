const { request } = require('../utils/request')

const getLlmProvider = () => request({ url: '/api/v2/llmProviderInformation', method: 'GET' })
const postLlmProvider = (data) => request({ url: '/api/v2/llmProviderInformation', method: 'POST', data })
const deleteLlmProvider = (params) => request({ url: '/api/v2/llmProviderInformation', method: 'DELETE', params })

module.exports = { getLlmProvider, postLlmProvider, deleteLlmProvider }
