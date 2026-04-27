const { getUsers, deleteUser, updateUserRole } = require('../../api/user')
const { showSuccess, showError, confirm } = require('../../utils/util')

Page({
  data: {
    list: [],
    loading: false,
  },

  onLoad() { this.fetchList() },
  onShow()  { this.fetchList() },

  fetchList() {
    this.setData({ loading: true })
    getUsers()
      .then((res) => {
        const { data, errorCode } = res.data
        if (errorCode === 200 && Array.isArray(data)) {
          this.setData({ list: data })
        }
      })
      .catch(() => showError('加载失败'))
      .finally(() => this.setData({ loading: false }))
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset
    const ok = await confirm('确定删除该用户？')
    if (!ok) return
    deleteUser({ id })
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
