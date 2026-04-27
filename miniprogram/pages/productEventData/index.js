const { getEventDataList, addEventData, deleteEventData } = require('../../api/productEventData');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const TYPE_OPTIONS = ['int', 'float', 'string', 'bool'];

Page({
  data: {
    eventId: '',
    list: [],
    loading: false,
    showModal: false,
    typeOptions: TYPE_OPTIONS,
    form: { jsonKey: '', description: '', type: 'int', modelId: '' }
  },

  onLoad(options) {
    const eventId = options.eventId || '';
    const name = decodeURIComponent(options.eventName || '');
    this.setData({ eventId });
    wx.setNavigationBarTitle({ title: name + ' - 事件数据' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getEventDataList({ modelId: this.data.eventId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({
      showModal: true,
      form: { jsonKey: '', description: '', type: 'int', modelId: this.data.eventId }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onTypeChange(e) {
    this.setData({ 'form.type': TYPE_OPTIONS[e.detail.value] });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.jsonKey) { showToast('请输入 JSON Key'); return; }
    showLoading();
    try {
      const res = await addEventData(form);
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
    const ok = await showConfirm('确定删除？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteEventData(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
