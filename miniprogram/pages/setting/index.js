const { clearToken, getBaseUrl, setBaseUrl } = require('../../utils/storage');
const { getUserConfig, updateUserConfig } = require('../../api/user');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    baseUrl: '',
    editingUrl: false,
    newUrl: '',
    userConfig: null,
    menus: [
      { title: '小智设备', icon: '🤖', page: 'xiaoZhi' },
      { title: '知识图谱', icon: '🕸️', page: 'knowledgeGraphic' },
      { title: '定时任务', icon: '⏰', page: 'timeSchedule' },
      { title: 'LLM供应商', icon: '🧪', page: 'llmProviderInformation' },
      { title: '关于', icon: 'ℹ️', page: 'about' }
    ]
  },

  onShow() {
    this.setData({ baseUrl: getBaseUrl() });
  },

  onEditUrl() {
    this.setData({ editingUrl: true, newUrl: this.data.baseUrl });
  },

  onUrlInput(e) {
    this.setData({ newUrl: e.detail.value });
  },

  onSaveUrl() {
    const { newUrl } = this.data;
    if (!newUrl) { showToast('请输入服务器地址'); return; }
    setBaseUrl(newUrl.trim());
    this.setData({ baseUrl: newUrl.trim(), editingUrl: false });
    showToast('保存成功');
  },

  onCancelEdit() {
    this.setData({ editingUrl: false });
  },

  onMenuTap(e) {
    const { page } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/${page}/index` });
  },

  async onLogout() {
    const ok = await showConfirm('确定退出登录吗？');
    if (!ok) return;
    clearToken();
    wx.reLaunch({ url: '/pages/login/index' });
  }
});
