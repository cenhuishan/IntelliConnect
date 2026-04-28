const { request } = require('../utils/request')

/**
 * Get the complete knowledge graph (nodes + relations + attributes) for the active product.
 */
function getKnowledgeGraph() {
  return request({ url: '/api/wx/v1/kg/graphic', method: 'GET' })
}

/**
 * Get all nodes for the active product.
 */
function getNodes() {
  return request({ url: '/api/wx/v1/kg/nodes', method: 'GET' })
}

/**
 * Get a single node by name.
 * @param {string} name
 */
function getNode(name) {
  return request({ url: '/api/wx/v1/kg/node', method: 'GET', params: { name } })
}

/**
 * Add a node.
 * @param {string} name
 * @param {string} des
 * @param {string[]} attributes
 */
function addNode(name, des, attributes) {
  return request({
    url: '/api/wx/v1/kg/node',
    method: 'POST',
    data: { name, des: des || '', attributes: attributes || [] },
  })
}

/**
 * Update a node.
 * @param {number} id
 * @param {string} name
 * @param {string} des
 */
function updateNode(id, name, des) {
  return request({
    url: '/api/wx/v1/kg/node',
    method: 'PUT',
    data: { id, name, des: des || '' },
  })
}

/**
 * Delete a node by id.
 * @param {number} id
 */
function deleteNode(id) {
  return request({
    url: '/api/wx/v1/kg/node',
    method: 'DELETE',
    data: { id, name: '_', productId: 0 },
  })
}

/**
 * Get attributes for a node.
 * @param {number} nodeId
 */
function getAttributes(nodeId) {
  return request({ url: '/api/wx/v1/kg/attr', method: 'GET', params: { nodeId } })
}

/**
 * Add an attribute to a node.
 * @param {string} name  attribute name
 * @param {number} belong  node id
 */
function addAttribute(name, belong) {
  return request({
    url: '/api/wx/v1/kg/attr',
    method: 'POST',
    data: { name, belong },
  })
}

/**
 * Delete an attribute.
 * @param {number} id   attribute id
 * @param {number} belong  node id
 * @param {string} name    attribute name
 */
function deleteAttribute(id, belong, name) {
  return request({
    url: '/api/wx/v1/kg/attr',
    method: 'DELETE',
    data: { id, belong, name },
  })
}

/**
 * Update an attribute name.
 * @param {number} id   attribute id
 * @param {string} name  new name
 */
function updateAttribute(id, name) {
  return request({
    url: '/api/wx/v1/kg/attr',
    method: 'PUT',
    data: { id, name },
  })
}

/**
 * Get relations for a node.
 * @param {number} nodeId
 */
function getRelations(nodeId) {
  return request({ url: '/api/wx/v1/kg/relation', method: 'GET', params: { nodeId } })
}

/**
 * Add a relation.
 * @param {string} des
 * @param {number} from  source node id
 * @param {number} to    target node id
 */
function addRelation(des, from, to) {
  return request({
    url: '/api/wx/v1/kg/relation',
    method: 'POST',
    data: { des, from, to },
  })
}

/**
 * Delete a relation between two nodes.
 * @param {number} from
 * @param {number} to
 */
function deleteRelation(from, to) {
  return request({
    url: '/api/wx/v1/kg/relation',
    method: 'DELETE',
    data: { des: '_', from, to },
  })
}

module.exports = {
  getKnowledgeGraph,
  getNodes,
  getNode,
  addNode,
  updateNode,
  deleteNode,
  getAttributes,
  addAttribute,
  deleteAttribute,
  updateAttribute,
  getRelations,
  addRelation,
  deleteRelation,
}
