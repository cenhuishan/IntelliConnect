const {
  getNodes,
  addNode,
  updateNode,
  deleteNode,
  getAttributes,
  addAttribute,
  deleteAttribute,
  getRelations,
  addRelation,
  deleteRelation,
} = require('../../api/knowledgeGraph')

Page({
  data: {
    nodes: [],
    loading: true,
    // ── Node form ──
    showNodeModal: false,
    nodeForm: { name: '', des: '' },
    editingNodeId: null,
    // ── Selected node for detail panel ──
    selectedNode: null,
    attributes: [],
    relations: [],
    // ── Attribute form ──
    showAttrModal: false,
    attrForm: { name: '' },
    // ── Relation form ──
    showRelModal: false,
    relForm: { des: '', toNodeId: '' },
    // ── Edit mode flags ──
    editAttrId: null,
    editAttrName: '',
    showEditAttrModal: false,
  },

  onShow() {
    this.loadNodes()
  },

  onPullDownRefresh() {
    this.loadNodes()
  },

  loadNodes() {
    this.setData({ loading: true })
    getNodes()
      .then((res) => {
        const body = res.data
        if (body.errorCode === 200) {
          this.setData({ nodes: body.data || [], loading: false })
        } else {
          this.setData({ nodes: [], loading: false })
        }
        wx.stopPullDownRefresh()
      })
      .catch(() => {
        this.setData({ loading: false })
        wx.stopPullDownRefresh()
      })
  },

  // ── Select a node to view its attributes and relations ──
  onSelectNode(e) {
    const node = e.currentTarget.dataset.node
    this.setData({ selectedNode: node, attributes: [], relations: [] })
    Promise.all([getAttributes(node.id), getRelations(node.id)])
      .then(([attrRes, relRes]) => {
        const attrs = attrRes.data.errorCode === 200 ? attrRes.data.data || [] : []
        const rels = relRes.data.errorCode === 200 ? relRes.data.data || [] : []
        this.setData({ attributes: attrs, relations: rels })
      })
      .catch(console.error)
  },

  // ── Close detail panel ──
  onCloseDetail() {
    this.setData({ selectedNode: null, attributes: [], relations: [] })
  },

  // ── Add / Edit Node modal ──
  openAddNodeModal() {
    this.setData({
      showNodeModal: true,
      editingNodeId: null,
      nodeForm: { name: '', des: '' },
    })
  },

  openEditNodeModal(e) {
    const node = e.currentTarget.dataset.node
    this.setData({
      showNodeModal: true,
      editingNodeId: node.id,
      nodeForm: { name: node.name, des: node.des || '' },
    })
  },

  closeNodeModal() {
    this.setData({ showNodeModal: false })
  },

  onNodeNameInput(e) {
    this.setData({ 'nodeForm.name': e.detail.value })
  },

  onNodeDesInput(e) {
    this.setData({ 'nodeForm.des': e.detail.value })
  },

  onConfirmNode() {
    const { nodeForm, editingNodeId } = this.data
    if (!nodeForm.name.trim()) {
      wx.showToast({ title: '节点名称不能为空', icon: 'none' })
      return
    }
    wx.showLoading({ title: '保存中...' })
    const action = editingNodeId
      ? updateNode(editingNodeId, nodeForm.name.trim(), nodeForm.des.trim())
      : addNode(nodeForm.name.trim(), nodeForm.des.trim(), [])
    action
      .then((res) => {
        wx.hideLoading()
        if (res.data.errorCode === 200) {
          wx.showToast({ title: editingNodeId ? '更新成功' : '添加成功', icon: 'success' })
          this.setData({ showNodeModal: false })
          this.loadNodes()
        } else {
          wx.showToast({ title: '操作失败', icon: 'none' })
        }
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({ title: '网络错误', icon: 'none' })
      })
  },

  onDeleteNode(e) {
    const node = e.currentTarget.dataset.node
    wx.showModal({
      title: '删除节点',
      content: `确认删除节点 "${node.name}"？\n相关属性和关系将一并删除`,
      success: (res) => {
        if (res.confirm) {
          deleteNode(node.id)
            .then(() => {
              wx.showToast({ title: '已删除', icon: 'success' })
              this.setData({ selectedNode: null })
              this.loadNodes()
            })
            .catch(() => wx.showToast({ title: '删除失败', icon: 'none' }))
        }
      },
    })
  },

  // ── Attribute actions ──
  openAddAttrModal() {
    this.setData({ showAttrModal: true, attrForm: { name: '' } })
  },

  closeAttrModal() {
    this.setData({ showAttrModal: false })
  },

  onAttrNameInput(e) {
    this.setData({ 'attrForm.name': e.detail.value })
  },

  onConfirmAttr() {
    const { attrForm, selectedNode } = this.data
    if (!attrForm.name.trim()) {
      wx.showToast({ title: '属性名称不能为空', icon: 'none' })
      return
    }
    addAttribute(attrForm.name.trim(), selectedNode.id)
      .then((res) => {
        if (res.data.errorCode === 200) {
          wx.showToast({ title: '添加成功', icon: 'success' })
          this.setData({ showAttrModal: false })
          getAttributes(selectedNode.id).then((r) => {
            if (r.data.errorCode === 200)
              this.setData({ attributes: r.data.data || [] })
          })
        } else {
          wx.showToast({ title: '添加失败', icon: 'none' })
        }
      })
      .catch(() => wx.showToast({ title: '网络错误', icon: 'none' }))
  },

  onDeleteAttr(e) {
    const attr = e.currentTarget.dataset.attr
    const { selectedNode } = this.data
    wx.showModal({
      title: '删除属性',
      content: `确认删除属性 "${attr.name}"？`,
      success: (res) => {
        if (res.confirm) {
          deleteAttribute(attr.id, selectedNode.id, attr.name)
            .then(() => {
              wx.showToast({ title: '已删除', icon: 'success' })
              getAttributes(selectedNode.id).then((r) => {
                if (r.data.errorCode === 200)
                  this.setData({ attributes: r.data.data || [] })
              })
            })
            .catch(() => wx.showToast({ title: '删除失败', icon: 'none' }))
        }
      },
    })
  },

  // ── Relation actions ──
  openAddRelModal() {
    this.setData({ showRelModal: true, relForm: { des: '', toNodeId: '' } })
  },

  closeRelModal() {
    this.setData({ showRelModal: false })
  },

  onRelDesInput(e) {
    this.setData({ 'relForm.des': e.detail.value })
  },

  onRelToNodeInput(e) {
    this.setData({ 'relForm.toNodeId': e.detail.value })
  },

  onConfirmRel() {
    const { relForm, selectedNode } = this.data
    if (!relForm.des.trim() || !relForm.toNodeId) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    addRelation(relForm.des.trim(), selectedNode.id, Number(relForm.toNodeId))
      .then((res) => {
        if (res.data.errorCode === 200) {
          wx.showToast({ title: '添加成功', icon: 'success' })
          this.setData({ showRelModal: false })
          getRelations(selectedNode.id).then((r) => {
            if (r.data.errorCode === 200)
              this.setData({ relations: r.data.data || [] })
          })
        } else {
          wx.showToast({ title: '添加失败，检查目标节点ID', icon: 'none' })
        }
      })
      .catch(() => wx.showToast({ title: '网络错误', icon: 'none' }))
  },

  onDeleteRel(e) {
    const rel = e.currentTarget.dataset.rel
    wx.showModal({
      title: '删除关系',
      content: `确认删除关系 "${rel.des}"？`,
      success: (res) => {
        if (res.confirm) {
          deleteRelation(rel.from, rel.to)
            .then(() => {
              wx.showToast({ title: '已删除', icon: 'success' })
              const { selectedNode } = this.data
              getRelations(selectedNode.id).then((r) => {
                if (r.data.errorCode === 200)
                  this.setData({ relations: r.data.data || [] })
              })
            })
            .catch(() => wx.showToast({ title: '删除失败', icon: 'none' }))
        }
      },
    })
  },
})
