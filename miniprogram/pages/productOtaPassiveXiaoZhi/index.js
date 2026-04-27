const { getXiaozhiPassiveList, addXiaozhiPassive, deleteXiaozhiPassive } = require('../../api/productOtaXiaozhiPassive');
const { getOtaList } = require('../../api/productOta');
const { getXiaozhiList } = require('../../api/xiaoZhi');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    productId: '',
    list: [],
    otas: [],
    otaNames: [],
    xiaozhi: [],
    xiaozhiNames: [],
    loading: false,
    showModal: false,
    form: { otaId: '', xiaozhiId: '', versionName: '', description: '' }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 小智OTA' });
    this.loadOtas(productId);
    this.loadXiaozhi();
    this.loadList();
  },

  async loadOtas(productId) {
    try {
      const res = await getOtaList({ productId });
      if (res && res.errorCode === 200) {
        const otas = Array.isArray(res.data) ? res.data : [];
        this.setData({ otas, otaNames: otas.map(o => o.name || String(o.id)) });
      }
    } catch (e) {}
  },

  async loadXiaozhi() {
    try {
      const res = await getXiaozhiList();
      if (res && res.errorCode === 200) {
        const list = Array.isArray(res.data) ? res.data : [];
        this.setData({ xiaozhi: list, xiaozhiNames: list.map(x => x.nickName || x.boardName || String(x.id)) });
      }
    } catch (e) {}
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
    const { otas, xiaozhi } = this.data;
    this.setData({
      showModal: true,
      form: {
        otaId: otas.length ? otas[0].id : '',
        xiaozhiId: xiaozhi.length ? xiaozhi[0].id : '',
        versionName: '',
        description: ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onOtaChange(e) {
    const o = this.data.otas[e.detail.value];
    if (o) this.setData({ 'form.otaId': o.id });
  },

  onXiaozhiChange(e) {
    const x = this.data.xiaozhi[e.detail.value];
    if (x) this.setData({ 'form.xiaozhiId': x.id });
  },

  async onSubmit() {
    const { form } = this.data;
    if (!form.otaId) { showToast('请选择固件'); return; }
    if (!form.versionName) { showToast('请输入版本名称'); return; }
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
