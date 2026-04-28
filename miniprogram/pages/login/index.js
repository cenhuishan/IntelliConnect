const { login } = require('../../utils/auth')

Page({
  data: {
    loading: true,
    error: '',
  },

  onLoad() {
    login()
      .then(() => {
        wx.switchTab({ url: '/pages/index/index' })
      })
      .catch((err) => {
        console.error(err)
        this.setData({ loading: false, error: '登录失败，请重试' })
      })
  },

  onRetry() {
    this.setData({ loading: true, error: '' })
    login()
      .then(() => {
        wx.switchTab({ url: '/pages/index/index' })
      })
      .catch((err) => {
        console.error(err)
        this.setData({ loading: false, error: '登录失败，请重试' })
      })
  },
})
