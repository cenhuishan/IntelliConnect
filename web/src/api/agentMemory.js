import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getAgentMemory = (data) =>
  request({
    url: '/api/v2/memory',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const putAgentMemory = (data) =>
    request({
      url: '/api/v2/memory',
      method: 'put',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteAgentMemory = (params) =>
      request({
        url: '/api/v2/memory',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })