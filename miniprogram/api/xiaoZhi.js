const { request } = require('../utils/request')

const getXiaoZhi = () => request({ url: '/api/v2/productXiaoZhi', method: 'GET' })
const postXiaoZhi = (data) => request({ url: '/api/v2/productXiaoZhi', method: 'POST', data })
const deleteXiaoZhi = (params) => request({ url: '/api/v2/productXiaoZhi', method: 'DELETE', params })

module.exports = { getXiaoZhi, postXiaoZhi, deleteXiaoZhi }
