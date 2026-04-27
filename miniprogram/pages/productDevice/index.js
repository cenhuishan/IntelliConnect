const { getDeviceList, addDevice, deleteDevice } = require('../../api/device');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    productName: '',
    list: [],
    loading: false,
    showModal: false,
    form: { deviceName: '', productId: '' }
  },

  onLoad(options) {
    const { productId, productName } = options;
    this.setData({ productId, productName: decodeURIComponent(productName || '') });
    wx.setNavigationBarTitle({ title: decodeURIComponent(productName || '') + ' - 设备' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getDeviceList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({ showModal: true, form: { deviceName: '', productId: this.data.productId } });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.deviceName) { showToast('请输入设备名称'); return; }
    showLoading();
    try {
      const res = await addDevice(form);
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ showModal: false });
        this.loadList();
      } else {
        showToast(res && res.message ? res.message : '添加失败');
      }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const confirm = await showConfirm('确定删除该设备吗？');
    if (!confirm) return;
    showLoading();
    try {
      const res = await deleteDevice(id);
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        this.loadList();
      } else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
