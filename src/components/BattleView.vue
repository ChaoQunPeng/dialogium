<template>
  <div class="mud-game-wrapper">
    <BorderContainer v-if="!isInBattle" title="当前场景：荒野林径">
      <div class="scene-description">你环顾四周，林中迷雾缭绕，远处隐约传来阵阵低吼...</div>
      <div class="enemy-list">
        <div class="enemy-item">
          <span class="m-info">
            <span class="red">【怪物】</span>
            <span class="bold">{{ enemy.name }}</span>
            <span class="gray">(等级: {{ enemy.baseInfo.level }})</span>
          </span>
          <span class="cmd-btn" @click="battleEnemy">[ 尝试挑战 ]</span>
        </div>
      </div>
      <div class="battle-controls" v-if="showCloseButton">
        <button class="close-button" @click="$emit('close')">关闭战斗</button>
      </div>
    </BorderContainer>

    <div v-else class="battle-scene">
      <BorderContainer :title="`正在与 ${enemy.name} 厮杀 (回合 ${currentTurns || 1})`">
        <div class="battle-stage-horizontal">
          <div class="unit-panel">
            <div class="u-header">
              <span class="yellow bold">{{ player.name }}</span>
              <span class="gray">LV.{{ player.baseInfo.level || 1 }}</span>
            </div>
            <div class="hp-line">
              <div class="bar-wrap">
                <div
                  class="bar green-bg"
                  :style="{
                    width: (player.baseInfo.hp / playerStore.finalStats.maxHp) * 100 + '%',
                  }"
                ></div>
              </div>
              <div class="hp-val">{{ player.baseInfo.hp }}/{{ playerStore.finalStats.maxHp }}</div>
            </div>
            <div class="u-footer">
              攻:{{ playerStore.finalStats.attack }} 防:{{ playerStore.finalStats.defense }}
            </div>
          </div>

          <div class="vs-divider">VS</div>

          <div class="unit-panel text-right">
            <div class="u-header">
              <span class="gray">LV.{{ enemy.baseInfo.level }}</span>
              <span class="red bold">{{ enemy.name }}</span>
            </div>
            <div class="hp-line">
              <div class="bar-wrap">
                <div
                  class="bar red-bg"
                  :style="{ width: (enemy.baseInfo.hp / enemy.baseInfo.maxHp) * 100 + '%' }"
                ></div>
              </div>
              <div class="hp-val">{{ enemy.baseInfo.hp }}/{{ enemy.baseInfo.maxHp }}</div>
            </div>
            <div class="u-footer">攻:{{ enemy.battle?.attack }} 防:{{ enemy.battle?.defense }}</div>
          </div>
        </div>

        <div class="battle-actions">
          <template v-if="battleStatus === 'fighting'">
            <span class="blink-text">刀光剑影中...</span>
          </template>
          <template v-else-if="battleStatus === 'finished'">
            <!-- 显示战斗奖励 -->
            <div v-if="battleRewards" class="battle-rewards">
              <div v-if="battleRewards.expGained > 0" class="reward-item">
                ✨ 获得经验: {{ battleRewards.expGained }} 点
              </div>
              <div
                v-for="(item, index) in battleRewards.droppedItems"
                :key="index"
                class="reward-item"
              >
                🎉 获得物品: {{ item.name }} x{{ item.count }}
              </div>
            </div>
            <div class="battle-actions-finished">
              <span class="cmd-btn" @click="rematchBattle">[ 再次挑战 ]</span>
              <span class="cmd-btn" @click="quitBattle">[ 离开战场 ]</span>
            </div>
          </template>
        </div>
      </BorderContainer>

      <BorderContainer title="战斗记录">
        <div class="log-list">
          <TransitionGroup name="log-slide">
            <div
              v-for="(log, index) in battleLogs"
              :key="battleLogs.length - index"
              class="log-item"
            >
              <span class="log-turn">[{{ battleLogs.length - index }}]</span>
              <span
                :class="[
                  'log-msg',
                  {
                    'system-msg':
                      log.includes('🏁') ||
                      log.includes('💀') ||
                      log.includes('🎉') ||
                      log.includes('✨'),
                  },
                ]"
              >
                {{ log }}
              </span>
            </div>
          </TransitionGroup>
          <div v-if="battleLogs.length === 0" class="empty-text">
            --- 双方凝视对方，战斗一触即发 ---
          </div>
        </div>
      </BorderContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';
import { canFight } from '@/utils/battle';
import type { ICharacter } from '@/interface/character';
import BorderContainer from './borderContainer.vue';

// 重新导入store以刷新类型
const playerStore = usePlayerStore();
const { player, acquireItem } = playerStore;

// 定义props
const props = defineProps<{
  enemy: ICharacter;
  showCloseButton?: boolean;
}>();

// 定义emits
const emit = defineEmits<{
  (e: 'battleEnd', result: any): void;
  (e: 'close'): void;
}>();

// 状态管理
const { startBattle, currentTurns, battleStatus, battleRewards } = useBattle();

const isInBattle = ref(false);
const battleLogs = ref<string[]>([]);

// 创建怪物的响应式副本
const enemy = reactive({
  ...props.enemy,
  baseInfo: { ...props.enemy.baseInfo, hp: props.enemy.baseInfo.maxHp },
});

console.log(`enemy`, enemy);

