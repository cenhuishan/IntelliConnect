const { request } = require('../utils/request')

const getKnowledgeGraphic = () => request({ url: '/api/v2/knowledgeGraphic', method: 'GET' })
const postKnowledgeGraphic = (data) => request({ url: '/api/v2/knowledgeGraphic', method: 'POST', data })
const deleteKnowledgeGraphic = (params) => request({ url: '/api/v2/knowledgeGraphic', method: 'DELETE', params })

module.exports = { getKnowledgeGraphic, postKnowledgeGraphic, deleteKnowledgeGraphic }
