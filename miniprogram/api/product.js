const { request } = require('../utils/request')

/**
 * List all products bound to the current wx user.
 */
function getMyProducts() {
  return request({ url: '/api/wx/v1/wxMyProducts', method: 'GET' })
}

/**
 * Get the currently active product.
 */
function getActiveProduct() {
  return request({ url: '/api/wx/v1/wxActiveProduct', method: 'GET' })
}

/**
 * Set the active product.
 * @param {number} productId
 */
function setActiveProduct(productId) {
  return request({
    url: '/api/wx/v1/wxActiveProduct',
    method: 'POST',
    data: { productId },
  })
}

/**
 * Get basic info (name, key) for the active product.
 */
function getProductInfo() {
  return request({ url: '/api/wx/v1/wxProductInfo', method: 'GET' })
}

/**
 * Get the thing model (property definitions) for the active product.
 */
function getProductModel() {
  return request({ url: '/api/wx/v1/wxProductModel', method: 'GET' })
}

/**
 * Bind a product by name and key.
 * @param {string} productName
 * @param {string} productKey
 */
function bindProduct(productName, productKey) {
  return request({
    url: '/wxBindProduct',
    method: 'POST',
    data: { productName, productKey },
  })
}

/**
 * Unbind a product.
 * @param {string} productName
 * @param {string} productKey
 */
function unbindProduct(productName, productKey) {
  return request({
    url: '/wxBindProduct',
    method: 'DELETE',
    data: { productName, productKey },
  })
}

module.exports = {
  getMyProducts,
  getActiveProduct,
  setActiveProduct,
  getProductInfo,
  getProductModel,
  bindProduct,
  unbindProduct,
}
