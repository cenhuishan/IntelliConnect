import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
export const getDeviceData = (data) =>
  request({
    url: '/api/v2/readData',
    method: 'post',
    headers: {
        'Authorization': getToken()
      },
    data
  })
  