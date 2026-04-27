const { getOtaList, deleteOta, uploadOta } = require('../../api/productOta');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showNameModal: false,
    pendingFilePath: '',
    uploadName: ''
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - OTA升级' });
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
        // Ask for firmware name before uploading
        this.setData({ pendingFilePath: file.path, showNameModal: true, uploadName: file.name || '' });
      },
      fail: () => {
        // Try media file fallback
        wx.chooseMedia({
          count: 1,
          success: (res2) => {
            const file = res2.tempFiles[0];
            this.setData({ pendingFilePath: file.tempFilePath, showNameModal: true, uploadName: '' });
          }
        });
      }
    });
  },

  onNameInput(e) { this.setData({ uploadName: e.detail.value }); },

  onCancelUpload() { this.setData({ showNameModal: false, pendingFilePath: '', uploadName: '' }); },

  async onConfirmUpload() {
    const { pendingFilePath, uploadName, productId } = this.data;
    if (!uploadName) { showToast('请输入固件名称'); return; }
    this.setData({ showNameModal: false });
    showLoading('上传中...');
    try {
      const data = await uploadOta(pendingFilePath, { name: uploadName, productId });
      if (data && data.errorCode === 200) {
        showToast('上传成功');
        this.loadList();
      } else {
        showToast(data && data.message ? data.message : '上传失败');
      }
    } catch (e) { showToast('上传失败'); }
    finally {
      hideLoading();
      this.setData({ pendingFilePath: '', uploadName: '' });
    }
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
