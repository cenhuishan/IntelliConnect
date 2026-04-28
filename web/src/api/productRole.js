import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductRole = (data) =>
  request({
    url: '/api/v2/productRole',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductRole = (data) =>
    request({
      url: '/api/v2/productRole',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
   export const putProductRole = (data) =>
    request({
      url: '/api/v2/productRole',
      method: 'put',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductRole = (params) =>
      request({
        url: '/api/v2/productRole',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })