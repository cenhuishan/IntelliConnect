const { getAlarmEvents } = require('../../api/alarm')

Page({
  data: {
    alarms: [],
    loading: true,
  },

  onShow() {
    this.loadAlarms()
  },

  onPullDownRefresh() {
    this.loadAlarms()
  },

  loadAlarms() {
    this.setData({ loading: true })
    getAlarmEvents()
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          this.setData({ alarms: body.data || [], loading: false })
        } else {
          this.setData({ alarms: [], loading: false })
        }
        wx.stopPullDownRefresh()
      })
      .catch(() => {
        this.setData({ loading: false })
        wx.stopPullDownRefresh()
      })
  },
})
