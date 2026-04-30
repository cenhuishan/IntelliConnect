const { getToken } = require('./utils/storage');

App({
  globalData: {
    token: '',
    userInfo: null,
    baseUrl: 'http://47.116.141.183:8080'
  },

  onLaunch() {
    const token = getToken();
    if (token) {
      this.globalData.token = token;
    } else {
      wx.reLaunch({ url: '/pages/login/index' });
    }
  },

  getBaseUrl() {
    return this.globalData.baseUrl;
  },

  setBaseUrl(url) {
    this.globalData.baseUrl = url;
    wx.setStorageSync('baseUrl', url);
  }
});
