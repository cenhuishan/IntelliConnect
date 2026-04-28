import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getMcpPointUrl = (params) =>
  request({
    url: '/api/v2/mcpEndpoint',
    method: 'get',
    headers: {
        'Authorization': getToken()
      },
    params
  })

export const getMcpPointTools = (params) =>
    request({
        url: '/api/v2/mcpEndpoint/tools',
        method: 'get',
        headers: {
          'Authorization': getToken()
        },
        params
    })