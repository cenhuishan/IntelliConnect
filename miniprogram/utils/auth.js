const { BASE_URL } = require('./constants')

/**
 * Perform silent WeChat login:
 *   wx.login() → code → POST /wxLogin → store JWT
 *
 * Returns a Promise that resolves with the login response data.
 */
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(loginRes) {
        if (!loginRes.code) {
          reject(new Error('wx.login failed: no code'))
          return
        }
        wx.request({
          url: BASE_URL + '/wxLogin',
          method: 'POST',
          header: { 'content-type': 'application/json' },
          data: { code: loginRes.code },
          success(res) {
            const body = res.data
            if (body && body.errorCode === 200 && body.data && body.data.token) {
              wx.setStorageSync('token', body.data.token)
              wx.setStorageSync('isNewUser', body.data.isNewUser)
              resolve(body.data)
            } else {
              reject(new Error('Login failed: ' + JSON.stringify(body)))
            }
          },
          fail: reject,
        })
      },
      fail: reject,
    })
  })
}

/**
 * Returns true if a token is currently stored (user appears to be logged in).
 */
function isLoggedIn() {
  return !!wx.getStorageSync('token')
}

/**
 * Clear stored credentials.
 */
function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('isNewUser')
}

module.exports = { login, isLoggedIn, logout }
