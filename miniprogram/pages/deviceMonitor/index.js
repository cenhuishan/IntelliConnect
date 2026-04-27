const { getProductList } = require('../../api/product');
const { getDeviceList } = require('../../api/device');
const { getDataList } = require('../../api/productData');
const { getModelList } = require('../../api/productModel');
const { readData } = require('../../api/deviceData');
const { showToast, showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    products: [],
    productNames: [],
    devices: [],
    deviceNames: [],
    dataKeys: [],
    selectedProductIdx: -1,
    selectedDeviceIdx: -1,
    selectedKeyIdx: -1,
    selectedProductId: '',
    selectedDeviceName: '',
    selectedJsonKey: '',
    deviceData: [],
    loading: false
  },

  onShow() {
    this.loadProducts();
  },

  async loadProducts() {
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200) {
        const products = Array.isArray(res.data) ? res.data : [];
        this.setData({
          products,
          productNames: products.map(p => p.productName || String(p.id))
        });
      }
    } catch (e) {}
  },

  async onProductChange(e) {
    const idx = parseInt(e.detail.value);
    const product = this.data.products[idx];
    if (!product) return;
    this.setData({
      selectedProductIdx: idx,
      selectedProductId: product.id,
      selectedDeviceIdx: -1,
      selectedDeviceName: '',
      selectedKeyIdx: -1,
      selectedJsonKey: '',
      devices: [],
      deviceNames: [],
      dataKeys: [],
      deviceData: []
    });
    showLoading('加载中...');
    try {
      const [devRes, modelRes] = await Promise.all([
        getDeviceList({ productId: product.id }),
        getModelList({ productId: product.id })
      ]);
      const devices = (devRes && devRes.errorCode === 200 && Array.isArray(devRes.data)) ? devRes.data : [];
      const models = (modelRes && modelRes.errorCode === 200 && Array.isArray(modelRes.data)) ? modelRes.data : [];

      // Load data keys from product models
      let dataKeys = [];
      if (models.length) {
        const dataRes = await getDataList();
        if (dataRes && dataRes.errorCode === 200 && Array.isArray(dataRes.data)) {
          const modelIds = models.map(m => String(m.id));
          dataKeys = dataRes.data
            .filter(d => modelIds.includes(String(d.modelId)))
            .map(d => d.jsonKey);
        }
      }

      this.setData({
        devices,
        deviceNames: devices.map(d => d.name || String(d.id)),
        dataKeys
      });
    } catch (e) { showToast('加载失败'); }
    finally { hideLoading(); }
  },

  onDeviceChange(e) {
    const idx = parseInt(e.detail.value);
    const device = this.data.devices[idx];
    this.setData({
      selectedDeviceIdx: idx,
      selectedDeviceName: device ? (device.name || '') : '',
      deviceData: []
    });
  },

  onKeyChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({
      selectedKeyIdx: idx,
      selectedJsonKey: this.data.dataKeys[idx] || ''
    });
  },

  async onQuery() {
    const { selectedDeviceName, selectedJsonKey } = this.data;
    if (!selectedDeviceName) { showToast('请先选择设备'); return; }
    if (!selectedJsonKey) { showToast('请先选择属性'); return; }
    this.setData({ loading: true });
    showLoading('查询中...');
    try {
      const res = await readData({ deviceName: selectedDeviceName, jsonKey: selectedJsonKey });
      if (res && res.errorCode === 200) {
        const raw = res.data;
        let items = [];
        if (Array.isArray(raw)) {
          items = raw.map((v, i) => ({ key: String(i), value: typeof v === 'object' ? JSON.stringify(v) : String(v) }));
        } else if (raw && typeof raw === 'object') {
          items = Object.keys(raw).map(k => ({ key: k, value: typeof raw[k] === 'object' ? JSON.stringify(raw[k]) : String(raw[k]) }));
        }
        this.setData({ deviceData: items });
        if (!items.length) showToast('暂无数据');
      } else {
        showToast('查询失败');
      }
    } catch (e) {
      showToast('查询失败');
    } finally {
      hideLoading();
      this.setData({ loading: false });
    }
  }
});
