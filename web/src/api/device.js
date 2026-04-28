import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductDevice = (data) =>
  request({
    url: '/api/v2/ProductDevice',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductDevice = (data) =>
    request({
      url: '/api/v2/ProductDevice',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
    export const deleteProductDevice = (params) =>
      request({
        url: '/api/v2/ProductDevice',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
      })