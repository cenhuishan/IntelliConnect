const { getProviderList, addProvider, deleteProvider } = require('../../api/llmProviderInformation');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

const TYPE_OPTIONS = ['openai', 'anthropic', 'dashscope', 'zhipuai', 'custom'];

Page({
  data: {
    list: [],
    loading: false,
    showModal: false,
    typeOptions: TYPE_OPTIONS,
    form: { providerName: '', baseUrl: '', appKey: '', type: 'openai', userName: '' }
  },

  onShow() { this.loadList(); },

  async loadList() {
    this.setData({ loading: true });
    try {
      const res = await getProviderList();
      if (res && res.errorCode === 200) {
        this.setData({ list: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  onAdd() {
    this.setData({ showModal: true, form: { providerName: '', baseUrl: '', appKey: '', type: 'openai', userName: '' } });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onTypeChange(e) { this.setData({ 'form.type': TYPE_OPTIONS[e.detail.value] }); },

  async onSubmit() {
    const { form } = this.data;
    if (!form.providerName || !form.appKey) { showToast('请填写供应商名称和API Key'); return; }
    showLoading();
    try {
      const res = await addProvider(form);
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
    const ok = await showConfirm('确定删除该供应商配置吗？');
    if (!ok) return;
    showLoading();
    try {
      const res = await deleteProvider(id);
      if (res && res.errorCode === 200) { showToast('删除成功'); this.loadList(); }
      else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