// 监听props变化，重置怪物血量
watch(
  () => props.enemy,
  (newMonster) => {
    Object.assign(enemy, {
      ...newMonster,
      baseInfo: { ...newMonster.baseInfo, hp: newMonster.baseInfo.maxHp },
    });
  },
  { deep: true },
);

// 选择怪物并开始战斗
const battleEnemy = () => {
  const check = canFight(playerStore.finalPlayer, enemy);
  if (!check.canFight) {
    alert(check.reason);
    return;
  }

  // 1. 切换场景
  isInBattle.value = true;
  battleLogs.value = [];

  // 2. 延迟一点点触发战斗，增加"切入"感
  setTimeout(() => {
    startBattle(playerStore.finalPlayer, enemy, {
      delay: 500,
      onTurn: (event) => {
        console.log(event);

        playerStore.setHp(event.attackerHp);
        enemy.baseInfo.hp = event.defenderHp;

        battleLogs.value.unshift(event.msg);
      },
      onFinish: (result) => {
        // playerStore.updateHp(result.finalAttackerHp);
        // enemy.baseInfo.hp = result.finalDefenderHp;

        console.log(`battleRewards`, battleRewards);

        // 如果玩家获胜，将获得的物品添加到背包
        if (result.winner?.id === player.id && battleRewards.value) {
          // 将掉落物品添加到玩家背包
          const itemsToAdd = battleRewards.value.droppedItems.map((item) => ({
            itemId: item.id,
            count: item.count!,
          }));

          if (itemsToAdd.length > 0) {
            acquireItem(itemsToAdd);
          }

          playerStore.gainExp(result.loser?.battle?.exp ?? 0);
        }

        battleStatus.value = 'finished';

        // 发射战斗结束事件，但不自动退出战斗场景
        emit('battleEnd', result);
      },
    });
  }, 1000);
};

// 离开战场
const quitBattle = () => {
  isInBattle.value = false;
  battleStatus.value = 'idle';
  battleRewards.value = null;
  // 重置怪物血量
  enemy.baseInfo.hp = props.enemy.baseInfo.maxHp;
  // 发射关闭事件
  emit('close');
};

// 再次挑战
const rematchBattle = () => {
  // 重置战斗状态
  battleStatus.value = 'idle';
  battleRewards.value = null;
  currentTurns.value = 0;
  battleLogs.value = [];

  // 重置双方血量
  enemy.baseInfo.hp = props.enemy.baseInfo.maxHp;

  // 延迟一点时间后重新开始战斗
  setTimeout(() => {
    battleEnemy();
  }, 500);
};
</script>

<style lang="scss" scoped>
.mud-game-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  width: 100%;
}

/* 场景探索样式 */
.scene-description {
  color: var(--color-gray);
  font-style: italic;
  margin-bottom: 12px;
  font-size: 0.95em;
}

.enemy-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed #444;
  .m-info {
    display: flex;
    gap: 8px;
  }
}

.battle-controls {
  margin-top: 16px;
  text-align: center;

  .close-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #666;
    color: var(--color-gray);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: var(--color-cyan);
      color: var(--color-cyan);
    }
  }
}

/* 水平战斗对峙区 */
.battle-stage-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  .unit-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .u-header {
      display: flex;
      gap: 10px;
      font-size: 0.95em;
    }

    .u-footer {
      font-size: 0.8em;
      color: var(--color-gray);
    }

    &.text-right {
      align-items: flex-end;
      .hp-line {
        flex-direction: row-reverse;
      }
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
}

/* 血条样式 */
.hp-line {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  .bar-wrap {
    flex: 1;
    height: 8px;
    background: #111;
    border: 1px solid #333;
    .bar {
      height: 100%;
      transition: width 0.4s ease;
    }
  }
  .hp-val {
    font-size: 0.8em;
    font-family: monospace;
    min-width: 60px;
  }
}

/* 战斗奖励样式 */
.battle-rewards {
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--color-green);
  border-radius: 4px;

  .reward-item {
    margin-bottom: 5px;
    font-size: 0.9em;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 状态颜色 */
.green-bg {
  background-color: var(--color-green);
}
.red-bg {
  background-color: var(--color-red);
}
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

/* 交互 */
.battle-actions {
  text-align: center;
  padding: 10px 0;
  .blink-text {
    color: var(--color-yellow);
    animation: blink 1s infinite;
  }
}

/* 战斗结束按钮组 */
.battle-actions-finished {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px 0;

  .cmd-btn {
    padding: 8px 16px;
    border: 1px solid var(--color-cyan);
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(0, 255, 255, 0.1);
      border-color: var(--color-yellow);
      color: var(--color-yellow);
    }
  }
}

.cmd-btn {
  color: var(--color-cyan);
  cursor: pointer;
  &:hover {
    color: var(--color-yellow);
    text-decoration: underline;
  }
}

/* 日志列表动画 */
.log-list {
  max-height: 260px;
  overflow-y: auto;
  .log-item {
    margin-bottom: 8px;
    font-size: 0.9em;
    display: flex;
    gap: 10px;
    .log-turn {
      color: var(--color-gray);
      min-width: 30px;
    }
    .system-msg {
      color: var(--color-yellow);
      font-weight: bold;
    }
  }
}

.log-slide-enter-active {
  transition: all 0.3s ease;
}
.log-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
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
