const { getMyProducts, setActiveProduct, bindProduct, unbindProduct } = require('../../api/product')
const { getActiveProduct } = require('../../api/product')

Page({
  data: {
    products: [],
    activeProductId: 0,
    loading: true,
    showBindModal: false,
    bindForm: { productName: '', productKey: '' },
  },

  onShow() {
    this.loadProducts()
  },

  loadProducts() {
    this.setData({ loading: true })
    Promise.all([getMyProducts(), getActiveProduct()])
      .then(([prodRes, activeRes]) => {
        const prods = prodRes.data.errorCode === 200 ? prodRes.data.data || [] : []
        const activeId =
          activeRes.data.errorCode === 200 && activeRes.data.data
            ? activeRes.data.data.productId
            : 0
        this.setData({ products: prods, activeProductId: activeId, loading: false })
      })
      .catch(() => this.setData({ loading: false }))
  },

  onSelectProduct(e) {
    const productId = e.currentTarget.dataset.id
    wx.showLoading({ title: '切换中...' })
    setActiveProduct(productId)
      .then(() => {
        wx.hideLoading()
        this.setData({ activeProductId: productId })
        wx.showToast({ title: '已切换', icon: 'success' })
      })
      .catch(() => wx.hideLoading())
  },

  onUnbind(e) {
    const { name, key } = e.currentTarget.dataset
    wx.showModal({
      title: '确认解绑',
      content: `确认解绑产品 ${name}？`,
      success: (res) => {
        if (res.confirm) {
          unbindProduct(name, key)
            .then(() => {
              wx.showToast({ title: '已解绑', icon: 'success' })
              this.loadProducts()
            })
            .catch(() => wx.showToast({ title: '解绑失败', icon: 'none' }))
        }
      },
    })
  },

  openBindModal() {
    this.setData({ showBindModal: true, bindForm: { productName: '', productKey: '' } })
  },

  closeBindModal() {
    this.setData({ showBindModal: false })
  },

  onBindNameInput(e) {
    this.setData({ 'bindForm.productName': e.detail.value })
  },

  onBindKeyInput(e) {
    this.setData({ 'bindForm.productKey': e.detail.value })
  },

  onConfirmBind() {
    const { productName, productKey } = this.data.bindForm
    if (!productName || !productKey) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    wx.showLoading({ title: '绑定中...' })
    bindProduct(productName, productKey)
      .then((res) => {
        wx.hideLoading()
        if (res.data.errorCode === 200) {
          wx.showToast({ title: '绑定成功', icon: 'success' })
          this.setData({ showBindModal: false })
          this.loadProducts()
        } else {
          wx.showToast({ title: '绑定失败，检查产品名称和密钥', icon: 'none' })
        }
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({ title: '网络错误', icon: 'none' })
      })
  },
})
