/**
 * 通用工具函数
 */

/** 格式化时间戳为 YYYY-MM-DD HH:mm:ss */
function formatTime(timestamp) {
  const d = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 显示操作成功提示 */
function showSuccess(msg = '操作成功') {
  wx.showToast({ title: msg, icon: 'success', duration: 1500 })
}

/** 显示操作失败提示 */
function showError(msg = '操作失败') {
  wx.showToast({ title: msg, icon: 'none', duration: 2000 })
}

/** 确认弹窗 */
function confirm(content) {
  return new Promise((resolve) => {
    wx.showModal({
      title: '提示',
      content,
      success(res) {
        resolve(res.confirm)
      },
    })
  })
}

module.exports = { formatTime, showSuccess, showError, confirm }
