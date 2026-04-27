App({
  globalData: {
    token: '',
    baseUrl: 'http://localhost:8080',
    userInfo: null,
  },

  onLaunch() {
    const token = wx.getStorageSync('token')
    const baseUrl = wx.getStorageSync('baseUrl')
    if (token) {
      this.globalData.token = token
    }
    if (baseUrl) {
      this.globalData.baseUrl = baseUrl
    }
  },
})
