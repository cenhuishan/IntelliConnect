import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getAlarmEvent = (data) =>
  request({
    url: '/api/v2/alarmEvent',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postAlarmEvent = (data) =>
    request({
      url: '/api/v2/alarmEvent',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteAlarmEvent = (params) =>
      request({
        url: '/api/v2/alarmEvent',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })