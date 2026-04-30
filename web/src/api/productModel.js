import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getproductModel = (data) =>
  request({
    url: '/api/v2/ProductModel',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductModel = (data) =>
    request({
      url: '/api/v2/ProductModel',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
    export const deleteProductModel = (params) =>
      request({
        url: '/api/v2/ProductModel',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
      })