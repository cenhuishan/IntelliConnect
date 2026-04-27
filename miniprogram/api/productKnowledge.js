const { request, uploadFile } = require('../utils/request');

const getKnowledgeList = (params) => request({ url: '/api/v2/knowledgeChat', method: 'GET', params });
const deleteKnowledge = (id) => request({ url: '/api/v2/knowledgeChat', method: 'DELETE', data: { id } });
const uploadKnowledge = (filePath, formData) => uploadFile({ url: '/api/v2/knowledgeChat', filePath, name: 'file', formData });
const recallKnowledge = (data) => request({ url: '/api/v2/knowledgeChatRecall', method: 'POST', data });

module.exports = { getKnowledgeList, deleteKnowledge, uploadKnowledge, recallKnowledge };
