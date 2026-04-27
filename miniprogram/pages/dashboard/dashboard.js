const { getConnectedNum } = require('../../api/connectedNum')

Page({
  data: {
    num: 0,
    connected: 0,
    disconnected: 0,
    loading: false,
  },

  _timer: null,

  onLoad() {
    this.fetchStats()
  },

  onShow() {
    this._timer = setInterval(() => this.fetchStats(), 5000)
  },

  onHide() {
    clearInterval(this._timer)
  },

  onUnload() {
    clearInterval(this._timer)
  },

  fetchStats() {
    getConnectedNum()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200) {
          const { num, connectedNum, disconnectedNum } = data.data || data
          this.setData({ num, connected: connectedNum, disconnected: disconnectedNum })
        }
      })
      .catch(() => {})
  },

  goProduct()       { wx.switchTab({ url: '/pages/product/product' }) },
  goDeviceMonitor() { wx.switchTab({ url: '/pages/deviceMonitor/deviceMonitor' }) },
  goPermission()    { wx.navigateTo({ url: '/pages/permission/permission' }) },
  goAbout()         { wx.navigateTo({ url: '/pages/about/about' }) },
})
