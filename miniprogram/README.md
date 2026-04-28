# 创万联 IoT — 微信小程序

本目录包含 IntelliConnect 平台的微信小程序前端，与后端 `/api/wx/v1` 接口配合使用。

## 功能模块

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/index` | 产品/设备数量概览，快捷导航 |
| 产品管理 | `pages/products` | 绑定/解绑产品，切换当前激活产品 |
| 设备列表 | `pages/devices` | 查看激活产品下所有设备及在线状态 |
| 设备数据 | `pages/deviceData` | 查询设备历史属性数据，支持时间筛选 |
| 事件告警 | `pages/alarms` | 下拉刷新查看所有绑定产品的告警事件 |
| AI 助手 | `pages/chat` | 与 AI 智能体对话，支持设备控制和问答 |
| **知识图谱** | `pages/knowledgeGraph` | 查看/管理激活产品的知识图谱（节点、属性、关系） |
| 登录 | `pages/login` | 微信静默登录（仅在 token 失效时触发） |

## 快速开始

### 1. 配置后端地址

编辑 `utils/constants.js`，将 `BASE_URL` 替换为你的后端服务地址：

```js
const BASE_URL = 'https://your-backend-host'
```

### 2. 配置小程序 AppID

编辑 `project.config.json`，将 `appid` 替换为你在微信公众平台申请的小程序 AppID：

```json
{
  "appid": "wx_your_appid_here"
}
```

同时在后端 `application.yaml` 中配置对应的 `wx.micro.appid` 和 `wx.micro.appsecret`：

```yaml
wx:
  micro:
    appid: wx_your_appid_here
    appsecret: your_appsecret_here
```

### 3. 使用微信开发者工具打开

1. 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 点击「导入项目」，选择本 `miniprogram/` 目录
3. 填入你的 AppID，点击确认

### 4. 用户注册

小程序用户首次使用需先完成注册（调用 `/wxRegister` 或通过关联的公众号流程），之后静默登录即可获取 JWT。

## API 接口对照

| 功能 | 接口 | 方法 |
|------|------|------|
| 列出绑定产品 | `/api/wx/v1/wxMyProducts` | GET |
| 获取激活产品 | `/api/wx/v1/wxActiveProduct` | GET |
| 设置激活产品 | `/api/wx/v1/wxActiveProduct` | POST |
| 产品基础信息 | `/api/wx/v1/wxProductInfo` | GET |
| 产品物模型 | `/api/wx/v1/wxProductModel` | GET |
| 设备列表 | `/api/wx/v1/wxProductDevices` | GET |
| 设备历史数据 | `/api/wx/v1/wxDeviceData` | GET |
| 事件数据定义 | `/api/wx/v1/wxEventData` | GET |
| 告警事件 | `/api/wx/v1/wxAlarmEvents` | GET |
| AI 对话 | `/api/wx/v1/wxChat` | POST |
| **知识图谱（完整）** | `/api/wx/v1/kg/graphic` | GET |
| **节点列表** | `/api/wx/v1/kg/nodes` | GET |
| **获取节点** | `/api/wx/v1/kg/node?name=` | GET |
| **添加节点** | `/api/wx/v1/kg/node` | POST |
| **更新节点** | `/api/wx/v1/kg/node` | PUT |
| **删除节点** | `/api/wx/v1/kg/node` | DELETE |
| **获取节点属性** | `/api/wx/v1/kg/attr?nodeId=` | GET |
| **添加属性** | `/api/wx/v1/kg/attr` | POST |
| **更新属性** | `/api/wx/v1/kg/attr` | PUT |
| **删除属性** | `/api/wx/v1/kg/attr` | DELETE |
| **获取节点关系** | `/api/wx/v1/kg/relation?nodeId=` | GET |
| **添加关系** | `/api/wx/v1/kg/relation` | POST |
| **更新关系** | `/api/wx/v1/kg/relation` | PUT |
| **删除关系** | `/api/wx/v1/kg/relation` | DELETE |

## 目录结构

```
miniprogram/
├── app.js              # App 生命周期，静默登录
├── app.json            # 全局配置（tabBar、页面列表）
├── app.wxss            # 全局样式
├── project.config.json # 微信开发者工具配置
├── sitemap.json        # 页面索引配置
├── utils/
│   ├── constants.js    # BASE_URL 等全局常量
│   ├── request.js      # HTTP 请求封装，自动注入 JWT
│   └── auth.js         # 微信登录流程
├── api/
│   ├── product.js         # 产品相关接口
│   ├── device.js          # 设备相关接口
│   ├── alarm.js           # 告警接口
│   ├── chat.js            # AI 对话接口
│   └── knowledgeGraph.js  # 知识图谱接口
├── pages/
│   ├── index/             # 首页
│   ├── products/          # 产品管理
│   ├── devices/           # 设备列表
│   ├── deviceData/        # 设备数据图表
│   ├── alarms/            # 事件告警
│   ├── chat/              # AI 助手
│   ├── knowledgeGraph/    # 知识图谱（节点/属性/关系管理）
│   └── login/             # 登录页
└── components/
    ├── product-card/   # 产品卡片组件
    ├── device-item/    # 设备列表项组件
    └── alarm-item/     # 告警列表项组件
```

## 注意事项

- Tab bar 图标文件请放置于 `assets/icons/` 目录（`home.png`、`product.png`、`device.png`、`alarm.png`、`chat.png` 及对应 `-active` 版本）
- 设备数据页面 (`deviceData`) 当前使用表格展示数据；如需折线图，可集成 [ec-canvas](https://github.com/ecomfe/wx-f2) 或 [wx-charts](https://github.com/xiaolin3303/wx-charts)
- 所有接口均要求 `Authorization: Bearer <token>` 请求头，由 `utils/request.js` 自动注入
