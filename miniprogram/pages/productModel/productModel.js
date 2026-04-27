const { getProductModel, postProductModel, deleteProductModel } = require('../../api/productModel')
const { getProduct } = require('../../api/product')
const { showSuccess, showError, confirm } = require('../../utils/util')

Page({
  data: {
    list: [],
    productOptions: [],
    showAdd: false,
    form: { name: '', productId: '', description: '' },
  },

  onLoad() { this.fetchList() },
  onShow()  { this.fetchList() },

  fetchList() {
    getProductModel()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          this.setData({ list: data })
        }
      })
      .catch(() => showError('加载失败'))
  },

  openAdd() {
    // 加载产品列表用于选择
    getProduct().then((res) => {
      const { data, errorCode } = res.data
      if (errorCode === 200 && Array.isArray(data)) {
        this.setData({ productOptions: data })
      }
    })
    this.setData({ showAdd: true, form: { name: '', productId: '', description: '' } })
  },
  closeAdd() { this.setData({ showAdd: false }) },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ form: { ...this.data.form, [field]: e.detail.value } })
  },

  onProductChange(e) {
    const productId = this.data.productOptions[e.detail.value].id
    this.setData({ form: { ...this.data.form, productId } })
  },

  onSubmit() {
    const { name, productId, description } = this.data.form
    if (!name || !productId || !description) { showError('请填写所有必填字段'); return }
    postProductModel({ name, productId, description })
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
    const ok = await confirm('确定删除该物模型？删除后关联设备也将受影响。')
    if (!ok) return
    deleteProductModel({ id })
      .then((res) => {
        const { errorCode } = res.data
        if (errorCode === 200) {
          showSuccess('删除成功')
          this.fetchList()
        } else if (errorCode === 3002) {
          showError('删除失败，物模型被设备绑定')
        } else {
          showError('删除失败')
        }
      })
      .catch(() => showError('删除失败'))
  },
})
