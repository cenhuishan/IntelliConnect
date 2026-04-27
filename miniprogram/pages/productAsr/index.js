const { getAsrList, addAsr, updateAsr, deleteAsr } = require('../../api/productAsr');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const ASR_OPTIONS = ['dashscope', 'funasr', 'xunfei'];
const PROVIDER_OPTIONS = ['dashscope', 'funasr', 'xunfei', 'minimax', 'edge'];

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showModal: false,
    editId: null,
    asrOptions: ASR_OPTIONS,
    providerOptions: PROVIDER_OPTIONS,
    form: { asrName: 'dashscope', providerName: 'dashscope', productId: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - ASR配置' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getAsrList({ productId: this.data.productId });
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
      form: { asrName: 'dashscope', providerName: 'dashscope', productId: this.data.productId }
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      editId: item.id,
      form: { asrName: item.asrName || 'dashscope', providerName: item.providerName || 'dashscope', productId: this.data.productId }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onAsrChange(e) { this.setData({ 'form.asrName': ASR_OPTIONS[e.detail.value] }); },
  onProviderChange(e) { this.setData({ 'form.providerName': PROVIDER_OPTIONS[e.detail.value] }); },

  async onSubmit() {
    const { form, editId } = this.data;
    showLoading();
    try {
      const res = editId ? await updateAsr({ ...form, id: editId }) : await addAsr(form);
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
    const ok = await showConfirm('确定删除该ASR配置吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteAsr(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
