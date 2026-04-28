import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getOtaXiaoZhiPassive = (data) =>
  request({
    url: '/api/v2/xiaozhi/otaPassive',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postOtaXiaoZhiPassive = (data) =>
    request({
      url: '/api/v2/xiaozhi/otaPassive',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteOtaXiaoZhiPassive = (params) =>
      request({
        url: '/api/v2/xiaozhi/otaPassive',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })