const { getMemoryList, updateMemory, deleteMemory } = require('../../api/agentMemory');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showModal: false,
    editItem: null,
    form: { memory: '', productId: '' }
  },

  onLoad(options) {
    this.setData({ productId: options.productId || '' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getMemoryList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ showModal: true, editItem: item, form: { memory: item.memory, productId: this.data.productId } });
  },
  onCloseModal() { this.setData({ showModal: false }); },
  onFormInput(e) {
    this.setData({ 'form.memory': e.detail.value });
  },

  async onSubmit() {
    const { form, editItem } = this.data;
    if (!form.memory) { showToast('请输入记忆内容'); return; }
    showLoading();
    try {
      const res = await updateMemory({ ...form, id: editItem.id });
      if (res && res.errorCode === 200) {
        showToast('更新成功');
        this.setData({ showModal: false });
        this.loadList();
      } else { showToast(res && res.message ? res.message : '操作失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const ok = await showConfirm('确定删除该记忆吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteMemory(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
