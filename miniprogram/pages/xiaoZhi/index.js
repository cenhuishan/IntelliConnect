const { getXiaozhiList, addXiaozhi, updateXiaozhi, deleteXiaozhi } = require('../../api/xiaoZhi');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    list: [],
    loading: false,
    showModal: false,
    editId: null,
    form: { macAddress: '', version: '' }
  },

  onShow() { this.loadList(); },

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
    this.setData({ showModal: true, editId: null, form: { macAddress: '', version: '' } });
  },
  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ showModal: true, editId: item.id, form: { macAddress: item.macAddress, version: item.version } });
  },
  onCloseModal() { this.setData({ showModal: false }); },
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form, editId } = this.data;
    if (!form.macAddress) { showToast('请输入MAC地址'); return; }
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
    const ok = await showConfirm('确定删除？');
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
