const {
  queryKnowledgeGraphic,
  addKnowledgeGraphicNode,
  updateKnowledgeGraphicNode,
  deleteKnowledgeGraphicNode,
  getNodeAttributes,
  addNodeAttribute,
  deleteNodeAttribute,
  getKnowledgeGraphicState,
  addKnowledgeGraphicToggleConfig,
  enableKnowledgeGraphic,
  disabledKnowledgeGraphic,
  getKnowledgeGraphicForgetState,
  addKnowledgeGraphicForgetToggleConfig,
  knowledgeGraphicForgetToggle,
  getKnowledgeGraphicForgetEpoch,
  updateKnowledgeGraphicForgetEpoch,
  addRelation,
  updateRelation,
  deleteRelation,
} = require('../../api/knowledgeGraphic');
const { getToken } = require('../../utils/storage');
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

    // graph data (from queryKnowledgeGraphic)
    nodes: [],       // [{id, name, des, attributes:[]}]
    nodeNames: [],   // string[] - for relation pickers
    relations: [],   // [{id, from (node name), to (node name), des}]
    loading: false,

    // tabs: 0 = 节点, 1 = 关系
    activeTab: 0,

    // inline node detail
    expandedNodeName: null,
    expandedNodeAttrs: [],   // [{id, name, belong, productId}]
    editingNodeName: null,   // original name of node being edited
    editNodeName: '',
    editNodeDes: '',
    addingAttrForNode: null, // node name when the add-attr inline form is open
    newAttrName: '',

    // inline relation detail
    expandedRelationIdx: null,
    editingRelationIdx: null,
    editRelationDes: '',

    // add node modal
    showAddNodeModal: false,
    addNodeName: '',
    addNodeDes: '',

    // add relation modal
    showAddRelationModal: false,
    addRelFromIndex: 0,
    addRelToIndex: 1,
    addRelDes: '',
  },

  onShow() {
    if (!getToken()) return;
    this.loadProducts();
  },

  // ─── Product ─────────────────────────────────────────────────────────────

  async loadProducts() {
    this.setData({ productLoading: true });
    try {
      const res = await getProductList();
      if (res && res.errorCode === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const products = res.data;
        const productNames = products.map(p => p.productName);
        this.setData({
          products,
          productNames,
          currentProductIndex: 0,
          currentProductId: products[0].id,
        });
        this.afterProductSelected();
      } else {
        this.setData({ products: [], productNames: [], currentProductId: null });
      }
    } catch (e) {
      showToast('产品加载失败');
    } finally {
      this.setData({ productLoading: false });
    }
  },

  onProductChange(e) {
    const idx = Number(e.detail.value);
    const currentProductId = this.data.products[idx].id;
    this.setData({
      currentProductIndex: idx,
      currentProductId,
      nodes: [],
      nodeNames: [],
      relations: [],
      expandedNodeName: null,
      expandedRelationIdx: null,
      editingNodeName: null,
      editingRelationIdx: null,
    });
    this.afterProductSelected();
  },

  afterProductSelected() {
    this.loadGraph();
    this.loadKgState();
    this.loadForgetState();
    this.loadForgetEpoch();
  },

  // ─── Graph data ───────────────────────────────────────────────────────────

  async loadGraph() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    this.setData({
      loading: true,
      expandedNodeName: null,
      expandedRelationIdx: null,
      editingNodeName: null,
      editingRelationIdx: null,
    });
    try {
      const res = await queryKnowledgeGraphic({ productId: currentProductId });
      if (res && res.errorCode === 200 && res.data) {
        const nodes = Array.isArray(res.data.nodes) ? res.data.nodes : [];
        const relations = Array.isArray(res.data.relations) ? res.data.relations : [];
        const nodeNames = nodes.map(n => n.name);
        this.setData({ nodes, nodeNames, relations });
      }
    } catch (e) {
      showToast('加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  // ─── Toggle: auto-generate ────────────────────────────────────────────────

  async loadKgState() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    try {
      const res = await getKnowledgeGraphicState({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        if (res.data === null) {
          await addKnowledgeGraphicToggleConfig({ productId: currentProductId });
          this.loadKgState();
        } else {
          this.setData({ knowledgeGraphicEnable: res.data.value === 'true' });
        }
      }
    } catch (e) {}
  },

  async onToggleKg() {
    const { currentProductId, knowledgeGraphicEnable } = this.data;
    if (!currentProductId) return;
    showLoading();
    try {
      const fn = knowledgeGraphicEnable ? disabledKnowledgeGraphic : enableKnowledgeGraphic;
      const res = await fn({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        showToast(knowledgeGraphicEnable
          ? '已关闭知识图谱自动生成'
          : '已开启，与模型对话超过6轮将自动生成知识图谱');
        await this.loadKgState();
      }
    } catch (e) {
      showToast('操作失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Toggle: forget ───────────────────────────────────────────────────────

  async loadForgetState() {
    const { currentProductId } = this.data;
    if (!currentProductId) return;
    try {
      const res = await getKnowledgeGraphicForgetState({ productId: currentProductId });
      if (res && res.errorCode === 200) {
        if (res.data === null) {
          await addKnowledgeGraphicForgetToggleConfig({ productId: currentProductId });
          this.loadForgetState();
        } else {
          this.setData({ knowledgeGraphForgetEnable: res.data.value === 'true' });
        }
      }
    } catch (e) {}
  },

  async onToggleForget() {
    const { currentProductId, knowledgeGraphForgetEnable } = this.data;
    if (!currentProductId) return;
    showLoading();
    try {
      const res = await knowledgeGraphicForgetToggle({
        productId: currentProductId,
        value: String(!knowledgeGraphForgetEnable),
      });
      if (res && res.errorCode === 200) {
        showToast(knowledgeGraphForgetEnable ? '已关闭遗忘功能' : '已开启遗忘功能');
        this.setData({ knowledgeGraphForgetEnable: !knowledgeGraphForgetEnable });
      }
    } catch (e) {
      showToast('操作失败');
    } finally {
      hideLoading();
    }
  },

  async loadForgetEpoch() {
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
      await updateKnowledgeGraphicForgetEpoch({
        productId: currentProductId,
        value: String(knowledgeGraphForgetEpoch),
      });
    } catch (e) {}
  },

  // ─── Tabs ─────────────────────────────────────────────────────────────────

  onTabChange(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    this.setData({
      activeTab: idx,
      expandedNodeName: null,
      expandedRelationIdx: null,
      editingNodeName: null,
      editingRelationIdx: null,
    });
  },

  // ─── Node: expand/collapse ────────────────────────────────────────────────

  async onNodeTap(e) {
    const { name } = e.currentTarget.dataset;
    const { expandedNodeName, currentProductId, nodes } = this.data;
    if (expandedNodeName === name) {
      this.setData({
        expandedNodeName: null,
        expandedNodeAttrs: [],
        editingNodeName: null,
        addingAttrForNode: null,
        newAttrName: '',
      });
      return;
    }
    this.setData({
      expandedNodeName: name,
      expandedNodeAttrs: [],
      editingNodeName: null,
      addingAttrForNode: null,
      newAttrName: '',
    });
    await this._fetchNodeAttrs(name);
  },

  async _fetchNodeAttrs(nodeName) {
    const { currentProductId, nodes } = this.data;
    const node = nodes.find(n => n.name === nodeName);
    if (!node) return;
    try {
      const res = await getNodeAttributes({ productId: currentProductId, nodeId: node.id });
      if (res && res.errorCode === 200) {
        this.setData({ expandedNodeAttrs: Array.isArray(res.data) ? res.data : [] });
      }
    } catch (e) {}
  },

  // ─── Node: edit ───────────────────────────────────────────────────────────

  onStartEditNode(e) {
    const { name } = e.currentTarget.dataset;
    const node = this.data.nodes.find(n => n.name === name);
    if (!node) return;
    this.setData({ editingNodeName: name, editNodeName: node.name, editNodeDes: node.des });
  },

  onCancelEditNode() {
    this.setData({ editingNodeName: null });
  },

  onEditNodeNameInput(e) { this.setData({ editNodeName: e.detail.value }); },
  onEditNodeDesInput(e)  { this.setData({ editNodeDes: e.detail.value });  },

  async onSubmitEditNode() {
    const { currentProductId, editingNodeName, editNodeName, editNodeDes, nodes } = this.data;
    if (!editNodeName.trim()) { showToast('节点名称不能为空'); return; }
    if (!editNodeDes.trim())  { showToast('节点描述不能为空'); return; }
    const node = nodes.find(n => n.name === editingNodeName);
    if (!node) return;
    showLoading();
    try {
      const res = await updateKnowledgeGraphicNode({
        id: node.id,
        name: editNodeName.trim(),
        des: editNodeDes.trim(),
        attributes: [],
        productId: currentProductId,
      });
      if (res && res.errorCode === 200) {
        showToast('更新成功');
        const newName = editNodeName.trim();
        this.setData({ editingNodeName: null });
        await this.loadGraph();
        // Re-expand the (possibly renamed) node
        this.setData({ expandedNodeName: newName });
        await this._fetchNodeAttrs(newName);
      } else {
        showToast('更新失败');
      }
    } catch (e) {
      showToast('更新失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Node: delete ─────────────────────────────────────────────────────────

  async onDeleteNode(e) {
    const { name } = e.currentTarget.dataset;
    const { currentProductId, nodes } = this.data;
    const ok = await showConfirm(`确认删除节点 "${name}" 吗？`);
    if (!ok) return;
    const node = nodes.find(n => n.name === name);
    if (!node) return;
    showLoading();
    try {
      const res = await deleteKnowledgeGraphicNode({ ...node, productId: currentProductId });
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        this.setData({ expandedNodeName: null });
        await this.loadGraph();
      } else {
        showToast('删除失败');
      }
    } catch (e) {
      showToast('删除失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Attribute: add ───────────────────────────────────────────────────────

  onStartAddAttr(e) {
    const { name } = e.currentTarget.dataset;
    this.setData({ addingAttrForNode: name, newAttrName: '' });
  },

  onCancelAddAttr() {
    this.setData({ addingAttrForNode: null, newAttrName: '' });
  },

  onNewAttrInput(e) { this.setData({ newAttrName: e.detail.value }); },

  async onSubmitAddAttr() {
    const { currentProductId, addingAttrForNode, newAttrName, nodes } = this.data;
    if (!newAttrName.trim()) { showToast('属性名称不能为空'); return; }
    const node = nodes.find(n => n.name === addingAttrForNode);
    if (!node) return;
    showLoading();
    try {
      const res = await addNodeAttribute({
        name: newAttrName.trim(),
        belong: node.id,
        productId: currentProductId,
      });
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ addingAttrForNode: null, newAttrName: '' });
        // Refresh graph (updates attribute count badge) then re-expand the node
        await this.loadGraph();
        this.setData({ expandedNodeName: addingAttrForNode });
        await this._fetchNodeAttrs(addingAttrForNode);
      } else {
        showToast('添加失败');
      }
    } catch (e) {
      showToast('添加失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Attribute: delete ────────────────────────────────────────────────────

  async onDeleteAttr(e) {
    const { attrName, nodeName } = e.currentTarget.dataset;
    const { currentProductId, nodes, expandedNodeName } = this.data;
    const ok = await showConfirm(`确认删除属性 "${attrName}" 吗？`);
    if (!ok) return;
    const node = nodes.find(n => n.name === nodeName);
    if (!node) return;
    showLoading();
    try {
      const res = await deleteNodeAttribute({
        name: attrName,
        belong: node.id,
        productId: currentProductId,
      });
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        await this.loadGraph();
        this.setData({ expandedNodeName });
        await this._fetchNodeAttrs(expandedNodeName);
      } else {
        showToast('删除失败');
      }
    } catch (e) {
      showToast('删除失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Add Node modal ───────────────────────────────────────────────────────

  onShowAddNodeModal() {
    if (!this.data.currentProductId) { showToast('请先选择产品'); return; }
    this.setData({ showAddNodeModal: true, addNodeName: '', addNodeDes: '' });
  },

  onCloseAddNodeModal() { this.setData({ showAddNodeModal: false }); },

  onAddNodeNameInput(e) { this.setData({ addNodeName: e.detail.value }); },
  onAddNodeDesInput(e)  { this.setData({ addNodeDes:  e.detail.value }); },

  async onSubmitAddNode() {
    const { currentProductId, addNodeName, addNodeDes } = this.data;
    if (!addNodeName.trim()) { showToast('请输入节点名称'); return; }
    if (!addNodeDes.trim())  { showToast('请输入节点描述'); return; }
    showLoading();
    try {
      const res = await addKnowledgeGraphicNode({
        productId: currentProductId,
        name: addNodeName.trim(),
        des: addNodeDes.trim(),
        attributes: [],
      });
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ showAddNodeModal: false });
        await this.loadGraph();
      } else {
        showToast(res && res.errorMsg ? res.errorMsg : '添加失败');
      }
    } catch (e) {
      showToast('添加失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Relation: expand/collapse ────────────────────────────────────────────

  onRelationTap(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const { expandedRelationIdx, relations } = this.data;
    if (expandedRelationIdx === idx) {
      this.setData({ expandedRelationIdx: null, editingRelationIdx: null });
      return;
    }
    const rel = relations[idx];
    this.setData({
      expandedRelationIdx: idx,
      editingRelationIdx: null,
      editRelationDes: rel ? rel.des : '',
    });
  },

  // ─── Relation: edit ───────────────────────────────────────────────────────

  onStartEditRelation(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const rel = this.data.relations[idx];
    this.setData({ editingRelationIdx: idx, editRelationDes: rel ? rel.des : '' });
  },

  onCancelEditRelation() { this.setData({ editingRelationIdx: null }); },

  onEditRelationDesInput(e) { this.setData({ editRelationDes: e.detail.value }); },

  async onSubmitEditRelation() {
    const { currentProductId, editingRelationIdx, editRelationDes, relations, nodes } = this.data;
    const rel = relations[editingRelationIdx];
    if (!rel) return;
    const fromNode = nodes.find(n => n.name === rel.from);
    const toNode   = nodes.find(n => n.name === rel.to);
    if (!fromNode || !toNode) { showToast('节点信息丢失，请刷新后重试'); return; }
    showLoading();
    try {
      const res = await updateRelation({
        id: rel.id,
        productId: currentProductId,
        from: fromNode.id,
        to: toNode.id,
        des: editRelationDes,
      });
      if (res && res.errorCode === 200) {
        showToast('更新成功');
        this.setData({ editingRelationIdx: null });
        await this.loadGraph();
      } else {
        showToast('更新失败');
      }
    } catch (e) {
      showToast('更新失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Relation: delete ─────────────────────────────────────────────────────

  async onDeleteRelation(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const { currentProductId, relations, nodes } = this.data;
    const rel = relations[idx];
    if (!rel) return;
    const ok = await showConfirm(`确认删除关系 "${rel.from} → ${rel.to}" 吗？`);
    if (!ok) return;
    const fromNode = nodes.find(n => n.name === rel.from);
    const toNode   = nodes.find(n => n.name === rel.to);
    if (!fromNode || !toNode) { showToast('节点信息丢失，请刷新后重试'); return; }
    showLoading();
    try {
      const res = await deleteRelation({
        productId: currentProductId,
        from: fromNode.id,
        to: toNode.id,
      });
      if (res && res.errorCode === 200) {
        showToast('删除成功');
        this.setData({ expandedRelationIdx: null });
        await this.loadGraph();
      } else {
        showToast('删除失败');
      }
    } catch (e) {
      showToast('删除失败');
    } finally {
      hideLoading();
    }
  },

  // ─── Add Relation modal ───────────────────────────────────────────────────

  onShowAddRelationModal() {
    const { currentProductId, nodes } = this.data;
    if (!currentProductId) { showToast('请先选择产品'); return; }
    if (nodes.length < 2)  { showToast('至少需要两个节点才能添加关系'); return; }
    this.setData({ showAddRelationModal: true, addRelFromIndex: 0, addRelToIndex: 1, addRelDes: '' });
  },

  onCloseAddRelationModal() { this.setData({ showAddRelationModal: false }); },

  onAddRelFromChange(e) { this.setData({ addRelFromIndex: Number(e.detail.value) }); },
  onAddRelToChange(e)   { this.setData({ addRelToIndex:   Number(e.detail.value) }); },
  onAddRelDesInput(e)   { this.setData({ addRelDes: e.detail.value }); },

  async onSubmitAddRelation() {
    const { currentProductId, addRelFromIndex, addRelToIndex, addRelDes, nodes, relations } = this.data;
    const fromNode = nodes[addRelFromIndex];
    const toNode   = nodes[addRelToIndex];
    if (!fromNode || !toNode) { showToast('请选择节点'); return; }
    if (fromNode.id === toNode.id) { showToast('源节点和目标节点不能相同'); return; }
    // Duplicate check
    if (relations.find(r => r.from === fromNode.name && r.to === toNode.name)) {
      showToast('该关系已存在');
      return;
    }
    showLoading();
    try {
      const res = await addRelation({
        productId: currentProductId,
        from: fromNode.id,
        to: toNode.id,
        des: addRelDes.trim() || `${fromNode.name}->${toNode.name}`,
      });
      if (res && res.errorCode === 200) {
        showToast('添加成功');
        this.setData({ showAddRelationModal: false });
        await this.loadGraph();
      } else {
        showToast(res && res.errorMsg ? res.errorMsg : '添加失败');
      }
    } catch (e) {
      showToast('添加失败');
    } finally {
      hideLoading();
    }
  },

  // ─── FAB ──────────────────────────────────────────────────────────────────

  onFab() {
    if (this.data.activeTab === 0) {
      this.onShowAddNodeModal();
    } else {
      this.onShowAddRelationModal();
    }
  },

  noop() {},
});
