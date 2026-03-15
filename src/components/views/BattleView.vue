<template>
  <div class="mud-game-wrapper">
    <BaseBorderContainer v-if="!isInBattle" :title="`当前场景：${sceneName || '荒野林径'}`">
      <!-- 敌人详细信息面板 -->
      <div class="enemy-detail-panel">
        <div class="enemy-header">
          <span class="enemy-name">{{ enemy.name }}</span>
          <span class="enemy-level gray">LV.{{ enemy.baseInfo.level }}</span>
        </div>

        <div class="enemy-description-section mb-3">
          <p class="desc-text">{{ enemy.introduction }}</p>
        </div>

        <div class="enemy-stats-simple">
          <div class="stat-item">
            <span class="stat-label">生命值</span>
            <span class="stat-value">{{ enemy.baseInfo.maxHp }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">法力值</span>
            <span class="stat-value">{{ enemy.baseInfo.maxMp }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">攻击力</span>
            <span class="stat-value red">{{ enemy.battle?.attack ?? 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">防御力</span>
            <span class="stat-value yellow">{{ enemy.battle?.defense ?? 0 }}</span>
          </div>
        </div>

        <div class="enemy-rewards-section">
          <div class="section-title">📦 击败奖励</div>
          <div class="reward-info">
            <span class="exp-icon">✨</span>
            <span class="exp-text"
              >经验值：<span class="highlight">{{ enemy.battle?.exp ?? 0 }}</span> 点</span
            >
          </div>
        </div>

        <div
          class="enemy-drops-section"
          v-if="enemy.battle?.dropList && enemy.battle.dropList.length > 0"
        >
          <div class="section-title">🎁 可能掉落</div>
          <div class="drop-list">
            <div v-for="(dropId, index) in enemy.battle.dropList" :key="index" class="drop-item">
              <span class="drop-icon">📦</span>
              <span class="drop-name">{{ getDropItemName(dropId) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="battle-actions-group">
        <button class="action-btn btn-challenge" @click="battleEnemy">[ 战斗 ]</button>
        <button v-if="showCloseButton" class="action-btn btn-close" @click="$emit('close')">
          返回
        </button>
      </div>
    </BaseBorderContainer>

    <div v-else class="battle-scene">
      <BaseBorderContainer :title="`正在与 ${enemy.name} 厮杀 (回合 ${currentTurns || 1})`">
        <!-- 战斗对峙界面 -->
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
                ✨ 获得经验：<span class="highlight">{{ battleRewards.expGained }}</span> 点
              </div>
              <div
                v-for="(item, index) in battleRewards.droppedItems"
                :key="index"
                class="reward-item"
              >
                🎉 获得物品：<span class="highlight">{{ item.name }}</span> x{{ item.count }}
              </div>
            </div>
            <div class="battle-actions-finished">
              <button class="action-btn" @click="rematchBattle">再次挑战</button>
              <button class="action-btn" @click="quitBattle">离开战场</button>
            </div>
          </template>
        </div>
      </BaseBorderContainer>

      <BaseBorderContainer title="战斗记录">
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
      </BaseBorderContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';
import { canFight } from '@/utils/battle';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import { items } from '@/items';
import BaseBorderContainer from '../common/BaseBorderContainer.vue';
import { useQuestStore } from '@/stores/quest';

// 重新导入store以刷新类型
const playerStore = usePlayerStore();
const { player, acquireItem } = playerStore;

const questStore = useQuestStore();

// 定义props
const props = defineProps<{
  enemy: ICharacter;
  sceneName?: string; // 场景名称
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
  // const check = canFight(playerStore.finalPlayer, enemy);
  // if (!check.canFight) {
  //   alert(check.reason);
  //   return;
  // }

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
          questStore.updateQuestsByTarget('kill', 'any', 1);
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

// 获取掉落物品名称
const getDropItemName = (dropId: string): string => {
  const item = items[dropId] as IItem | undefined;
  return item?.name || dropId;
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

/* 敌人详细信息面板 */
.enemy-detail-panel {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;

  .enemy-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;

    .enemy-name {
      color: var(--color-yellow);
      font-weight: bold;
      font-size: 1.1em;
    }

    .enemy-level {
      font-size: 0.85em;
    }
  }

  .enemy-stats-simple {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 12px;

    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 3px;

      .stat-label {
        font-size: 0.85em;
      }

      .stat-value {
        font-weight: bold;
        font-family: monospace;
        font-size: 0.95em;
      }
    }
  }

  .enemy-rewards-section {
    padding: 8px 10px;
    background: rgba(0, 255, 0, 0.05);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 3px;
    margin-bottom: 12px;

    .section-title {
      color: var(--color-cyan);
      font-weight: bold;
      font-size: 0.9em;
      margin-bottom: 6px;
    }

    .reward-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9em;
      color: var(--color-gray);

      .exp-icon {
        font-size: 1.1em;
      }

      .highlight {
        color: var(--color-yellow);
        font-weight: bold;
      }
    }
  }

  .enemy-drops-section {
    padding: 8px 10px;
    background: rgba(255, 255, 0, 0.05);
    border: 1px solid rgba(255, 255, 0, 0.2);
    border-radius: 3px;

    .section-title {
      color: var(--color-cyan);
      font-weight: bold;
      font-size: 0.9em;
      margin-bottom: 8px;
    }

    .drop-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .drop-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        font-size: 0.85em;
        color: var(--color-gray);

        .drop-icon {
          font-size: 1em;
        }

        .drop-name {
          color: var(--color-cyan);
        }
      }
    }
  }

  .enemy-description-section {
    margin-top: 12px;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;

    .section-title {
      color: var(--color-cyan);
      font-weight: bold;
      font-size: 0.9em;
      margin-bottom: 6px;
    }

    .desc-text {
      color: var(--color-gray);
      font-size: 0.85em;
      line-height: 1.5;
      margin: 0;
    }
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
    color: var(--color-gray);

    .highlight {
      color: var(--color-yellow);
      font-weight: bold;
    }

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
  .blink-text {
    color: var(--color-yellow);
    animation: blink 1s infinite;
  }
}

/* 统一按钮样式 */
.action-btn {
  padding: 10px 24px;
  font-size: 0.95em;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 0, 0.25) 0%, rgba(255, 255, 0, 0.1) 100%);
    border-color: var(--color-yellow);
    color: var(--color-yellow);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* 战斗按钮组 */
.battle-actions-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;

  .action-btn {
    min-width: 120px;
    flex: 0 0 auto;
  }
}

.battle-action {
  margin-top: 16px;
  text-align: center;

  .btn-challenge {
    background: linear-gradient(180deg, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.08) 100%);
    border-color: var(--color-red);
    color: var(--color-red);

    &:hover {
      background: linear-gradient(180deg, rgba(255, 255, 0, 0.2) 0%, rgba(255, 255, 0, 0.1) 100%);
      border-color: var(--color-yellow);
      color: var(--color-yellow);
      box-shadow: 0 4px 8px rgba(255, 0, 0, 0.4);
    }
  }
}

.battle-controls {
  margin-top: 16px;
  text-align: center;

  .btn-close {
    background: linear-gradient(
      180deg,
      rgba(150, 150, 150, 0.15) 0%,
      rgba(150, 150, 150, 0.05) 100%
    );
    border-color: var(--color-gray);
    color: var(--color-gray);

    &:hover {
      background: linear-gradient(180deg, rgba(255, 255, 0, 0.2) 0%, rgba(255, 255, 0, 0.1) 100%);
      border-color: var(--color-yellow);
      color: var(--color-yellow);
      box-shadow: 0 4px 8px rgba(255, 255, 0, 0.3);
    }
  }
}

/* 战斗结束按钮组 */
.battle-actions-finished {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 15px 0;

  .action-btn {
    min-width: 120px;
    flex: 0 0 auto;
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
