const { getProductFunction, postProductFunction, deleteProductFunction } = require('../../api/productFunction')
const { getProductModel } = require('../../api/productModel')
const { getProductName } = require('../../api/product')
const { showSuccess, showError, confirm } = require('../../utils/util')

Page({
  data: { list: [], showAdd: false, form: {},
    modelOptions: [], },

  onLoad() { this.fetchList() },
  onShow()  { this.fetchList() },

  fetchList() {
    getProductFunction()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          this.setData({ list: data })
        } else if (errorCode === 200) {
          this.setData({ list: [] })
        }
      })
      .catch(() => showError('加载失败'))
  },

  loadModelOptions() {
    getProductModel().then(async (res) => {
      const { data, errorCode } = res.data
      if (errorCode === 200 && Array.isArray(data)) {
        const opts = await Promise.all(data.map(async (item) => {
          let label = item.name
          try {
            const r = await getProductName({ id: item.productId })
            if (r.data.errorCode === 200) label = `${item.name} (${r.data.data})`
          } catch(e) {}
          return { value: item.id, label }
        }))
        this.setData({ modelOptions: opts })
      }
    })
  },
  onModelChange(e) {
    const modelId = this.data.modelOptions[e.detail.value].value
    this.setData({ form: { ...this.data.form, modelId } })
  },
  openAdd() { this.loadModelOptions(); this.setData({ showAdd: true, form: {} }) },
  closeAdd() { this.setData({ showAdd: false }) },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ form: { ...this.data.form, [field]: e.detail.value } })
  },

  onSubmit() {
    postProductFunction(this.data.form)
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
    const ok = await confirm('确定删除？')
    if (!ok) return
    deleteProductFunction({ id })
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

})
