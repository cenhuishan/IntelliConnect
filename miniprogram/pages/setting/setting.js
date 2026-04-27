Page({
  data: {
    baseUrl: '',
    username: '',
  },

  onLoad() {
    const baseUrl = wx.getStorageSync('baseUrl') || 'http://localhost:8080'
    this.setData({ baseUrl })
  },

  onBaseUrlInput(e) { this.setData({ baseUrl: e.detail.value }) },

  saveBaseUrl() {
    wx.setStorageSync('baseUrl', this.data.baseUrl)
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.reLaunch({ url: '/pages/login/login' })
        }
      },
    })
  },

  goPermission() { wx.navigateTo({ url: '/pages/permission/permission' }) },
  goAbout()      { wx.navigateTo({ url: '/pages/about/about' }) },
})
