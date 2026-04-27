const { getOtaList, deleteOta, uploadOta } = require('../../api/productOta');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false
  },

  onLoad(options) {
    this.setData({ productId: options.productId || '' });
    this.loadList();
  },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getOtaList({ productId: this.data.productId });
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
        uploadOta(file.path, { productId: this.data.productId })
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
    const ok = await showConfirm('确定删除该固件吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteOta(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
