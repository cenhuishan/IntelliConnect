import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getXiaoZhiManager = (data) =>
  request({
    url: '/api/v2/xiaozhi/otaManage',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postXiaoZhiManager = (data) =>
    request({
      url: '/api/v2/xiaozhi/otaManage',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const putXiaoZhiManager = (params) =>
        request({
            url: '/api/v2/xiaozhi/otaManage',
            method: 'put',
            headers: {
                'Authorization': getToken()
            },
            params
        })
    export const deleteXiaoZhiManager = (params) =>
      request({
        url: '/api/v2/xiaozhi/otaManage',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
      })
