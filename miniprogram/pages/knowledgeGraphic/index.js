const { getGraphicList, addGraphic, deleteGraphic, getNodeList, addNode, deleteNode, getAttrList, addAttr, deleteAttr } = require('../../api/knowledgeGraphic');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    activeTab: 0,
    tabs: ['图谱', '节点', '属性'],
    graphicList: [],
    nodeList: [],
    attrList: [],
    loading: false,
    showModal: false,
    modalType: '',
    selectedGraphicId: '',
    selectedNodeId: '',
    form: {}
  },

  onShow() { this.loadGraphicList(); },

  async loadGraphicList() {
    this.setData({ loading: true });
    try {
      const res = await getGraphicList();
      if (res && res.errorCode === 200) {
        this.setData({ graphicList: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  async loadNodeList() {
    if (!this.data.selectedGraphicId) return;
    try {
      const res = await getNodeList({ graphicId: this.data.selectedGraphicId });
      if (res && res.errorCode === 200) {
        this.setData({ nodeList: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) {}
  },

  async loadAttrList() {
    if (!this.data.selectedNodeId) return;
    try {
      const res = await getAttrList({ nodeId: this.data.selectedNodeId });
      if (res && res.errorCode === 200) {
        this.setData({ attrList: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) {}
  },

  onTabChange(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ activeTab: idx });
  },

  onSelectGraphic(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedGraphicId: id, activeTab: 1 });
    this.loadNodeList();
  },

  onSelectNode(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedNodeId: id, activeTab: 2 });
    this.loadAttrList();
  },

  onAdd() {
    const { activeTab } = this.data;
    const types = ['graphic', 'node', 'attr'];
    this.setData({ showModal: true, modalType: types[activeTab], form: {} });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form, modalType, selectedGraphicId, selectedNodeId } = this.data;
    showLoading();
    try {
      let res;
      if (modalType === 'graphic') {
        if (!form.graphicName) { showToast('请输入图谱名称'); hideLoading(); return; }
        res = await addGraphic(form);
      } else if (modalType === 'node') {
        if (!form.nodeName || !selectedGraphicId) { showToast('请选择图谱并输入节点名称'); hideLoading(); return; }
        res = await addNode({ ...form, graphicId: selectedGraphicId });
      } else {
        if (!form.attrKey || !selectedNodeId) { showToast('请选择节点并输入属性Key'); hideLoading(); return; }
        res = await addAttr({ ...form, nodeId: selectedNodeId });
      }
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ showModal: false });
        if (modalType === 'graphic') this.loadGraphicList();
        else if (modalType === 'node') this.loadNodeList();
        else this.loadAttrList();
      } else { showToast(res && res.message ? res.message : '添加失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onDelete(e) {
    const { id, type } = e.currentTarget.dataset;
    const ok = await showConfirm('确定删除？');
    if (!ok) return;
    showLoading();
    try {
      let res;
      if (type === 'graphic') res = await deleteGraphic(id);
      else if (type === 'node') res = await deleteNode(id);
      else res = await deleteAttr(id);
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        if (type === 'graphic') this.loadGraphicList();
        else if (type === 'node') this.loadNodeList();
        else this.loadAttrList();
      } else { showToast('删除失败'); }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  }
});
