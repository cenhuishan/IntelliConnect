import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductLlmModel = (data) =>
  request({
    url: '/api/v2/productLlmModel',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postProductLlmModel = (data) =>
    request({
      url: '/api/v2/productLlmModel',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductLlmModel = (params) =>
      request({
        url: '/api/v2/productLlmModel',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })