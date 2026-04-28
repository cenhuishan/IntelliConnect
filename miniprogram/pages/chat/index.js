const { sendChat } = require('../../api/chat')

Page({
  data: {
    messages: [],
    inputText: '',
    sending: false,
    scrollToId: '',
  },

  onInputChange(e) {
    this.setData({ inputText: e.detail.value })
  },

  onSend() {
    const text = this.data.inputText.trim()
    if (!text || this.data.sending) return

    const userMsg = { id: Date.now() + '_u', role: 'user', content: text }
    const messages = [...this.data.messages, userMsg]
    this.setData({ messages, inputText: '', sending: true, scrollToId: userMsg.id })

    sendChat(text)
      .then((res) => {
        const body = res.data
        let reply = '请求失败'
        if (body.errorCode === 200 && body.data && body.data.reply) {
          reply = body.data.reply
        }
        const aiMsg = { id: Date.now() + '_a', role: 'assistant', content: reply }
        this.setData({
          messages: [...this.data.messages, aiMsg],
          sending: false,
          scrollToId: aiMsg.id,
        })
      })
      .catch(() => {
        const errMsg = { id: Date.now() + '_e', role: 'assistant', content: '网络错误，请重试' }
        this.setData({
          messages: [...this.data.messages, errMsg],
          sending: false,
          scrollToId: errMsg.id,
        })
      })
  },

  onClearChat() {
    wx.showModal({
      title: '清空对话',
      content: '确认清空所有对话记录？',
      success: (res) => {
        if (res.confirm) this.setData({ messages: [] })
      },
    })
  },
})
