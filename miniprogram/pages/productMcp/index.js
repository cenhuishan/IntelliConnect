const { getMcpList, addMcp, deleteMcp, getMcpEndpoint, getMcpTools } = require('../../api/productMcp');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showModal: false,
    showEndpointModal: false,
    endpointUrl: '',
    tools: [],
    form: { description: '', sseEndpoint: '', url: '', productId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - MCP服务' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getMcpList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  async onShowEndpoint() {
    showLoading();
    try {
      const [epRes, toolsRes] = await Promise.all([
        getMcpEndpoint(this.data.productId),
        getMcpTools(this.data.productId)
      ]);
      const url = (epRes && epRes.errorCode === 200) ? (epRes.data && epRes.data.url ? epRes.data.url : String(epRes.data)) : '暂无';
      const tools = (toolsRes && toolsRes.errorCode === 200 && Array.isArray(toolsRes.data)) ? toolsRes.data : [];
      this.setData({ showEndpointModal: true, endpointUrl: url, tools });
    } catch (e) { showToast('获取失败'); }
    finally { hideLoading(); }
  },

  onCloseEndpoint() { this.setData({ showEndpointModal: false }); },

  onAdd() {
    this.setData({
      showModal: true,
      form: { description: '', sseEndpoint: '', url: '', productId: this.data.productId }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.url && !form.sseEndpoint) { showToast('请输入服务URL或SSE端点'); return; }
    showLoading();
    try {
      const res = await addMcp(form);
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ showModal: false });
        this.loadList();
      } else { showToast(res && res.message ? res.message : '添加失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const ok = await showConfirm('确定删除该MCP服务吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteMcp(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
