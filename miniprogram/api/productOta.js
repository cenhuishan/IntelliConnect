const { request, uploadFile } = require('../utils/request');

const getOtaList = (params) => request({ url: '/api/v2/otaList', method: 'GET', params });
const deleteOta = (id) => request({ url: '/api/v2/otaDelete', method: 'DELETE', params: { id } });
const uploadOta = (filePath, formData) => uploadFile({ url: '/api/v2/otaUpload', filePath, name: 'file', formData });

module.exports = { getOtaList, deleteOta, uploadOta };
