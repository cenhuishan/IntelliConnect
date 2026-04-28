import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductEventData = (data) =>
  request({
    url: '/api/v2/EventData',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductEventData = (data) =>
    request({
      url: '/api/v2/EventData',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductEventData = (params) =>
      request({
        url: '/api/v2/EventData',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })