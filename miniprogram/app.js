const { login, isLoggedIn } = require('./utils/auth')

App({
  globalData: {
    token: '',
    activeProductId: 0,
  },

  onLaunch() {
    if (!isLoggedIn()) {
      // Silent login on first launch
      login()
        .then((data) => {
          this.globalData.token = data.token
          if (data.isNewUser) {
            wx.showToast({ title: '欢迎新用户！', icon: 'none' })
          }
        })
        .catch((err) => {
          console.error('Login failed', err)
          wx.showModal({
            title: '登录失败',
            content: '无法完成微信登录，请检查网络后重试',
            showCancel: false,
          })
        })
    } else {
      this.globalData.token = wx.getStorageSync('token')
    }
  },
})
