import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getProductVoiceDiy = (params) =>
  request({
    url: '/api/v2/productVoiceDiy',
    method: 'get',
    headers: {
        'Authorization': getToken()
      },
    params
  })
  export const postProductVoiceDiy = (data) =>
    request({
      url: '/api/v2/productVoiceDiy',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteProductVoiceDiy = (params) =>
      request({
        url: '/api/v2/productVoiceDiy',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })