import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const  getConnectedNum = (data) =>
  request({
    url: '/api/v2/getConnectedNum',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
  