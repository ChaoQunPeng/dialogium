# Dialogium - 文字修仙游戏

一款基于 Vue 3 + TypeScript 的剧情驱动文字类修仙游戏。

## 🎮 核心特性

- **沉浸式剧情体验**：丰富的对话系统和剧情推进
- **修真体系**：完整的境界修炼机制
- **装备系统**：多样化的法宝装备
- **战斗系统**：策略性回合制战斗
- **角色成长**：属性提升与境界突破

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

## 📁 项目结构

```
src/
├── components/          # UI 组件
│   ├── TypeWriter/     # 打字机效果组件
│   ├── scene/         # 场景相关组件
│   └── CharacterPanel.vue # 角色面板组件
├── enums/             # 枚举定义
├── hooks/             # 自定义 Hooks
├── interface/         # TypeScript 接口
├── items/             # 物品配置
├── router/            # 路由配置
├── scene/             # 场景数据
├── stores/            # 状态管理
├── utils/             # 工具函数
└── main.ts           # 应用入口
```

## 🔧 核心功能

### 角色数据初始化

项目提供了完整的角色数据初始化系统：

```typescript
import { initializeGame, initializeCharacterData } from './utils/initialize';

// 完整初始化（推荐）
const player = initializeGame();

// 仅初始化角色数据
const character = initializeCharacterData();
```

#### 初始化包含的内容：

1. **基础属性**
   - 生命值、法力值
   - 等级、经验
   - 攻击力、防御力

2. **修真境界**
   - 默认境界：炼气期
   - 支持多种修炼路径（修真、修仙、修魔、修神）

3. **初始装备**
   - 紫炎心（核心至宝）
   - 满天星套装（全套仙甲）

4. **对话系统**
   - 预设角色台词
   - 权重随机机制

### 数据持久化

所有角色数据都会自动保存到 LocalStorage：
- `PMZL_PLAYER_DATA`：角色基础信息
- `PMZL_PLAYER_ITEMS`：背包物品数据

### 状态管理

使用 Pinia 进行状态管理：

```typescript
import { usePlayerStore } from './stores/player';

const playerStore = usePlayerStore();
const { player, inventory } = playerStore;
```

## 🎯 开发规范

### TypeScript 类型安全
- 所有接口都有详细注释
- 严格类型检查
- 联合类型合理使用

### 组件开发
- 单文件组件 (SFC)
- Composition API
- 响应式数据管理

### 代码质量
- ESLint + Prettier
- TypeScript 严格模式
- 单元测试覆盖率

## 🧪 测试

### 单元测试
```bash
pnpm test:unit
```

### E2E 测试
```bash
pnpm test:e2e
```

## 📖 文档

详细的开发文档请参考：
- [接口设计规范](./docs/interfaces.md)
- [枚举使用指南](./docs/enums.md)
- [状态管理说明](./docs/state-management.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License