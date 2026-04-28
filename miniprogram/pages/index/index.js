const { getMyProducts } = require('../../api/product')
const { getProductDevices } = require('../../api/device')

Page({
  data: {
    productCount: 0,
    deviceTotal: 0,
    deviceOnline: 0,
    loading: true,
  },

  onShow() {
    this.loadSummary()
  },

  loadSummary() {
    this.setData({ loading: true })
    getMyProducts()
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          const products = body.data || []
          this.setData({ productCount: products.length })
        }
      })
      .catch(console.error)

    getProductDevices()
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          const devices = body.data || []
          const online = devices.filter((d) => d.online === 'connected').length
          this.setData({ deviceTotal: devices.length, deviceOnline: online, loading: false })
        } else {
          this.setData({ loading: false })
        }
      })
      .catch(() => this.setData({ loading: false }))
  },

  goToDevices() {
    wx.switchTab({ url: '/pages/devices/index' })
  },

  goToAlarms() {
    wx.switchTab({ url: '/pages/alarms/index' })
  },

  goToChat() {
    wx.switchTab({ url: '/pages/chat/index' })
  },

  goToProducts() {
    wx.switchTab({ url: '/pages/products/index' })
  },

  goToKnowledgeGraph() {
    wx.navigateTo({ url: '/pages/knowledgeGraph/index' })
  },
})
