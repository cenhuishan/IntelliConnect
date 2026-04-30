const { getRoleList, addRole, updateRole, deleteRole } = require('../../api/productRole');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const VOICE_OPTIONS = [
  'alloy','echo','fable','onyx','nova','shimmer',
  'zh-CN-XiaoxiaoNeural','zh-CN-YunxiNeural','zh-CN-YunjianNeural',
  'zh-CN-XiaoyiNeural'
];

Page({
  data: {
    productId: '',
    list: [],
    loading: false,
    showModal: false,
    editId: null,
    voiceOptions: VOICE_OPTIONS,
    form: {
      productId: '',
      assistantName: '',
      userName: '',
      role: '',
      roleIntroduction: '',
      voice: ''
    }
  },

  onLoad(options) {
    const productId = options.productId || '';
    this.setData({ productId });
    wx.setNavigationBarTitle({ title: decodeURIComponent(options.productName || '') + ' - 角色配置' });
    this.loadList();
  },

  onShow() { this.loadList(); },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getRoleList();
      if (res && res.errorCode === 200) {
        const all = Array.isArray(res.data) ? res.data : [];
        const filtered = this.data.productId
          ? all.filter(i => String(i.productId) === String(this.data.productId))
          : all;
        this.setData({ list: filtered });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({
      showModal: true,
      editId: null,
      form: { productId: this.data.productId, assistantName: '', userName: '', role: '', roleIntroduction: '', voice: '' }
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      editId: item.id,
      form: {
        productId: item.productId,
        assistantName: item.assistantName || '',
        userName: item.userName || '',
        role: item.role || '',
        roleIntroduction: item.roleIntroduction || '',
        voice: item.voice || ''
      }
    });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onVoiceChange(e) {
    this.setData({ 'form.voice': VOICE_OPTIONS[e.detail.value] });
  },

  async onSubmit() {
    const { form, editId } = this.data;
    if (!form.assistantName) { showToast('请输入助手名称'); return; }
    if (!form.role) { showToast('请输入角色名称'); return; }
    showLoading();
    try {
      const res = editId
        ? await updateRole({ ...form, id: editId })
        : await addRole(form);
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
    const ok = await showConfirm('确定删除该角色吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteRole(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
