import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductToolsBan = (params) =>
  request({
    url: '/api/v2/productToolsBan',
    method: 'get',
    headers: {
        'Authorization': getToken()
      },
    params
  })
  export const postProductToolsBan = (data) =>
    request({
      url: '/api/v2/productToolsBan',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductToolsBan = (params) =>
      request({
        url: '/api/v2/productToolsBan',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })