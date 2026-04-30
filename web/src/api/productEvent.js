import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductEvent = (data) =>
  request({
    url: '/api/v2/ProductEvent',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductEvent = (data) =>
    request({
      url: '/api/v2/ProductEvent',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductEvent = (params) =>
      request({
        url: '/api/v2/ProductEvent',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })