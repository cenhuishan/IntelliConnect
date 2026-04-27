const { request } = require('../utils/request');

const getEventList = (params) => request({ url: '/api/v2/ProductEvent', method: 'GET', params });
const addEvent = (data) => request({ url: '/api/v2/ProductEvent', method: 'POST', data });
const deleteEvent = (id) => request({ url: '/api/v2/ProductEvent', method: 'DELETE', data: { id } });

module.exports = { getEventList, addEvent, deleteEvent };
