const { getKnowledgeList, deleteKnowledge, uploadKnowledge, recallKnowledge } = require('../../api/productKnowledge');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showRecallModal: false,
    recallContent: '',
    recallResult: ''
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 知识库' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getKnowledgeList({ productId: this.data.productId });
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onUpload() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        showLoading('上传中...');
        uploadKnowledge(file.path, { productId: this.data.productId })
          .then(data => {
            if (data && data.errorCode === 200) {
              showToast('上传成功');
              this.loadList();
            } else {
              showToast(data && data.message ? data.message : '上传失败');
            }
          })
          .catch(() => showToast('上传失败'))
          .finally(() => hideLoading());
      }
    });
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const ok = await showConfirm('确定删除该知识文件吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteKnowledge(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  onShowRecall() {
    this.setData({ showRecallModal: true, recallContent: '', recallResult: '' });
  },

  onCloseRecall() { this.setData({ showRecallModal: false }); },

  onRecallInput(e) { this.setData({ recallContent: e.detail.value }); },

  async onRecall() {
    const { recallContent, productId } = this.data;
    if (!recallContent) { showToast('请输入查询内容'); return; }
    showLoading('召回中...');
    try {
      const res = await recallKnowledge({ content: recallContent, productId });
      if (res && res.errorCode === 200) {
        const result = typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2);
        this.setData({ recallResult: result });
      } else {
        showToast('召回失败');
      }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
