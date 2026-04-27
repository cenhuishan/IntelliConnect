Page({
  data: {
    version: '1.8.0',
    features: [
      '🤖 AI智能体能力，支持多种大模型',
      '🔌 MCP协议支持，可扩展智能体能力',
      '📚 知识库RAG技术',
      '🎤 语音识别ASR与语音合成TTS',
      '📡 完善的物联网协议支持',
      '�� 物模型抽象（属性/功能/事件）',
      '📥 OTA固件升级管理',
      '🕸️ 原生知识图谱'
    ]
  },

  onCopyLink() {
    wx.setClipboardData({
      data: 'https://github.com/ruanrongman/IntelliConnect',
      success() {
        wx.showToast({ title: '链接已复制', icon: 'success' });
      }
    });
  }
});
