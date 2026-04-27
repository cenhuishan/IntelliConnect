/**
 * 统一请求封装 - 基于 wx.request
 * 自动携带 Authorization token，统一处理 2001（未登录）跳转
 */

const BASE_URL = wx.getStorageSync('baseUrl') || 'http://localhost:8080'

function getToken() {
  return wx.getStorageSync('token') || ''
}

function request(options) {
  const { url, method = 'GET', data, params, headers = {} } = options

  // 拼接 query params
  let fullUrl = BASE_URL + url
  if (params && Object.keys(params).length > 0) {
    const qs = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')
    fullUrl += '?' + qs
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data: data || {},
      header: {
        'Content-Type': 'application/json',
        Authorization: getToken(),
        ...headers,
      },
      success(res) {
        const { errorCode } = res.data || {}
        if (errorCode === 2001) {
          wx.removeStorageSync('token')
          wx.reLaunch({ url: '/pages/login/login' })
          return
        }
        resolve(res)
      },
      fail(err) {
        wx.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
    })
  })
}

module.exports = { request }
