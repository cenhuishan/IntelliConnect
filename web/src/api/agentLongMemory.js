import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getLongMemory = (data) =>
  request({
    url: '/api/v2/longMemory',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postLongMemory = (data) =>
    request({
      url: '/api/v2/longMemory',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteLongMemory = (params) =>
    request({
        url: '/api/v2/longMemory',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })