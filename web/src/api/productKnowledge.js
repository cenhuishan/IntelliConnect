import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
 export const getKnowledgeChat = (data) =>
  request({
    url: '/api/v2/knowledgeChat',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  export const postKnowledgeChatRecall = (data) =>
  request({
    url: '/api/v2/knowledgeChatRecall',
    method: 'post',
    headers: {
        'Authorization': getToken()
      },
    data
  })
  export const uploadKnowledge = (file, params) => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/api/v2/knowledgeChat',
    method: 'post',
    headers: {
      'Authorization': getToken(),
    },
    params, 
    data: formData
  })
  }
  export const deleteKnowledgeChat = (params) =>
    request({
        url: '/api/v2/knowledgeChat',
        method: 'delete',
        headers: {
          'Authorization': getToken()
        },
        params
    })