const { getLongMemoryList, addLongMemory, deleteLongMemory } = require('../../api/agentLongMemory');
const { getProductList } = require('../../api/product');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    products: [],
    productNames: [],
    loading: false,
    showModal: false,
    form: { content: '', productId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: '长期记忆' });
    this.loadProducts();
    this.loadList();
  },

  onShow() { this.loadList(); },

  async loadProducts() {
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200) {
        const products = Array.isArray(res.data) ? res.data : [];
        this.setData({ products, productNames: products.map(p => p.productName || String(p.id)) });
      }
    } catch (e) {}
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getLongMemoryList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({
      showModal: true,
      form: { content: '', productId: this.data.productId || (this.data.products.length ? this.data.products[0].id : '') }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },
  onFormInput(e) { this.setData({ 'form.content': e.detail.value }); },
  onProductChange(e) {
    const p = this.data.products[e.detail.value];
    if (p) this.setData({ 'form.productId': p.id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.content) { showToast('请输入记忆内容'); return; }
    showLoading();
    try {
      const res = await addLongMemory(form);
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
    const ok = await showConfirm('确定删除该记忆吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteLongMemory(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
