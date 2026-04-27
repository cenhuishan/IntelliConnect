const { login } = require('../../api/user');
const { setToken } = require('../../utils/storage');
const { showToast, showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async onLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      showToast('请输入用户名和密码');
      return;
    }
    this.setData({ loading: true });
    showLoading('登录中...');
    try {
      const res = await login({ username, password });
      if (res && res.errorCode === 200) {
        setToken(res.data.token || res.data);
        wx.switchTab({ url: '/pages/dashboard/index' });
      } else {
        showToast(res && res.message ? res.message : '登录失败');
      }
    } catch (e) {
      showToast('登录失败，请检查网络');
    } finally {
      hideLoading();
      this.setData({ loading: false });
    }
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/register/index' });
  },

  goForgotPassword() {
    wx.navigateTo({ url: '/pages/register/index?mode=forgot' });
  }
});
