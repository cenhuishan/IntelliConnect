const { request } = require('../utils/request')

const getProductSkills = () => request({ url: '/api/v2/productSkills', method: 'GET' })
const postProductSkills = (data) => request({ url: '/api/v2/productSkills', method: 'POST', data })
const deleteProductSkills = (params) => request({ url: '/api/v2/productSkills', method: 'DELETE', params })

module.exports = { getProductSkills, postProductSkills, deleteProductSkills }
