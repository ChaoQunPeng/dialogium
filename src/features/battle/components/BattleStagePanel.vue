<!-- 战斗舞台面板 - 展示战斗双方状态和战斗结果 -->
<template>
  <BaseBorderContainer :title="`正在与 ${enemy.name} 厮杀 (回合 ${currentTurns || 1})`">
    <div class="battle-stage-horizontal">
      <div class="unit-panel">
        <div class="u-header">
          <span class="yellow bold">{{ player.name }}</span>
          <span class="gray">LV.{{ player.baseInfo.level || 1 }}</span>
        </div>
        <div class="hp-line">
          <div class="bar-wrap">
            <div class="bar green-bg" :style="{ width: (player.baseInfo.hp / playerStats.maxHp) * 100 + '%' }"></div>
          </div>
          <div class="hp-val">{{ player.baseInfo.hp }}/{{ playerStats.maxHp }}</div>
        </div>
        <div class="u-footer">攻:{{ playerStats.attack }} 防:{{ playerStats.defense }}</div>
      </div>

      <div class="vs-divider">VS</div>

      <div class="unit-panel text-right">
        <div class="u-header">
          <span class="gray">LV.{{ enemy.baseInfo.level }}</span>
          <span class="red bold">{{ enemy.name }}</span>
        </div>
        <div class="hp-line">
          <div class="bar-wrap">
            <div class="bar red-bg" :style="{ width: (enemy.baseInfo.hp / enemy.baseInfo.maxHp) * 100 + '%' }"></div>
          </div>
          <div class="hp-val">{{ enemy.baseInfo.hp }}/{{ enemy.baseInfo.maxHp }}</div>
        </div>
        <div class="u-footer">攻:{{ enemy.battle?.attack ?? 0 }} 防:{{ enemy.battle?.defense ?? 0 }}</div>
      </div>
    </div>

    <div class="battle-actions">
      <template v-if="battleStatus === 'fighting'">
        <span class="blink-text">刀光剑影中...</span>
      </template>

      <template v-else-if="battleStatus === 'finished'">
        <div v-if="battleRewards" class="battle-rewards">
          <div v-if="battleRewards.expGained > 0" class="reward-item">
            ✨ 获得经验：<span class="highlight">{{ battleRewards.expGained }}</span> 点
          </div>
          <div v-for="(item, index) in battleRewards.droppedItems" :key="index" class="reward-item">
            🎉 获得物品：<span class="highlight">{{ item.name }}</span> x{{ item.count }}
          </div>
        </div>

        <div class="battle-actions-finished">
          <button class="action-btn" @click="$emit('rematch')">再次挑战</button>
          <button class="action-btn" @click="$emit('quit')">离开战场</button>
        </div>
      </template>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import type { ICharacter } from '@/interface/character';
import type { IBattleReward } from '@/utils/battle';

// ==================== Props & Emits ====================

// 组件属性：玩家、玩家属性、敌人、回合数、战斗状态、奖励
defineProps<{
  player: ICharacter;
  playerStats: {
    attack: number;
    defense: number;
    maxHp: number;
    maxMp: number;
  };
  enemy: ICharacter;
  currentTurns: number;
  battleStatus: 'idle' | 'fighting' | 'finished';
  battleRewards: IBattleReward | null;
}>();

// 组件事件：再次挑战、离开战场
defineEmits<{
  (e: 'rematch'): void;
  (e: 'quit'): void;
}>();
</script>

<style lang="scss" scoped>
.battle-stage-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.unit-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.u-header {
  display: flex;
  gap: 10px;
  font-size: 0.95em;
}

.u-footer {
  font-size: 0.8em;
  color: var(--color-gray);
}

.text-right {
  align-items: flex-end;

  .hp-line {
    flex-direction: row-reverse;
  }
}

.vs-divider {
  padding: 0 20px;
  color: var(--color-red);
  font-weight: bold;
  font-style: italic;
  font-size: 1.2em;
  opacity: 0.6;
}

.hp-line {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.bar-wrap {
  flex: 1;
  height: 8px;
  background: #111;
  border: 1px solid #333;
}

.bar {
  height: 100%;
  transition: width 0.4s ease;
}

.hp-val {
  font-size: 0.8em;
  font-family: monospace;
  min-width: 60px;
}

.battle-actions {
  text-align: center;
}

.blink-text {
  color: var(--color-yellow);
  animation: blink 1s infinite;
}

.battle-rewards {
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--color-green);
  border-radius: 4px;
}

.reward-item {
  margin-bottom: 5px;
  font-size: 0.9em;
  color: var(--color-gray);
}

.highlight,
.yellow {
  color: var(--color-yellow);
}

.red {
  color: var(--color-red);
}

.gray {
  color: var(--color-gray);
}

.bold {
  font-weight: bold;
}

.green-bg {
  background-color: var(--color-green);
}

.red-bg {
  background-color: var(--color-red);
}

.battle-actions-finished {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 15px 0;
}

.action-btn {
  min-width: 120px;
  padding: 10px 24px;
  font-size: 0.95em;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>