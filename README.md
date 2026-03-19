# Dialogium - 飘邈之旅

`Dialogium` 是一个基于萧潜小说《飘邈之旅》世界观构建的文字类修真 RPG 项目，当前以前端交互叙事为核心，结合角色成长、场景探索、回合制战斗、任务推进、商店交易与本地存档，提供一个可在 **Web** 与 **Electron 桌面端** 运行的单机修真体验。

项目整体更偏向“**组件驱动的游戏界面**”而不是传统多页面站点：主流程由 `App.vue` 统一控制，通过不同视图组件切换“修为 / 历练 / 任务”等游戏状态。

## 项目特色

- **文字修真叙事**：围绕《飘邈之旅》世界观组织 NPC、场景、任务与装备内容
- **回合制战斗**：提供战斗校验、战斗日志、胜负判定与基础掉落逻辑
- **境界成长系统**：定义大境界与小层级，支持经验需求与境界名称映射
- **任务推进系统**：支持主线、支线、日常任务与多种目标类型
- **背包 / 装备系统**：角色属性、装备加成、物品实例与库存管理集中在 Store 中处理
- **本地持久化**：使用 `localStorage` 保存角色、背包、任务进度，并支持导入 / 导出 JSON 存档
- **双端运行**：同一套前端代码同时支持 Web 开发与 Electron 桌面打包

## 技术栈

### 前端框架

- **Vue 3**：采用 Composition API 构建游戏 UI
- **Pinia**：管理玩家状态、任务进度等全局数据
- **Vue Router**：已完成基础接入，目前业务流程主要仍由组件切换驱动
- **Vite**：本地开发、构建与资源处理

### 桌面端与工具链

- **Electron**：提供桌面端壳层与打包能力
- **electron-builder**：生成 macOS / Windows / Linux 安装产物
- **TypeScript**：提供类型约束
- **Tailwind CSS + PostCSS + Sass**：样式组织与界面开发

### 测试与质量工具

- **Vitest**：单元测试
- **Cypress**：E2E 测试
- **ESLint / Prettier / vue-tsc**：代码规范与类型检查

> 备注：项目中还引入了 `phaser` 依赖，但当前主玩法实现仍以 Vue 组件和文本交互为主。

## 运行环境

- Node.js `^20.19.0 || >=22.12.0`
- `pnpm`

安装依赖：

```bash
pnpm install
```

## 开发与构建

### Web 开发

```bash
pnpm dev
```

默认启动 Vite 开发服务器。

### Electron 桌面开发

```bash
pnpm dev:electron
```

该命令会并行启动 Vite 与 Electron，并通过 `VITE_DEV_SERVER_URL` 将本地页面载入桌面窗口。

### 构建 Web 版本

```bash
pnpm build
```

### Electron 打包

```bash
pnpm build:electron
```

按平台单独打包：

```bash
pnpm build:electron:mac
pnpm build:electron:win
pnpm build:electron:linux
```

### 常用检查命令

```bash
pnpm type-check
pnpm test:unit
pnpm test:e2e
pnpm lint
```

## 项目结构

```text
.
├── electron/                 # Electron 主进程配置
├── public/                   # 公共静态资源
├── src/
│   ├── assets/               # 图片、全局样式等资源
│   ├── components/           # 通用组件与游戏视图组件
│   ├── constants/            # 存储键、默认角色配置等常量
│   ├── data/                 # 静态数据配置（如任务数据）
│   ├── enums/                # 枚举定义（角色类型、修炼体系等）
│   ├── hooks/                # 组合式逻辑（如战斗流程封装）
│   ├── interface/            # 核心类型定义
│   ├── items/                # 消耗品、装备、材料配置
│   ├── npc/                  # NPC / 敌人等角色配置
│   ├── router/               # Router 基础配置
│   ├── scene/                # 场景与星域数据
│   ├── stores/               # Pinia 状态管理
│   ├── utils/                # 初始化、战斗、境界、存档等工具
│   ├── App.vue               # 游戏主容器
│   └── main.ts               # 应用入口
├── cypress/                  # E2E 测试
├── ELECTRON_GUIDE.md         # Electron 打包与开发说明
├── QUEST_SYSTEM.md           # 任务系统实现文档
└── README.md
```

## 核心模块说明

### 1. 应用入口与主流程

#### `src/main.ts`

- 创建 Vue 应用与 Pinia 实例
- 注册全局组件 `BorderContainer`
- 挂载 Router
- 在 `window` 上补充 `getUidId()`，兼容不支持 `crypto.randomUUID` 的环境

#### `src/App.vue`

- 作为整个游戏主界面容器
- 根据 `playerStore.isGameStarted` 切换开始界面与游戏主界面
- 用底部 Tab 切换 `CharacterPanel`、`SceneView`、`QuestView`
- 在挂载时检查 `localStorage`，自动识别是否已有存档

> 当前项目虽然接入了 `vue-router`，但核心玩法切换主要由 `App.vue` 中的状态和组件显隐控制，而不是复杂路由页面。

### 2. 视图层模块 `src/components/views`

