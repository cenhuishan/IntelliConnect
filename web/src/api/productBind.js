import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']
  export const postProductBind = (data) =>
    request({
      url: '/api/v2/userProductBind',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
  export const postProductUnbind = (data) =>
    request({
      url: '/api/v2/userProductUnbind',
      method: 'post',
      headers: {
        'Authorization': getToken()
      },
      data
    })
   