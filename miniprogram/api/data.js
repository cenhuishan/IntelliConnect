const { request } = require('../utils/request');

const queryTable = (params) => request({ url: '/queryTable', method: 'GET', params });

module.exports = { queryTable };
