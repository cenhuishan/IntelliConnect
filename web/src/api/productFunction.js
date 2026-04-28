import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductFunction = (data) =>
  request({
    url: '/api/v2/ProductFunction',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductFunction = (data) =>
    request({
      url: '/api/v2/ProductFunction',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
    export const deleteProductFunction = (params) =>
      request({
        url: '/api/v2/ProductFunction',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
      })