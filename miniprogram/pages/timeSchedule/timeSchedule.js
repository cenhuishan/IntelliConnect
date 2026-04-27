const { getTimeSchedule, postTimeSchedule, deleteTimeSchedule } = require('../../api/timeSchedule')
const { showSuccess, showError, confirm } = require('../../utils/util')

Page({
  data: { list: [], showAdd: false, form: {}, },

  onLoad() { this.fetchList() },
  onShow()  { this.fetchList() },

  fetchList() {
    getTimeSchedule()
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

  openAdd() { this.setData({ showAdd: true, form: {} }) },
  closeAdd() { this.setData({ showAdd: false }) },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ form: { ...this.data.form, [field]: e.detail.value } })
  },

  onSubmit() {
    postTimeSchedule(this.data.form)
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
    deleteTimeSchedule({ id })
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
