const { getXiaozhiPassiveList, addXiaozhiPassive, deleteXiaozhiPassive } = require('../../api/productOtaXiaozhiPassive');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showModal: false,
    form: { macAddress: '', version: '', productId: '' }
  },

  onLoad(options) {
    this.setData({ productId: options.productId || '' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getXiaozhiPassiveList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({ showModal: true, form: { macAddress: '', version: '', productId: this.data.productId } });
  },
  onCloseModal() { this.setData({ showModal: false }); },
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.macAddress || !form.version) { showToast('请填写完整信息'); return; }
    showLoading();
    try {
      const res = await addXiaozhiPassive(form);
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
      const res = await deleteXiaozhiPassive(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
