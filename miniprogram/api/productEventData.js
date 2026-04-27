const { request } = require('../utils/request');

const getEventDataList = (params) => request({ url: '/api/v2/EventData', method: 'GET', params });
const addEventData = (data) => request({ url: '/api/v2/EventData', method: 'POST', data });
const deleteEventData = (id) => request({ url: '/api/v2/EventData', method: 'DELETE', data: { id } });

module.exports = { getEventDataList, addEventData, deleteEventData };
