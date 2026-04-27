const { request } = require('../utils/request');

const getConnectedNum = () => request({ url: '/api/v2/getConnectedNum', method: 'GET' });

module.exports = { getConnectedNum };
