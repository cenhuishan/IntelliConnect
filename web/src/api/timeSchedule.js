import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']

export const getTimeSchedule = () =>
  request({
    url: '/api/v2/timeSchedule',
    method: 'get',
    headers: {
      'Authorization': getToken()
    }
  })

export const postTimeSchedule = (data) =>
  request({
    url: '/api/v2/timeSchedule',
    method: 'post',
    headers: {
      'Authorization': getToken()
    },
    data
  })

export const putTimeSchedule = (data) =>
  request({
    url: '/api/v2/timeSchedule',
    method: 'put',
    headers: {
      'Authorization': getToken()
    },
    data
  })

export const deleteTimeSchedule = (params) =>
  request({
    url: '/api/v2/timeSchedule',
    method: 'delete',
    headers: {
      'Authorization': getToken()
    },
    params
  })
