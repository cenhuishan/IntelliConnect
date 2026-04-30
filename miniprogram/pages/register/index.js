const { register, forgotPassword, getUserCode } = require('../../api/user');
const { showToast, showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    mode: 'register',
    username: '',
    password: '',
    email: '',
    code: '',
    loading: false
  },

  onLoad(options) {
    if (options.mode === 'forgot') {
      this.setData({ mode: 'forgot' });
      wx.setNavigationBarTitle({ title: '忘记密码' });
    }
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  async getCode() {
    const { email } = this.data;
    if (!email) { showToast('请输入邮箱'); return; }
    showLoading('发送中...');
    try {
      const res = await getUserCode({ email });
      if (res && res.errorCode === 200) {
        showToast('验证码已发送');
      } else {
        showToast(res && res.message ? res.message : '发送失败');
      }
    } catch (e) {
      showToast('发送失败');
    } finally {
      hideLoading();
    }
  },

  async onSubmit() {
    const { mode, username, password, email, code } = this.data;
    if (mode === 'register') {
      if (!username || !password || !email) { showToast('请填写完整信息'); return; }
    } else {
      if (!email || !code || !password) { showToast('请填写完整信息'); return; }
    }
    showLoading(mode === 'register' ? '注册中...' : '重置中...');
    try {
      let res;
      if (mode === 'register') {
        res = await register({ username, password, email });
      } else {
        res = await forgotPassword({ email, code, password });
      }
      if (res && res.errorCode === 200) {
        showToast(mode === 'register' ? '注册成功' : '密码重置成功');
        setTimeout(() => wx.navigateBack(), 1500);
      } else {
        showToast(res && res.message ? res.message : '操作失败');
      }
    } catch (e) {
      showToast('操作失败，请检查网络');
    } finally {
      hideLoading();
    }
  }
});
