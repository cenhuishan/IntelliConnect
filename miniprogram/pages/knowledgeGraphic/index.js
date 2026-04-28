const {
  queryKnowledgeGraphic, addGraphic, deleteGraphic,
  getNodeList, addNode, deleteNode,
  getAttrList, addAttr, deleteAttr,
  getKnowledgeGraphicState, addKnowledgeGraphicToggleConfig,
  enableKnowledgeGraphic, disabledKnowledgeGraphic,
  getKnowledgeGraphicForgetState, addKnowledgeGraphicForgetToggleConfig,
  knowledgeGraphicForgetToggle,
  getKnowledgeGraphicForgetEpoch, updateKnowledgeGraphicForgetEpoch,
} = require('../../api/knowledgeGraphic');
const { getProductList } = require('../../api/product');
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util');

Page({
  data: {
    // product
    products: [],
    productNames: [],
    currentProductIndex: 0,
    currentProductId: null,
    productLoading: false,
    // toggle states
    knowledgeGraphicEnable: false,
    knowledgeGraphForgetEnable: false,
    knowledgeGraphForgetEpoch: 10,
    // tabs / lists
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

  onShow() { this.loadProducts(); },

  async loadProducts() {
    this.setData({ productLoading: true });
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const products = res.data;
        const productNames = products.map(p => p.productName);
        const currentProductId = products[0].id;
        this.setData({ products, productNames, currentProductIndex: 0, currentProductId });
        this.afterProductSelected();
      }
    } catch (e) { showToast('产品加载失败'); }
    finally { this.setData({ productLoading: false }); }
  },

  onProductChange(e) {
    const idx = Number(e.detail.value);
    const currentProductId = this.data.products[idx].id;
    this.setData({ currentProductIndex: idx, currentProductId, graphicList: [], nodeList: [], attrList: [], selectedGraphicId: '', selectedNodeId: '' });
    this.afterProductSelected();
  },

  afterProductSelected() {
    this.loadGraphicList();
    this.loadKnowledgeGraphicState();
    this.loadKnowledgeGraphForgetState();
    this.loadKnowledgeGraphForgetEpoch();
  },

  async loadGraphicList() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    this.setData({ loading: true });
    try {
      const res = await queryKnowledgeGraphic({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        // The API may return a graph object {nodes, relations} or a list; normalise to array for CRUD display
        const raw = res.data;
        let list = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && Array.isArray(raw.nodes)) {
          // graph format: show as flat node-centric graphic entry
          list = [{ id: currentProductId, graphicName: '当前图谱', nodeCount: raw.nodes.length }];
          this.setData({ graphicList: list, loading: false });
          return;
        }
        this.setData({ graphicList: list });
      }
    } catch (e) { showToast('加载失败'); }
    finally { this.setData({ loading: false }); }
  },

  async loadKnowledgeGraphicState() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    try {
      const res = await getKnowledgeGraphicState({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        if (res.data === null) {
          // config doesn't exist yet — create it (same guard as web)
          await addKnowledgeGraphicToggleConfig({ productId: currentProductId });
          this.loadKnowledgeGraphicState();
        } else {
          this.setData({ knowledgeGraphicEnable: res.data.value === 'true' });
        }
      }
    } catch (e) {}
  },

  async loadKnowledgeGraphForgetState() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    try {
      const res = await getKnowledgeGraphicForgetState({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        if (res.data === null) {
          await addKnowledgeGraphicForgetToggleConfig({ productId: currentProductId });
          this.loadKnowledgeGraphForgetState();
        } else {
          this.setData({ knowledgeGraphForgetEnable: res.data.value === 'true' });
        }
      }
    } catch (e) {}
  },

  async loadKnowledgeGraphForgetEpoch() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    try {
      const res = await getKnowledgeGraphicForgetEpoch({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        if (res.data === null) {
          await updateKnowledgeGraphicForgetEpoch({ productId: currentProductId, value: '10' });
        } else {
          this.setData({ knowledgeGraphForgetEpoch: parseInt(res.data.value) || 10 });
        }
      }
    } catch (e) {}
  },

  async onToggleKnowledgeGraphic() {
    const { currentProductId, knowledgeGraphicEnable } = this.data;
    if (!currentProductId) return;
    showLoading();
    try {
      const fn = knowledgeGraphicEnable ? disabledKnowledgeGraphic : enableKnowledgeGraphic;
      const res = await fn({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        showToast(knowledgeGraphicEnable ? '已关闭知识图谱自动生成' : '已开启知识图谱自动生成');
        await this.loadKnowledgeGraphicState();
      }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  async onToggleForget() {
    const { currentProductId, knowledgeGraphForgetEnable } = this.data;
    if (!currentProductId) return;
    showLoading();
    try {
      const res = await knowledgeGraphicForgetToggle({ productId: currentProductId, value: String(!knowledgeGraphForgetEnable) });
      if (res && res.errorCode === 200) {
        showToast(knowledgeGraphForgetEnable ? '已关闭遗忘功能' : '已开启遗忘功能');
        this.setData({ knowledgeGraphForgetEnable: !knowledgeGraphForgetEnable });
      }
    } catch (e) { showToast('操作失败'); }
    finally { hideLoading(); }
  },

  onEpochInput(e) {
    const val = parseInt(e.detail.value);
    if (!isNaN(val) && val > 0) {
      this.setData({ knowledgeGraphForgetEpoch: val });
    }
  },

  async onEpochBlur() {
    const { currentProductId, knowledgeGraphForgetEpoch } = this.data;
    if (!currentProductId) return;
    try {
      await updateKnowledgeGraphicForgetEpoch({ productId: currentProductId, value: String(knowledgeGraphForgetEpoch) });
    } catch (e) {}
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
    const { activeTab, currentProductId } = this.data;
    if (!currentProductId) { showToast('请先选择产品'); return; }
    const types = ['graphic', 'node', 'attr'];
    this.setData({ showModal: true, modalType: types[activeTab], form: {} });
  },

  onCloseModal() { this.setData({ showModal: false }); },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async onSubmit() {
    const { form, modalType, selectedGraphicId, selectedNodeId, currentProductId } = this.data;
    showLoading();
    try {
      let res;
      if (modalType === 'graphic') {
        if (!form.graphicName) { showToast('请输入图谱名称'); hideLoading(); return; }
        res = await addGraphic({ ...form, productId: currentProductId });
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
