const { getScheduleList, addSchedule, updateSchedule, deleteSchedule } = require('../../api/timeSchedule');
const { getProductList } = require('../../api/product');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    list: [],
    products: [],
    productNames: [],
    loading: false,
    showModal: false,
    editId: null,
    execEnabled: false,
    form: { taskName: '', cron: '', exec: false, execCommand: '', productId: '' }
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

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getScheduleList();
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
      execEnabled: false,
      form: { taskName: '', cron: '', exec: false, execCommand: '', productId: this.data.products.length ? this.data.products[0].id : '' }
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      editId: item.id,
      execEnabled: !!item.exec,
      form: {
        taskName: item.taskName || '',
        cron: item.cron || '',
        exec: !!item.exec,
        execCommand: item.execCommand || '',
        productId: item.productId || ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onExecChange(e) {
    const val = e.detail.value;
    this.setData({ execEnabled: val, 'form.exec': val });
  },

  onProductChange(e) {
    const p = this.data.products[e.detail.value];
    if (p) this.setData({ 'form.productId': p.id });
  },

  async onSubmit() {
    const { form, editId } = this.data;
    if (!form.taskName) { showToast('请输入任务名称'); return; }
    if (!form.cron) { showToast('请输入 Cron 表达式'); return; }
    showLoading();
    try {
      const res = editId
        ? await updateSchedule({ ...form, id: editId })
        : await addSchedule(form);
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
    const ok = await showConfirm('确定删除该定时任务吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteSchedule(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
