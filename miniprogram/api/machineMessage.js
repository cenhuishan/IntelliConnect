const { request } = require('../utils/request');

const getMachineMessage = () => request({ url: '/api/v2/machineMessage', method: 'GET' });

module.exports = { getMachineMessage };
