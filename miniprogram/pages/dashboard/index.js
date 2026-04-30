const { getConnectedNum } = require('../../api/connectedNum');
const { getMachineMessage } = require('../../api/machineMessage');

Page({
  data: {
    connectedData: { num: 0, connectedNum: 0, disconnectedNum: 0 },
    machineInfo: {},
    loading: false,
    timer: null
  },

  onShow() {
    this.loadData();
    this.startAutoRefresh();
  },

  onHide() {
    this.stopAutoRefresh();
  },

  onUnload() {
    this.stopAutoRefresh();
  },

  startAutoRefresh() {
    this.stopAutoRefresh();
    this._timer = setInterval(() => this.loadData(), 5000);
  },

  stopAutoRefresh() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  async loadData() {
    try {
      const [connRes, machRes] = await Promise.all([getConnectedNum(), getMachineMessage()]);
      if (connRes && connRes.errorCode === 200) {
        this.setData({ connectedData: connRes.data || { num: 0, connectedNum: 0, disconnectedNum: 0 } });
      }
      if (machRes && machRes.errorCode === 200) {
        this.setData({ machineInfo: machRes.data || {} });
      }
    } catch (e) {}
  },

  goProduct() {
    wx.switchTab({ url: '/pages/product/index' });
  },

  goMonitor() {
    wx.switchTab({ url: '/pages/deviceMonitor/index' });
  },

  goSchedule() {
    wx.navigateTo({ url: '/pages/timeSchedule/index' });
  },

  goLlm() {
    wx.navigateTo({ url: '/pages/llmProviderInformation/index' });
  }
});
