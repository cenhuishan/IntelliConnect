const { request } = require('../utils/request');

const getScheduleList = (params) => request({ url: '/api/v2/timeSchedule', method: 'GET', params });
const addSchedule = (data) => request({ url: '/api/v2/timeSchedule', method: 'POST', data });
const updateSchedule = (data) => request({ url: '/api/v2/timeSchedule', method: 'PUT', data });
const deleteSchedule = (id) => request({ url: '/api/v2/timeSchedule', method: 'DELETE', params: { id } });

module.exports = { getScheduleList, addSchedule, updateSchedule, deleteSchedule };
