const { getEventList, addEvent, deleteEvent } = require('../../api/productEvent');
const { getModelList } = require('../../api/productModel');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    models: [],
    modelNames: [],
    loading: false,
    showModal: false,
    form: { name: '', description: '', modelId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 事件' });
    this.loadModels(productId);
    this.loadList();
  },

  async loadModels(productId) {
    try {
      const res = await getModelList({ productId });
      if (res && res.errorCode === 200) {
        const models = Array.isArray(res.data) ? res.data : [];
        this.setData({ models, modelNames: models.map(m => m.name || String(m.id)) });
      }
    } catch (e) {}
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getEventList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    const { models } = this.data;
    this.setData({
      showModal: true,
      form: { name: '', description: '', modelId: models.length ? models[0].id : '' }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onModelChange(e) {
    this.setData({ 'form.modelId': this.data.models[e.detail.value].id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.name) { showToast('请输入事件名称'); return; }
    showLoading();
    try {
      const res = await addEvent(form);
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
    const ok = await showConfirm('确定删除该事件吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteEvent(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  onEventTap(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/productEventData/index?eventId=${id}&eventName=${encodeURIComponent(name)}` });
  }
});
