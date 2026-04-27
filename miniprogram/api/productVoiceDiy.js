const { request } = require('../utils/request');

const getVoiceDiyList = (params) => request({ url: '/api/v2/productVoiceDiy', method: 'GET', params });
const addVoiceDiy = (data) => request({ url: '/api/v2/productVoiceDiy', method: 'POST', data });
const deleteVoiceDiy = (id) => request({ url: '/api/v2/productVoiceDiy', method: 'DELETE', data: { id } });

module.exports = { getVoiceDiyList, addVoiceDiy, deleteVoiceDiy };
