const { getProductList } = require('../../api/product');
const { getDeviceList } = require('../../api/device');
const { readData } = require('../../api/deviceData');
const { showToast, showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    products: [],
    devices: [],
    selectedProductId: '',
    selectedDeviceName: '',
    deviceData: [],
    loading: false,
    querying: false
  },

  onShow() {
    this.loadProducts();
  },

  async loadProducts() {
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200) {
        this.setData({ products: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) {}
  },

  async onProductChange(e) {
    const idx = e.detail.value;
    const product = this.data.products[idx];
    this.setData({ selectedProductId: product.id, selectedDeviceName: '', devices: [], deviceData: [] });
    try {
      const res = await getDeviceList({ productId: product.id });
      if (res && res.errorCode === 200) {
        this.setData({ devices: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) {}
  },

  onDeviceChange(e) {
    const idx = e.detail.value;
    const device = this.data.devices[idx];
    this.setData({ selectedDeviceName: device.deviceName, deviceData: [] });
  },

  async onQuery() {
    const { selectedProductId, selectedDeviceName } = this.data;
    if (!selectedProductId || !selectedDeviceName) { showToast('请先选择产品和设备'); return; }
    this.setData({ querying: true });
    showLoading('查询中...');
    try {
      const res = await readData({ productId: selectedProductId, deviceName: selectedDeviceName });
      if (res && res.errorCode === 200) {
        const data = res.data || {};
        const items = Object.keys(data).map(k => ({ key: k, value: JSON.stringify(data[k]) }));
        this.setData({ deviceData: items });
      } else {
        showToast('查询失败');
      }
    } catch (e) {
      showToast('查询失败');
    } finally {
      hideLoading();
      this.setData({ querying: false });
    }
  }
});
