const { getXiaozhiList, addXiaozhi, updateXiaozhi, deleteXiaozhi } = require('../../api/xiaoZhi');
const { getProductList } = require('../../api/product');
const { getDeviceList } = require('../../api/device');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const STATUS_OPTIONS = ['active', 'inactive', 'disabled'];
const BOARD_TYPES = ['esp32', 'esp32s3', 'esp32c3'];

Page({
  data: {
    list: [],
    products: [],
    productNames: [],
    devices: [],
    deviceNames: [],
    loading: false,
    showModal: false,
    editId: null,
    statusOptions: STATUS_OPTIONS,
    boardTypes: BOARD_TYPES,
    form: { productId: '', deviceId: '', nickName: '', boardType: 'esp32', boardName: '', userName: '', status: 'active' }
  },

  onShow() {
    this.loadProducts();
    this.loadList();
  },

  async loadProducts() {
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200) {
        const products = Array.isArray(res.data) ? res.data : [];
        this.setData({ products, productNames: products.map(p => p.productName || String(p.id)) });
      }
    } catch (e) {}
  },

  async onProductChange(e) {
    const idx = e.detail.value;
    const p = this.data.products[idx];
    if (!p) return;
    this.setData({ 'form.productId': p.id, devices: [], deviceNames: [] });
    try {
      const res = await getDeviceList({ productId: p.id });
      if (res && res.errorCode === 200) {
        const devices = Array.isArray(res.data) ? res.data : [];
        this.setData({ devices, deviceNames: devices.map(d => d.name || String(d.id)) });
      }
    } catch (e) {}
  },

  onDeviceChange(e) {
    const d = this.data.devices[e.detail.value];
    if (d) this.setData({ 'form.deviceId': d.id });
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getXiaozhiList();
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({
      showModal: true,
      editId: null,
      form: { productId: '', deviceId: '', nickName: '', boardType: 'esp32', boardName: '', userName: '', status: 'active' }
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      editId: item.id,
      form: {
        productId: item.productId || '',
        deviceId: item.deviceId || '',
        nickName: item.nickName || '',
        boardType: item.boardType || 'esp32',
        boardName: item.boardName || '',
        userName: item.userName || '',
        status: item.status || 'active'
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onBoardTypeChange(e) { this.setData({ 'form.boardType': BOARD_TYPES[e.detail.value] }); },
  onStatusChange(e) { this.setData({ 'form.status': STATUS_OPTIONS[e.detail.value] }); },

  async onSubmit() {
    const { form, editId } = this.data;
    if (!form.nickName) { showToast('请输入设备昵称'); return; }
    showLoading();
    try {
      const res = editId ? await updateXiaozhi({ ...form, id: editId }) : await addXiaozhi(form);
      if (res && res.errorCode === 200) {
        showToast(editId ? '更新成功' : '添加成功');
        this.setData({ showModal: false });
        this.loadList();
      } else { showToast(res && res.message ? res.message : '操作失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const ok = await showConfirm('确定删除该小智设备吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteXiaozhi(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
