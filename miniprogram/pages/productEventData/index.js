const { getEventDataList, addEventData, deleteEventData } = require('../../api/productEventData');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    eventId: '',
    list: [],
    loading: false,
    showModal: false,
    form: { jsonKey: '', dataName: '', dataType: 'int', eventId: '' }
  },

  onLoad(options) {
    const name = decodeURIComponent(options.eventName || '');
    this.setData({ eventId: options.eventId || '' });
    wx.setNavigationBarTitle({ title: name + ' - 数据' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getEventDataList({ eventId: this.data.eventId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({ showModal: true, form: { jsonKey: '', dataName: '', dataType: 'int', eventId: this.data.eventId } });
  },
  onCloseModal() { this.setData({ showModal: false }); },
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },
  onTypeChange(e) {
    const types = ['int', 'float', 'string', 'bool'];
    this.setData({ 'form.dataType': types[e.detail.value] });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.jsonKey || !form.dataName) { showToast('请填写完整信息'); return; }
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
