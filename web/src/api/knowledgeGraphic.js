import request from '@/utils/request';
import store from "@/store";

const getToken = () => store.getters['auth/token']

export const queryKnowledgeGraphic = (params) => request({
    url: "/api/v2/kg/graphic",
    method: "get",
    params: params,
    headers: {
        'Authorization': getToken()
    }
})

export const addKnowledgeGraphicNode = (data) => request({
    url: "/api/v2/kg/node",
    method: "post",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const deleteKnowledgeGraphicNode = (data) => request({
    url: "/api/v2/kg/node",
    method: "delete",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const updateKnowledgeGraphicNode = (data) => request({
    url: "/api/v2/kg/node",
    method: "put",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const getProductNodes = (params) => request({
    url: "/api/v2/kg/nodes",
    method: "get",
    params,
    headers: {
        'Authorization': getToken()
    }
})

export const getNodeByName = (params) => request({
    url: "/api/v2/kg/node",
    method: "get",
    params,
    headers: {
        'Authorization': getToken()
    }
})

export const getNodeInfo = (params) => request({
    url: "/api/v2/kg/node",
    method: "get",
    params,
    headers: {
        'Authorization': getToken()
    }
})

export const getNodeAttributes = (params) => request({
    url: "/api/v2/kg/attr",
    method: "get",
    params,
    headers: {
        'Authorization': getToken()
    }
})

export const addNodeAttribute = (data) => request({
    url: "/api/v2/kg/attr",
    method: "post",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const deleteNodeAttribute = (data) => request({
    url: "/api/v2/kg/attr",
    method: "delete",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const addRelation = (data) => request({
    url: "/api/v2/kg/relation",
    method: "post",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const deleteRelation = (data) => request({
    url: "/api/v2/kg/relation",
    method: "delete",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const updateRelation = (data) => request({
    url: "/api/v2/kg/relation",
    method: "put",
    data,
    headers: {
        'Authorization': getToken()
    }
})

export const getRelationByNodes = (params) => request({
    url: "/api/v2/kg/relationByNodes",
    method: "get",
    params,
    headers: {
        'Authorization': getToken()
    }
})

export const enableKnowledgeGraphic = (params) =>
  request({
    url: '/api/v2/user/config',
    method: 'put',
    data: {
      ...params,
      name: 'knowledge_graph.toggle',
      type: 'boolean',
      value: 'true',
      defaultValue: 'false',
      required: true,
      des: 'Knowledge graph toggle',
    },
    headers: {
      Authorization: getToken(),
    },
  })

export const disabledKnowledgeGraphic = (params) =>
  request({
    url: '/api/v2/user/config',
    method: 'put',
    data: {
      ...params,
      name: 'knowledge_graph.toggle',
      type: 'boolean',
      value: 'false',
      defaultValue: 'false',
      required: true,
      des: 'Knowledge graph toggle',
    },
    headers: {
      Authorization: getToken(),
    },
  })

export const getKnowledgeGraphicState = (params) =>
  request({
    url: '/api/v2/user/config/knowledge_graph.toggle',
    method: 'get',
    params,
    headers: {
      Authorization: getToken(),
    },
  })

export const addKnowledgeGraphicToggleConfig = (data) => request({
  url: '/api/v2/user/config',
  method: 'post',
  data:{
    ...data,
    name: 'knowledge_graph.toggle',
    type: "boolean",
    value: "false",
    defaultValue: "false",
    required: true,
    des: "Knowledge graph toggle"
  },
  headers: {
    Authorization: getToken()
  },
})

export const getKnowledgeGraphicForgetState = (params) =>
  request({
    url: '/api/v2/user/config/knowledge_graph.forget.toggle',
    method: 'get',
    params,
    headers: {
      Authorization: getToken(),
    },
  })

export const addKnowledgeGraphicForgetToggleConfig = (data) =>
  request({
    url: '/api/v2/user/config',
    method: 'post',
    data: {
      ...data,
      name: 'knowledge_graph.forget.toggle',
      type: 'boolean',
      value: 'false',
      defaultValue: 'false',
      required: true,
      des: 'Knowledge graph forget toggle',
    },
    headers: {
      Authorization: getToken(),
    },
  })

export const knowledgeGraphicForgetToggle = (data) =>
  request({
    url: '/api/v2/user/config',
    method: 'put',
    data: {
      ...data,
      name: 'knowledge_graph.forget.toggle',
      type: 'boolean',
      defaultValue: 'false',
      required: true,
      des: 'Knowledge graph forget toggle',
    },
    headers: {
      Authorization: getToken(),
    },
  })

export const getKnowledgeGraphicForgetEpoch = (params) =>
  request({
    url: '/api/v2/user/config/knowledge_graph.forget.epoch',
    method: 'get',
    params,
    headers: {
      Authorization: getToken(),
    },
  })

export const updateKnowledgeGraphicForgetEpoch = (data) =>
  request({
    url: '/api/v2/user/config',
    method: 'put',
    data: {
      ...data,
      name: 'knowledge_graph.forget.epoch',
      type: 'integer',
      defaultValue: '10',
      required: false,
      des: 'Knowledge graph forget epoch',
    },
    headers: {
      Authorization: getToken(),
    },
  })