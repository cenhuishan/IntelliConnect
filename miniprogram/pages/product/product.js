const { getProduct, postProduct, deleteProduct } = require('../../api/product')
const { showSuccess, showError, confirm } = require('../../utils/util')

Page({
  data: {
    list: [],
    loading: false,
    showAdd: false,
    form: { productName: '', description: '' },
  },

  onLoad() { this.fetchList() },
  onShow()  { this.fetchList() },

  fetchList() {
    this.setData({ loading: true })
    getProduct()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          this.setData({ list: data })
        }
      })
      .catch(() => showError('加载失败'))
      .finally(() => this.setData({ loading: false }))
  },

  openAdd() { this.setData({ showAdd: true, form: { productName: '', description: '' } }) },
  closeAdd() { this.setData({ showAdd: false }) },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    const form = { ...this.data.form, [field]: e.detail.value }
    this.setData({ form })
  },

  onSubmit() {
    const { productName, description } = this.data.form
    if (!productName) { showError('请输入产品名称'); return }
    postProduct({ productName, description })
      .then((res) => {
        if (res.data.errorCode === 200) {
          showSuccess('添加成功')
          this.closeAdd()
          this.fetchList()
        } else {
          showError('添加失败')
        }
      })
      .catch(() => showError('添加失败'))
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset
    const ok = await confirm('确定删除该产品？')
    if (!ok) return
    deleteProduct({ id })
      .then((res) => {
        if (res.data.errorCode === 200) {
          showSuccess('删除成功')
          this.fetchList()
        } else {
          showError('删除失败')
        }
      })
      .catch(() => showError('删除失败'))
  },

  // 跳转子页
  goProductModel()    { wx.navigateTo({ url: '/pages/productModel/productModel' }) },
  goProductData()     { wx.navigateTo({ url: '/pages/productData/productData' }) },
  goProductFunction() { wx.navigateTo({ url: '/pages/productFunction/productFunction' }) },
  goProductDevice()   { wx.navigateTo({ url: '/pages/productDevice/productDevice' }) },
  goProductEvent()    { wx.navigateTo({ url: '/pages/productEvent/productEvent' }) },
  goProductEventData(){ wx.navigateTo({ url: '/pages/productEventData/productEventData' }) },
  goProductXiaoZhi()  { wx.navigateTo({ url: '/pages/productXiaoZhi/productXiaoZhi' }) },
  goProductRole()     { wx.navigateTo({ url: '/pages/productRole/productRole' }) },
  goAgentMemory()     { wx.navigateTo({ url: '/pages/agentMemory/agentMemory' }) },
  goAgentLongMemory() { wx.navigateTo({ url: '/pages/agentLongMemory/agentLongMemory' }) },
  goRouterSet()       { wx.navigateTo({ url: '/pages/productRouterSet/productRouterSet' }) },
  goKnowledge()       { wx.navigateTo({ url: '/pages/productKnowledge/productKnowledge' }) },
  goMcp()             { wx.navigateTo({ url: '/pages/productMcp/productMcp' }) },
  goSkills()          { wx.navigateTo({ url: '/pages/productSkills/productSkills' }) },
  goAsr()             { wx.navigateTo({ url: '/pages/productAsr/productAsr' }) },
  goOta()             { wx.navigateTo({ url: '/pages/productOta/productOta' }) },
  goOtaXiaoZhi()      { wx.navigateTo({ url: '/pages/productOtaXiaoZhi/productOtaXiaoZhi' }) },
  goOtaPassive()      { wx.navigateTo({ url: '/pages/productOtaPassive/productOtaPassive' }) },
  goAlarmEvent()      { wx.navigateTo({ url: '/pages/alarmEvent/alarmEvent' }) },
  goLlmProvider()     { wx.navigateTo({ url: '/pages/llmProvider/llmProvider' }) },
  goProductLlmModel() { wx.navigateTo({ url: '/pages/productLlmModel/productLlmModel' }) },
  goKnowledgeGraphic(){ wx.navigateTo({ url: '/pages/knowledgeGraphic/knowledgeGraphic' }) },
  goTimeSchedule()    { wx.navigateTo({ url: '/pages/timeSchedule/timeSchedule' }) },
})
