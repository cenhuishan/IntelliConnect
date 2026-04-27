const { request } = require('../utils/request');

const getAlarmEventList = (params) => request({ url: '/api/v2/alarmEvent', method: 'GET', params });
const addAlarmEvent = (data) => request({ url: '/api/v2/alarmEvent', method: 'POST', data });
const deleteAlarmEvent = (id) => request({ url: '/api/v2/alarmEvent', method: 'DELETE', data: { id } });

module.exports = { getAlarmEventList, addAlarmEvent, deleteAlarmEvent };
