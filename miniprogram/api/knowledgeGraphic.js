const { request } = require('../utils/request');

const queryKnowledgeGraphic = (params) => request({ url: '/api/v2/kg/graphic', method: 'GET', params });
const addKnowledgeGraphicNode = (data) => request({ url: '/api/v2/kg/node', method: 'POST', data });
const deleteKnowledgeGraphicNode = (data) => request({ url: '/api/v2/kg/node', method: 'DELETE', data });
const updateKnowledgeGraphicNode = (data) => request({ url: '/api/v2/kg/node', method: 'PUT', data });
const getProductNodes = (params) => request({ url: '/api/v2/kg/nodes', method: 'GET', params });
const getNodeByName = (params) => request({ url: '/api/v2/kg/node', method: 'GET', params });
const getNodeInfo = (params) => request({ url: '/api/v2/kg/node', method: 'GET', params });
const getNodeAttributes = (params) => request({ url: '/api/v2/kg/attr', method: 'GET', params });
const addNodeAttribute = (data) => request({ url: '/api/v2/kg/attr', method: 'POST', data });
const deleteNodeAttribute = (data) => request({ url: '/api/v2/kg/attr', method: 'DELETE', data });
const addRelation = (data) => request({ url: '/api/v2/kg/relation', method: 'POST', data });
const deleteRelation = (data) => request({ url: '/api/v2/kg/relation', method: 'DELETE', data });
const updateRelation = (data) => request({ url: '/api/v2/kg/relation', method: 'PUT', data });
const getRelationByNodes = (params) => request({ url: '/api/v2/kg/relationByNodes', method: 'GET', params });

const enableKnowledgeGraphic = (data) => request({ url: '/api/v2/user/config', method: 'PUT', data: { ...data, name: 'knowledge_graph.toggle', type: 'boolean', value: 'true', defaultValue: 'false', required: true, des: 'Knowledge graph toggle' } });
const disabledKnowledgeGraphic = (data) => request({ url: '/api/v2/user/config', method: 'PUT', data: { ...data, name: 'knowledge_graph.toggle', type: 'boolean', value: 'false', defaultValue: 'false', required: true, des: 'Knowledge graph toggle' } });
const getKnowledgeGraphicState = (params) => request({ url: '/api/v2/user/config/knowledge_graph.toggle', method: 'GET', params });
const addKnowledgeGraphicToggleConfig = (data) => request({ url: '/api/v2/user/config', method: 'POST', data: { ...data, name: 'knowledge_graph.toggle', type: 'boolean', value: 'false', defaultValue: 'false', required: true, des: 'Knowledge graph toggle' } });
const getKnowledgeGraphicForgetState = (params) => request({ url: '/api/v2/user/config/knowledge_graph.forget.toggle', method: 'GET', params });
const addKnowledgeGraphicForgetToggleConfig = (data) => request({ url: '/api/v2/user/config', method: 'POST', data: { ...data, name: 'knowledge_graph.forget.toggle', type: 'boolean', value: 'false', defaultValue: 'false', required: true, des: 'Knowledge graph forget toggle' } });
const knowledgeGraphicForgetToggle = (data) => request({ url: '/api/v2/user/config', method: 'PUT', data: { ...data, name: 'knowledge_graph.forget.toggle', type: 'boolean', defaultValue: 'false', required: true, des: 'Knowledge graph forget toggle' } });
const getKnowledgeGraphicForgetEpoch = (params) => request({ url: '/api/v2/user/config/knowledge_graph.forget.epoch', method: 'GET', params });
const updateKnowledgeGraphicForgetEpoch = (data) => request({ url: '/api/v2/user/config', method: 'PUT', data: { ...data, name: 'knowledge_graph.forget.epoch', type: 'integer', defaultValue: '10', required: false, des: 'Knowledge graph forget epoch' } });

// Backward-compatible aliases for existing page code
const getGraphicList = queryKnowledgeGraphic;
const addGraphic = (data) => request({ url: '/api/v2/kg/graphic', method: 'POST', data });
const deleteGraphic = (id) => request({ url: '/api/v2/kg/graphic', method: 'DELETE', data: { id } });
const getNodeList = getNodeByName;
const addNode = addKnowledgeGraphicNode;
const deleteNode = (id) => request({ url: '/api/v2/kg/node', method: 'DELETE', data: { id } });
const getAttrList = getNodeAttributes;
const addAttr = addNodeAttribute;
const deleteAttr = (id) => request({ url: '/api/v2/kg/attr', method: 'DELETE', data: { id } });
const getRelationList = (params) => request({ url: '/api/v2/kg/relation', method: 'GET', params });

module.exports = {
  queryKnowledgeGraphic, addKnowledgeGraphicNode, deleteKnowledgeGraphicNode, updateKnowledgeGraphicNode,
  getProductNodes, getNodeByName, getNodeInfo, getNodeAttributes, addNodeAttribute, deleteNodeAttribute,
  addRelation, deleteRelation, updateRelation, getRelationByNodes,
  enableKnowledgeGraphic, disabledKnowledgeGraphic, getKnowledgeGraphicState, addKnowledgeGraphicToggleConfig,
  getKnowledgeGraphicForgetState, addKnowledgeGraphicForgetToggleConfig, knowledgeGraphicForgetToggle,
  getKnowledgeGraphicForgetEpoch, updateKnowledgeGraphicForgetEpoch,
  // backward compat
  getGraphicList, addGraphic, deleteGraphic, getNodeList, addNode, deleteNode, getAttrList, addAttr, deleteAttr, getRelationList,
};
