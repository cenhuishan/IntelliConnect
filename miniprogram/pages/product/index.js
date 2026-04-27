const { getProductList, addProduct, deleteProduct } = require('../../api/product');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    list: [],
    loading: false,
    showModal: false,
    form: { productName: '', keyvalue: '', register: '0' }
  },

  onShow() { this.loadList(); },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() { this.setData({ showModal: true, form: { productName: '', keyvalue: '', register: '0' } }); },
  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onRegisterChange(e) {
    this.setData({ 'form.register': e.detail.value === 0 ? '0' : '1' });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.productName) { showToast('请输入产品名称'); return; }
    showLoading();
    try {
      const res = await addProduct(form);
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
    const confirm = await showConfirm('确定删除该产品吗？');
    if (!confirm) return;
    showLoading();
    try {
      const res = await deleteProduct(id);
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        this.loadList();
      } else {
        showToast('删除失败');
      }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  onProductTap(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/productDevice/index?productId=${id}&productName=${encodeURIComponent(name)}` });
  },

  onManage(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/productModel/index?productId=${id}&productName=${encodeURIComponent(name)}` });
  }
});
