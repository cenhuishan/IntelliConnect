const { getFunctionList, addFunction, deleteFunction } = require('../../api/productFunction');
const { getModelList } = require('../../api/productModel');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const TYPE_OPTIONS = ['int', 'float', 'string', 'bool'];

Page({
  data: {
    productId: '',
    list: [],
    models: [],
    modelNames: [],
    loading: false,
    showModal: false,
    typeOptions: TYPE_OPTIONS,
    form: { functionName: '', jsonKey: '', description: '', dataType: 'int', type: 'int', modelId: '', max: '', min: '', step: '', unit: '', productId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 功能' });
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
      const res = await getFunctionList({ productId: this.data.productId });
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
      form: { functionName: '', jsonKey: '', description: '', dataType: 'int', type: 'int', modelId: models.length ? models[0].id : '', max: '', min: '', step: '', unit: '', productId: this.data.productId }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onTypeChange(e) {
    const t = TYPE_OPTIONS[e.detail.value];
    this.setData({ 'form.type': t, 'form.dataType': t });
  },

  onModelChange(e) {
    this.setData({ 'form.modelId': this.data.models[e.detail.value].id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.functionName) { showToast('请输入功能名称'); return; }
    if (!form.jsonKey) { showToast('请输入 JSON Key'); return; }
    showLoading();
    try {
      const res = await addFunction(form);
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
    const ok = await showConfirm('确定删除该功能吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteFunction(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
