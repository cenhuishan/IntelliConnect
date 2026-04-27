Page({
  data: {
    productId: '',
    productName: '',
    menus: [
      { title: '物模型属性', icon: '📋', page: 'productData' },
      { title: '物模型功能', icon: '⚙️', page: 'productFunction' },
      { title: '物模型事件', icon: '🔔', page: 'productEvent' },
      { title: '角色配置', icon: '🎭', page: 'productRole' },
      { title: '路由设置', icon: '🔀', page: 'productRouterSet' },
      { title: 'Agent记忆', icon: '🧠', page: 'agentMemory' },
      { title: '长期记忆', icon: '💾', page: 'agentLongMemory' },
      { title: '知识库', icon: '📚', page: 'productKnowledge' },
      { title: 'MCP服务', icon: '🔌', page: 'productMcp' },
      { title: '技能管理', icon: '🎯', page: 'productSkills' },
      { title: 'ASR配置', icon: '🎤', page: 'productAsr' },
      { title: 'LLM模型', icon: '🤖', page: 'productLlmModel' },
      { title: 'OTA升级', icon: '📡', page: 'productOta' },
      { title: 'OTA被动升级', icon: '📥', page: 'productOtaPassive' },
      { title: '报警事件', icon: '⚠️', page: 'alarmEvent' }
    ]
  },

  onLoad(options) {
    const { productId, productName } = options;
    const name = decodeURIComponent(productName || '');
    this.setData({ productId, productName: name });
    wx.setNavigationBarTitle({ title: name + ' - 管理' });
  },

  onMenuTap(e) {
    const { page } = e.currentTarget.dataset;
    const { productId, productName } = this.data;
    wx.navigateTo({ url: `/pages/${page}/index?productId=${productId}&productName=${encodeURIComponent(productName)}` });
  }
});
