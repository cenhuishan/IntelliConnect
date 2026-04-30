const { request } = require('../utils/request');

const readData = (data) => request({ url: '/api/v2/readData', method: 'POST', data });

module.exports = { readData };
