const { getDeviceData } = require('../../api/device')
const { getProductModel } = require('../../api/product')

// Preset time ranges (ms)
const RANGES = {
  today: () => {
    const now = Date.now()
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return { time1: start.getTime(), time2: now }
  },
  week: () => ({ time1: Date.now() - 7 * 24 * 3600 * 1000, time2: Date.now() }),
}

Page({
  data: {
    deviceName: '',
    jsonKeys: [],
    selectedKey: '',
    range: 'today',
    chartData: [],
    loading: false,
    refreshTimer: null,
  },

  onLoad(options) {
    const deviceName = decodeURIComponent(options.deviceName || '')
    this.setData({ deviceName })
    wx.setNavigationBarTitle({ title: deviceName })
    this.loadModelKeys()
  },

  onUnload() {
    if (this.data.refreshTimer) {
      clearInterval(this.data.refreshTimer)
    }
  },

  loadModelKeys() {
    getProductModel()
      .then((res) => {
        if (res.data.errorCode === 200) {
          const models = res.data.data || []
          const keys = []
          // Models have no direct jsonKeys here (those are in ProductData), show model names
          models.forEach((m) => keys.push(m.name))
          this.setData({ jsonKeys: keys, selectedKey: keys[0] || '' })
          if (keys.length > 0) {
            this.loadData()
          }
        }
      })
      .catch(console.error)
  },

  onKeyChange(e) {
    this.setData({ selectedKey: this.data.jsonKeys[e.detail.value] })
    this.loadData()
  },

  onRangeChange(e) {
    this.setData({ range: e.currentTarget.dataset.range })
    this.loadData()
  },

  loadData() {
    const { deviceName, selectedKey, range } = this.data
    if (!deviceName || !selectedKey) return
    const { time1, time2 } = RANGES[range] ? RANGES[range]() : RANGES.today()
    this.setData({ loading: true })
    getDeviceData(deviceName, selectedKey, time1, time2)
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          this.setData({ chartData: body.data || [], loading: false })
          this.drawChart(body.data || [])
        } else {
          this.setData({ chartData: [], loading: false })
        }
      })
      .catch(() => this.setData({ loading: false }))
  },

  drawChart(data) {
    // Simple text-based chart — replace with ec-canvas / wx-charts for real charts
    // The chartData binding renders a table; a real implementation should use ec-canvas
    this.setData({ chartData: data })
  },

  startAutoRefresh() {
    if (this.data.refreshTimer) clearInterval(this.data.refreshTimer)
    const timer = setInterval(() => this.loadData(), 5000)
    this.setData({ refreshTimer: timer })
  },

  onShow() {
    this.startAutoRefresh()
  },

  onHide() {
    if (this.data.refreshTimer) {
      clearInterval(this.data.refreshTimer)
      this.setData({ refreshTimer: null })
    }
  },
})
