import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getAdminConfig = (data) =>
  request({
    url: '/api/v2/adminConfig',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postAdminConfig = (data) =>
    request({
      url: '/api/v2/adminConfig',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
   export const putAdminConfig = (data) =>
    request({
      url: '/api/v2/adminConfig',
      method: 'put',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteAdminConfig = (params) =>
      request({
        url: '/api/v2/adminConfig',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })