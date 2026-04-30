const { getPassiveList, addPassive, deletePassive } = require('../../api/productOtaPassive');
const { getOtaList } = require('../../api/productOta');
const { getDeviceList } = require('../../api/device');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    otas: [],
    otaNames: [],
    devices: [],
    deviceNames: [],
    loading: false,
    showModal: false,
    form: { otaId: '', deviceId: '', versionName: '', description: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 被动OTA' });
    this.loadOtas(productId);
    this.loadDevices(productId);
    this.loadList();
  },

  async loadOtas(productId) {
    try {
      const res = await getOtaList({ productId });
      if (res && res.errorCode === 200) {
        const otas = Array.isArray(res.data) ? res.data : [];
        this.setData({ otas, otaNames: otas.map(o => o.name || String(o.id)) });
      }
    } catch (e) {}
  },

  async loadDevices(productId) {
    try {
      const res = await getDeviceList({ productId });
      if (res && res.errorCode === 200) {
        const devices = Array.isArray(res.data) ? res.data : [];
        this.setData({ devices, deviceNames: devices.map(d => d.name || String(d.id)) });
      }
    } catch (e) {}
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getPassiveList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    const { otas, devices } = this.data;
    this.setData({
      showModal: true,
      form: {
        otaId: otas.length ? otas[0].id : '',
        deviceId: devices.length ? devices[0].id : '',
        versionName: '',
        description: ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onOtaChange(e) {
    const o = this.data.otas[e.detail.value];
    if (o) this.setData({ 'form.otaId': o.id });
  },

  onDeviceChange(e) {
    const d = this.data.devices[e.detail.value];
    if (d) this.setData({ 'form.deviceId': d.id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.otaId) { showToast('请选择固件'); return; }
    if (!form.deviceId) { showToast('请选择设备'); return; }
    if (!form.versionName) { showToast('请输入版本名称'); return; }
    showLoading();
    try {
      const res = await addPassive(form);
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
      const res = await deletePassive(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
