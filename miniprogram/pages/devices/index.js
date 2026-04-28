const { getProductDevices } = require('../../api/device')
const { getProductInfo } = require('../../api/product')

Page({
  data: {
    productName: '',
    devices: [],
    loading: true,
  },

  onShow() {
    this.loadDevices()
  },

  loadDevices() {
    this.setData({ loading: true })
    getProductInfo()
      .then((res) => {
        if (res.data.errorCode === 200) {
          this.setData({ productName: res.data.data.productName || '' })
        }
      })
      .catch(console.error)

    getProductDevices()
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          this.setData({ devices: body.data || [], loading: false })
        } else {
          this.setData({ devices: [], loading: false })
        }
      })
      .catch(() => this.setData({ loading: false }))
  },

  onDeviceTap(e) {
    const deviceName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/deviceData/index?deviceName=${encodeURIComponent(deviceName)}`,
    })
  },
})
