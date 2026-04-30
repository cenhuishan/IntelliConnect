import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getLlmProviderInformation = (data) =>
  request({
    url: '/api/v2/llmProviderInformation',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postLlmProviderInformation = (data) =>
    request({
      url: '/api/v2/llmProviderInformation',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const deleteLlmProviderInformation = (params) =>
      request({
        url: '/api/v2/llmProviderInformation',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })