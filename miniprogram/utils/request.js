const { BASE_URL } = require('./constants')

/**
 * Unified HTTP request wrapper.
 * - Auto-injects JWT from storage as Authorization header.
 * - On 401/403 redirects to the login page.
 *
 * @param {object} options  wx.request-compatible options (url, method, data, params, header)
 * @returns {Promise}
 */
function request(options) {
  const token = wx.getStorageSync('token') || ''
  const url = options.params
    ? BASE_URL + options.url + '?' + buildQuery(options.params)
    : BASE_URL + options.url

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header: Object.assign(
        {
          'content-type': 'application/json',
          Authorization: token,
        },
        options.header || {},
      ),
      success(res) {
        if (res.statusCode === 401 || res.statusCode === 403) {
          wx.removeStorageSync('token')
          wx.reLaunch({ url: '/pages/login/index' })
          reject(res)
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

function buildQuery(params) {
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

module.exports = { request }
