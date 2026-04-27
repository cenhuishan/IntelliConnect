const { getProductDevice } = require('../../api/productDevice')
const { getDeviceData, getEventData } = require('../../api/deviceData')
const { getProduct } = require('../../api/product')
const { showError } = require('../../utils/util')

Page({
  data: {
    productList: [],
    deviceList: [],
    selectedProductId: '',
    selectedDeviceName: '',
    selectedTab: 'prop',   // 'prop' | 'event'
    propData: [],
    eventData: [],
    loading: false,
  },

  _timer: null,

  onLoad() {
    this.loadProducts()
  },

  onUnload() {
    clearInterval(this._timer)
  },

  loadProducts() {
    getProduct()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          this.setData({ productList: data })
        }
      })
      .catch(() => showError('加载产品失败'))
  },

  onProductChange(e) {
    const product = this.data.productList[e.detail.value]
    this.setData({ selectedProductId: product.id, deviceList: [], selectedDeviceName: '', propData: [], eventData: [] })
    getProductDevice()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          const devices = data.filter(d => d.productId === product.id)
          this.setData({ deviceList: devices })
        }
      })
  },

  onDeviceChange(e) {
    const device = this.data.deviceList[e.detail.value]
    this.setData({ selectedDeviceName: device.deviceName })
    clearInterval(this._timer)
    this.loadData()
    this._timer = setInterval(() => this.loadData(), 5000)
  },

  onTabChange(e) {
    this.setData({ selectedTab: e.currentTarget.dataset.tab })
  },

  loadData() {
    const { selectedDeviceName } = this.data
    if (!selectedDeviceName) return
    this.setData({ loading: true })
    Promise.all([
      getDeviceData({ deviceName: selectedDeviceName }),
      getEventData({ deviceName: selectedDeviceName }),
    ])
      .then(([propRes, eventRes]) => {
        const propData = propRes.data.errorCode === 200 ? (propRes.data.data || []) : []
        const eventData = eventRes.data.errorCode === 200 ? (eventRes.data.data || []) : []
        this.setData({ propData, eventData })
      })
      .catch(() => showError('加载数据失败'))
      .finally(() => this.setData({ loading: false }))
  },

  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },
})
