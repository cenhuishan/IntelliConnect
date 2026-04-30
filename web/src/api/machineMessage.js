import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getMachineMessage = (data) =>
  request({
    url: '/api/v2/machineMessage',
    method: 'get',
    headers: {
        'Authorization': getToken()
      }
  })
