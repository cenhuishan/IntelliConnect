const { request } = require('../utils/request')

const getXiaoZhi = () => request({ url: '/api/v2/xiaozhi/otaManage', method: 'GET' })
const postXiaoZhi = (data) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'POST', data })
const deleteXiaoZhi = (params) => request({ url: '/api/v2/xiaozhi/otaManage', method: 'DELETE', params })

module.exports = { getXiaoZhi, postXiaoZhi, deleteXiaoZhi }
