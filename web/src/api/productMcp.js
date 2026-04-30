import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getMcpServer = (data) =>
  request({
    url: '/api/v2/mcpServer',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postMcpServer = (data) =>
    request({
      url: '/api/v2/mcpServer',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
    export const deleteMcpServer = (params) =>
      request({
        url: '/api/v2/mcpServer',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })