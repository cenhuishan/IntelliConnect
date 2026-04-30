const { getDataList, addData, deleteData } = require('../../api/productData');
const { getModelList } = require('../../api/productModel');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const TYPE_OPTIONS = ['int', 'float', 'string', 'bool'];
const STORAGE_OPTIONS = ['timeStorage', 'localCache'];
const RRW_OPTIONS = ['r', 'w', 'rw'];

Page({
  data: {
    productId: '',
    list: [],
    models: [],
    modelNames: [],
    loading: false,
    showModal: false,
    typeOptions: TYPE_OPTIONS,
    storageOptions: STORAGE_OPTIONS,
    rrwOptions: RRW_OPTIONS,
    form: { jsonKey: '', description: '', modelId: '', type: 'int', storageType: 'timeStorage', rRw: 'rw', max: '', min: '', step: '', unit: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 属性' });
    this.loadModels(productId);
    this.loadList();
  },

  async loadModels(productId) {
    try {
      const res = await getModelList({ productId });
      if (res && res.errorCode === 200) {
        const models = Array.isArray(res.data) ? res.data : [];
        this.setData({ models, modelNames: models.map(m => m.name || m.id) });
      }
    } catch (e) {}
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getDataList();
      if (res && res.errorCode === 200) {
        const all = Array.isArray(res.data) ? res.data : [];
        const modelIds = (this.data.models || []).map(m => String(m.id));
        const filtered = modelIds.length
          ? all.filter(i => modelIds.includes(String(i.modelId)))
          : all;
        this.setData({ list: filtered });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    const { models } = this.data;
    this.setData({
      showModal: true,
      form: {
        jsonKey: '',
        description: '',
        modelId: models.length ? models[0].id : '',
        type: 'int',
        storageType: 'timeStorage',
        rRw: 'rw',
        max: '',
        min: '',
        step: '',
        unit: ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onTypeChange(e) { this.setData({ 'form.type': TYPE_OPTIONS[e.detail.value] }); },
  onStorageChange(e) { this.setData({ 'form.storageType': STORAGE_OPTIONS[e.detail.value] }); },
  onRrwChange(e) { this.setData({ 'form.rRw': RRW_OPTIONS[e.detail.value] }); },
  onModelChange(e) {
    const idx = e.detail.value;
    this.setData({ 'form.modelId': this.data.models[idx].id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.jsonKey) { showToast('请输入 JSON Key'); return; }
    if (!form.modelId) { showToast('请选择物模型'); return; }
    showLoading();
    try {
      const res = await addData(form);
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
    const ok = await showConfirm('确定删除该属性吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteData(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
