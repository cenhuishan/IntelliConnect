const { request } = require('../utils/request');

const getGraphicList = (params) => request({ url: '/api/v2/kg/graphic', method: 'GET', params });
const addGraphic = (data) => request({ url: '/api/v2/kg/graphic', method: 'POST', data });
const deleteGraphic = (id) => request({ url: '/api/v2/kg/graphic', method: 'DELETE', data: { id } });
const getNodeList = (params) => request({ url: '/api/v2/kg/node', method: 'GET', params });
const addNode = (data) => request({ url: '/api/v2/kg/node', method: 'POST', data });
const deleteNode = (id) => request({ url: '/api/v2/kg/node', method: 'DELETE', data: { id } });
const getAttrList = (params) => request({ url: '/api/v2/kg/attr', method: 'GET', params });
const addAttr = (data) => request({ url: '/api/v2/kg/attr', method: 'POST', data });
const deleteAttr = (id) => request({ url: '/api/v2/kg/attr', method: 'DELETE', data: { id } });
const getRelationList = (params) => request({ url: '/api/v2/kg/relation', method: 'GET', params });
const addRelation = (data) => request({ url: '/api/v2/kg/relation', method: 'POST', data });
const deleteRelation = (id) => request({ url: '/api/v2/kg/relation', method: 'DELETE', data: { id } });

module.exports = { getGraphicList, addGraphic, deleteGraphic, getNodeList, addNode, deleteNode, getAttrList, addAttr, deleteAttr, getRelationList, addRelation, deleteRelation };
