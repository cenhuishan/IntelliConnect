const { login } = require('../../api/auth')
const { showError } = require('../../utils/util')

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    baseUrl: '',
  },

  onLoad() {
    const saved = wx.getStorageSync('baseUrl') || 'http://localhost:8080'
    this.setData({ baseUrl: saved })
    // 已登录则直接跳首页
    if (wx.getStorageSync('token')) {
      wx.switchTab({ url: '/pages/dashboard/dashboard' })
    }
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onBaseUrlInput(e) {
    this.setData({ baseUrl: e.detail.value })
  },

  onLogin() {
    const { username, password, baseUrl } = this.data
    if (!username || !password) {
      showError('请输入用户名和密码')
      return
    }
    // 保存 baseUrl
    wx.setStorageSync('baseUrl', baseUrl)
    this.setData({ loading: true })
    login({ username, password })
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200) {
          wx.setStorageSync('token', data)
          wx.switchTab({ url: '/pages/dashboard/dashboard' })
        } else {
          showError('用户名或密码错误')
        }
      })
      .catch(() => showError('登录失败，请检查网络'))
      .finally(() => this.setData({ loading: false }))
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/register/register' })
  },
})
