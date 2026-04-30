const { getLlmModelList, addLlmModel, deleteLlmModel } = require('../../api/productLlmModel');
const { getLlmProviderList } = require('../../api/llmProviderInformation');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    providers: [],
    providerNames: [],
    loading: false,
    showModal: false,
    form: { modelName: '', providerId: '', toolsId: '', productId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - LLM模型' });
    this.loadProviders();
    this.loadList();
  },

  async loadProviders() {
    try {
      const res = await getLlmProviderList();
      if (res && res.errorCode === 200) {
        const providers = Array.isArray(res.data) ? res.data : [];
        this.setData({
          providers,
          providerNames: providers.map(p => (p.providerName || '') + (p.userName ? ` (${p.userName})` : '') || String(p.id))
        });
      }
    } catch (e) {}
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getLlmModelList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    const { providers } = this.data;
    this.setData({
      showModal: true,
      form: { modelName: '', providerId: providers.length ? providers[0].id : '', toolsId: '', productId: this.data.productId }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onProviderChange(e) {
    const p = this.data.providers[e.detail.value];
    if (p) this.setData({ 'form.providerId': p.id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.modelName) { showToast('请输入模型名称'); return; }
    if (!form.providerId) { showToast('请选择供应商'); return; }
    showLoading();
    try {
      const res = await addLlmModel(form);
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
    const ok = await showConfirm('确定删除该模型配置吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteLlmModel(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  getProviderName(providerId) {
    const p = this.data.providers.find(p => String(p.id) === String(providerId));
    return p ? (p.providerName || String(p.id)) : String(providerId);
  }
});
