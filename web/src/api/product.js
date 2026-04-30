import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']

export const getProductName = (params) =>
  request({
    url: '/api/v2/getProductName',
    method: 'get',
    headers: {
        'Authorization': getToken()
      },
    params
  })
export const getProduct = (data) =>
  request({
    url: '/api/v2/Product',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProduct = (data) =>
    request({
      url: '/api/v2/Product',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
    export const deleteProduct = (params) =>
      request({
        url: '/api/v2/Product',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
      })