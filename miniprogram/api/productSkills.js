const { request, uploadFile } = require('../utils/request');

const getSkillsList = (params) => request({ url: '/api/v2/productSkills', method: 'GET', params });
const deleteSkill = (id) => request({ url: '/api/v2/productSkills', method: 'DELETE', data: { id } });
const uploadSkill = (filePath, formData) => uploadFile({ url: '/api/v2/productSkills', filePath, name: 'file', formData });

module.exports = { getSkillsList, deleteSkill, uploadSkill };
