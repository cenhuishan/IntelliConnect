const { request } = require('../utils/request');

const getMcpPointUrl = (params) => request({ url: '/api/v2/mcpEndpoint', method: 'GET', params });
const getMcpPointTools = (params) => request({ url: '/api/v2/mcpEndpoint/tools', method: 'GET', params });

module.exports = { getMcpPointUrl, getMcpPointTools };
