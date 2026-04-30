import request from '@/utils/request'
import store from '@/store'

const getToken = () => store.getters['auth/token']

export const getProductAsr = (params) =>
  request({
    url: '/api/v2/productAsr',
    method: 'get',
    headers: {
      'Authorization': getToken()
    },
    params
  })

export const postProductAsr = (data) =>
  request({
    url: '/api/v2/productAsr',
    method: 'post',
    headers: {
      'Authorization': getToken()
    },
    data
  })

export const putProductAsr = (data) =>
  request({
    url: '/api/v2/productAsr',
    method: 'put',
    headers: {
      'Authorization': getToken()
    },
    data
  })

export const deleteProductAsr = (params) =>
  request({
    url: '/api/v2/productAsr',
    method: 'delete',
    headers: {
      'Authorization': getToken()
    },
    params
  })
