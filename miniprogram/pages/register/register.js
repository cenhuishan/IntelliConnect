const { register } = require('../../api/auth')
const { showSuccess, showError } = require('../../utils/util')

Page({
  data: {
    username: '',
    password: '',
    email: '',
    loading: false,
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }) },
  onPasswordInput(e) { this.setData({ password: e.detail.value }) },
  onEmailInput(e)    { this.setData({ email: e.detail.value }) },

  onRegister() {
    const { username, password, email } = this.data
    if (!username || !password || !email) {
      showError('请填写所有字段')
      return
    }
    this.setData({ loading: true })
    register({ username, password, email })
      .then((res) => {
        const { errorCode } = res.data
        if (errorCode === 200) {
          showSuccess('注册成功')
          setTimeout(() => wx.navigateBack(), 1500)
        } else {
          showError('注册失败，用户名可能已存在')
        }
      })
      .catch(() => showError('注册失败'))
      .finally(() => this.setData({ loading: false }))
  },
})