- `StartView.vue`：开始界面，负责触发首轮游戏启动
- `SceneView.vue`：场景探索主视图，负责串联 NPC、战斗、商店等交互
- `BattleView.vue`：回合制战斗表现层
- `ConversationView.vue`：对话叙事与交互选择
- `ShopView.vue`：商店购买流程
- `CharacterPanel.vue`：人物属性、装备、背包等养成面板
- `QuestView.vue`：任务列表、领取奖励、任务切换
- `SystemView.vue`：预留系统面板（当前主流程中未启用）

### 3. 状态管理 `src/stores`

#### `src/stores/player.ts`

玩家核心状态中心，主要职责包括：

- 维护角色基础属性、经验、血量、灵力、货币等数据
- 管理背包物品、装备穿戴与属性结算
- 负责部分与成长、购买、掉落相关的数据操作
- 控制“游戏是否开始”等全局状态

#### `src/stores/quest.ts`

任务系统的状态中心，主要职责包括：

- 维护任务列表与当前激活任务
- 支持接取任务、推进目标、领取奖励、重置可重复任务
- 提供任务筛选 getter（可接受 / 进行中 / 已完成）
- 对接战斗、对话、购买等系统进行任务进度更新

### 4. 游戏内容数据层

#### `src/scene`

- 当前包含 `tianTingXing.ts`、`qianJieXing.ts` 等场景配置
- 负责定义星域 / 地点 / 场景探索内容，是“历练”模块的数据基础

#### `src/npc`

- 按地区与类别组织 NPC / 敌人数据
- 包含主线 NPC、区域 NPC、怪物敌人等内容
- 用于驱动对话、战斗、商店与任务目标识别

#### `src/items`

- 按 `consumable`、`equipment`、`material` 分类组织物品配置
- 作为背包展示、装备加成、掉落奖励与商店交易的数据来源

#### `src/data/quests.ts`

- 任务配置表
- 定义任务类型、目标、奖励、前置条件等静态内容

### 5. 核心工具模块 `src/utils`

#### `battle.ts`

- 提供 `simulateBattle()`：核心回合制战斗模拟
- 提供 `canFight()`：战前可战斗性校验
- 提供 `handleLootDrop()` / `handleBattleRewards()`：掉落与奖励处理
- 内置战斗事件文案生成，增强文本战斗表现

#### `levelManager.ts`

- 定义 11 个大境界及其等级区间
- 提供升级所需经验计算
- 提供境界显示文本格式化

#### `initialize.ts`

- 负责游戏初次启动时的本地数据初始化
- 初始化角色数据、初始背包与任务进度
- 避免在已有存档时覆盖玩家进度

#### `saveManager.ts`

- 导出当前本地存档为 JSON 文件
- 从 JSON 文件导入角色 / 背包 / 任务进度
- 提供重置游戏逻辑

### 6. 类型与常量层

#### `src/interface`

统一定义：

- 角色 `ICharacter`
- 物品 `IItem` / `IItemInstance`
- 对话、修炼、任务、场景等结构

这是项目内部数据建模的基础。

#### `src/constants/index.ts`

- 定义 `STORAGE_KEYS` 等本地持久化键名
- 定义默认玩家配置 `DEFAULT_PLAYER_CONFIG`
- 定义初始物品数据

#### `src/enums/index.ts`

- 定义角色类型枚举
- 定义修炼体系与境界枚举
- 提供部分境界展示映射

## 游戏主流程

当前项目的核心运行逻辑大致如下：

1. 用户打开应用，进入 `StartView`
2. 点击开始后初始化或读取本地存档
3. `App.vue` 切换到主界面
4. 玩家在底部 Tab 中切换：
   - `修为`：查看人物属性、装备与背包
   - `历练`：进入场景探索、对话、战斗、商店
   - `任务`：接取任务、查看进度、领取奖励
5. 战斗 / 对话 / 购买行为推动人物成长与任务进度更新
6. 角色、背包、任务数据通过 `localStorage` 持久化保存

## 数据持久化设计

项目当前采用轻量级本地存档方案：

- `PD`：玩家基础数据
- `PI`：背包物品数据
- `PQ`：任务进度数据

这些键名统一定义在 `src/constants/index.ts` 中，并通过：

- `initialize.ts` 完成首次初始化
- `stores` 负责日常读写
- `saveManager.ts` 负责导入 / 导出 / 重置

这种方式非常适合单机原型与桌面端轻量存档，但如果后续考虑云存档、多端同步或更复杂校验，可以进一步抽象为独立存档服务层。

## 文档补充

- `QUEST_SYSTEM.md`：任务系统详细设计、类型、API 与扩展说明
- `ELECTRON_GUIDE.md`：Electron 开发、图标准备、打包与故障排查说明

## 适合后续演进的方向

- 完善剧情主线与场景支线内容
- 增加更多星域、NPC、法宝、敌人和任务链
- 将战斗奖励与经验成长彻底接入完整数值体系
- 为 `SystemView` 增加设置、存档管理、音效等功能
- 增强 Electron 端文件存档能力，减少对 `localStorage` 的依赖
- 补齐单元测试与 E2E 覆盖，确保核心玩法稳定迭代

## 许可证

MIT License

---

**开发者**：Dialogium Team  
**原作基础**：《飘邈之旅》- 萧潜