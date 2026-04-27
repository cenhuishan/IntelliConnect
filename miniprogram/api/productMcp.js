const { request } = require('../utils/request');

const getMcpList = (params) => request({ url: '/api/v2/mcpServer', method: 'GET', params });
const addMcp = (data) => request({ url: '/api/v2/mcpServer', method: 'POST', data });
const deleteMcp = (id) => request({ url: '/api/v2/mcpServer', method: 'DELETE', data: { id } });
const getMcpEndpoint = (productId) => request({ url: '/api/v2/mcpEndpoint', method: 'GET', params: { productId } });
const getMcpTools = (productId) => request({ url: '/api/v2/mcpEndpoint/tools', method: 'GET', params: { productId } });

module.exports = { getMcpList, addMcp, deleteMcp, getMcpEndpoint, getMcpTools };
