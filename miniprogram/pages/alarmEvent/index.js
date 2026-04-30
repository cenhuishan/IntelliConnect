const { getAlarmEventList, addAlarmEvent, deleteAlarmEvent } = require('../../api/alarmEvent');
const { getEventList } = require('../../api/productEvent');
const { getModelList } = require('../../api/productModel');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    events: [],
    eventNames: [],
    models: [],
    modelNames: [],
    loading: false,
    showModal: false,
    form: { description: '', name: '', modelId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 报警事件' });
    this.loadEvents(productId);
    this.loadModels(productId);
    this.loadList();
  },

  async loadEvents(productId) {
    try {
      const res = await getEventList({ productId });
      if (res && res.errorCode === 200) {
        const events = Array.isArray(res.data) ? res.data : [];
        this.setData({ events, eventNames: events.map(e => e.name || String(e.id)) });
      }
    } catch (e) {}
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
      const res = await getAlarmEventList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    const { events, models } = this.data;
    this.setData({
      showModal: true,
      form: {
        description: '',
        name: events.length ? events[0].name : '',
        modelId: models.length ? models[0].id : ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onEventChange(e) {
    const ev = this.data.events[e.detail.value];
    if (ev) this.setData({ 'form.name': ev.name });
  },

  onModelChange(e) {
    const m = this.data.models[e.detail.value];
    if (m) this.setData({ 'form.modelId': m.id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.name) { showToast('请选择或输入事件名'); return; }
    showLoading();
    try {
      const res = await addAlarmEvent(form);
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
    const ok = await showConfirm('确定删除该报警事件吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteAlarmEvent(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
