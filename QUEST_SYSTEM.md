# 任务系统实现文档

## 📜 概述

任务系统已成功集成到游戏中，提供完整的任务接受、进度追踪、奖励领取等功能。

## 🏗️ 架构设计

### 1. 核心文件结构

```
src/
├── interface/
│   └── quest.ts              # 任务相关类型定义
├── stores/
│   └── quest.ts              # 任务状态管理
├── data/
│   └── quests.ts             # 任务数据配置
└── components/views/
    └── QuestPanel.vue        # 任务面板组件
```

### 2. 类型系统

#### QuestType (任务类型)
- `Main` - 主线任务（推动剧情）
- `Side` - 支线任务（额外奖励）
- `Daily` - 日常任务（可重复）

#### QuestStatus (任务状态)
- `Locked` - 已锁定（未满足解锁条件）
- `Available` - 可接受（可以接取）
- `InProgress` - 进行中（已接受）
- `Completed` - 已完成（待领取奖励）
- `Claimed` - 已领取（任务结束）

#### QuestObjectiveType (任务目标类型)
- `Kill` - 击杀怪物
- `Collect` - 收集物品
- `Talk` - 与 NPC 交谈
- `Explore` - 探索场景
- `Purchase` - 购买物品
- `DefeatBoss` - 击败 Boss

## 🎮 功能特性

### 1. 任务面板 UI
- ✅ 固定右上角的任务按钮
- ✅ 分类标签页（可接受/进行中/可领取）
- ✅ 任务详情展示（名称、描述、目标、奖励）
- ✅ 一键接受/领取奖励
- ✅ 视觉化进度追踪

### 2. 自动进度更新
- ⚔️ **战斗胜利** - 自动更新击杀类任务
- 💬 **NPC 对话** - 自动更新交谈类任务
- 💰 **购买物品** - 自动更新购买类任务
- 🌿 **收集物品** - 需要手动调用 updateObjective

### 3. 任务系统集成

#### 与战斗系统集成
```typescript
// 在 BattleView 战斗结束时
const onBattleEnd = (result: any) => {
  if (result.victory && selectedMonster.value) {
    // 更新特定怪物击杀任务
    questStore.updateQuestsByTarget('kill', monsterId, 1);
    
    // 更新"任意怪物"任务（日常任务）
    questStore.updateQuestsByTarget('kill', 'any', 1);
  }
};
```

#### 与 NPC 系统集成
```typescript
// 选择 NPC 时自动更新交谈任务
const selectNPC = (npc: ICharacter) => {
  questStore.updateQuestsByTarget('talk', npc.id, 1);
  // ... 其他逻辑
};
```

#### 与商店系统集成
```typescript
// 购买物品时更新购买任务
const handlePurchase = (item: IItem) => {
  const result = playerStore.purchaseItem(item);
  if (result.success) {
    questStore.updateQuestsByTarget('purchase', item.id, 1);
  }
};
```

## 📝 使用指南

### 1. 创建新任务

在 `src/data/quests.ts` 中添加任务配置：

```typescript
{
  id: 'quest_new',
  name: '新任务名称',
  description: '任务描述',
  type: QuestType.Side,
  status: QuestStatus.Locked, // 初始状态
  objectives: [
    {
      id: 'obj_001',
      description: '任务目标描述',
      type: QuestObjectiveType.Kill,
      target: 'enemy_id', // 目标怪物/物品/NPC 的 ID
      current: 0,
      required: 5, // 需要完成 5 次
      completed: false,
    }
  ],
  rewards: [
    { type: 'exp', amount: 100 },
    { type: 'currency', amount: 50 },
    { type: 'item', id: 'item_id', amount: 2 }
  ],
  prerequisites: ['quest_001'], // 前置任务
  repeatable: false, // 是否可重复
}
```

### 2. 手动更新任务进度

```typescript
import { useQuestStore } from '@/stores/quest';

const questStore = useQuestStore();

// 方法 1: 更新特定目标的进度
questStore.updateObjective('quest_001', 'obj_001_1', 1);

// 方法 2: 批量更新同类型目标
questStore.updateQuestsByTarget('collect', 'item_id', 5);
```

### 3. 解锁任务

```typescript
// 当满足条件时解锁任务
questStore.unlockQuest('quest_002');
```

### 4. 检查任务是否可接受

```typescript
const canAccept = questStore.canAcceptQuest('quest_002');
if (canAccept) {
  questStore.acceptQuest('quest_002');
}
```

## 🔧 Store API 参考

### State
- `quests: IQuest[]` - 所有任务列表
- `activeQuestId: string | null` - 当前选中的任务 ID

### Getters
- `activeQuests` - 活跃任务（可接受 + 进行中）
- `availableQuests` - 可接受的任务
- `inProgressQuests` - 进行中的任务
- `completedQuests` - 已完成待领取的任务
- `currentQuest` - 当前选中的任务

### Actions
- `loadQuests(questData: IQuest[])` - 加载任务数据
- `acceptQuest(questId: string)` - 接受任务
- `updateObjective(questId, objectiveId, increment)` - 更新目标进度
- `updateQuestsByTarget(targetType, targetId, amount)` - 批量更新任务
- `claimReward(questId: string)` - 领取任务奖励
- `canAcceptQuest(questId: string)` - 检查任务是否可接受
- `unlockQuest(questId: string)` - 解锁任务
- `resetRepeatableQuest(questId: string)` - 重置可重复任务

## 🎯 示例任务流程

### 主线任务流程
```
1. 玩家进入场景 → 看到"初入仙界"任务（可接受状态）
2. 点击任务按钮 → 接受任务
3. 与接引仙人交谈 → 自动更新交谈进度
4. 任务完成 → 返回任务面板领取奖励
5. 获得 100 经验 + 50 灵石
```

### 支线任务流程
```
1. 完成"初入仙界"任务 → 解锁"除魔卫道"任务
2. 接受任务 → 前往场景寻找哥布林
3. 击败哥布林 ×3 → 自动更新击杀进度
4. 任务完成 → 领取奖励（物品 + 灵石 + 经验）
```

### 日常任务流程
```
1. 每天接受"日常修炼"任务
2. 击败任意怪物 ×5
3. 领取奖励
4. 第二天自动重置任务进度
```

## ⚠️ 注意事项

1. **ID 唯一性**: 确保任务 ID、目标 ID、怪物/物品/NPC ID 全局唯一
2. **前置任务**: 使用 prerequisites 数组定义任务依赖关系
3. **可重复任务**: 设置 `repeatable: true` 的任务会在领取奖励后重置
4. **自动更新**: 目前仅支持 kill/talk/purchase 类型的自动更新，collect 类型需要手动调用
5. **奖励发放**: 物品奖励会自动添加到背包，货币和直接增加属性

## 🚀 未来扩展

- [ ] 添加任务追踪功能（常驻显示在界面上）
- [ ] 支持任务分享（多人模式）
- [ ] 成就系统与任务关联
- [ ] 任务链系统（连续任务）
- [ ] 限时任务（倒计时机制）
- [ ] 任务难度分级（普通/困难/史诗）

## 📦 依赖关系

任务系统与以下现有系统无缝集成：
- ✅ Player Store（玩家数据）
- ✅ Battle System（战斗系统）
- ✅ Shop System（商店系统）
- ✅ Conversation System（对话系统）
- ✅ Scene System（场景系统）

---

**实现日期**: 2026-03-14  
**版本**: v1.0.0  
**作者**: AI Assistant
