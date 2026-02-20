<template>
  <div class="mud-battle">
    <BorderContainer :title="`战斗：对峙中 (回合 ${currentTurns || 1})`">
      <div class="battle-stage">
        <div class="unit">
          <div class="unit-info">
            <span class="u-name yellow">{{ player.name }}</span>
            <span class="u-stats"
              >[攻:{{ player.battle?.attack }} 防:{{ player.battle?.defense }}]</span
            >
          </div>
          <div class="hp-line">
            <span class="label">气血:</span>
            <div class="bar-wrap">
              <div
                class="bar green-bg"
                :style="{ width: (player.baseInfo.hp / player.baseInfo.maxHp) * 100 + '%' }"
              ></div>
            </div>
            <span class="val">{{ player.baseInfo.hp }}/{{ player.baseInfo.maxHp }}</span>
          </div>
        </div>

        <div class="vs-text">=== 厮杀 ===</div>

        <div class="unit">
          <div class="unit-info">
            <span class="u-name red">{{ goblin.name }}</span>
            <span class="u-stats"
              >[攻:{{ goblin.battle?.attack }} 防:{{ goblin.battle?.defense }}]</span
            >
          </div>
          <div class="hp-line">
            <span class="label">气血:</span>
            <div class="bar-wrap">
              <div
                class="bar red-bg"
                :style="{ width: (goblin.baseInfo.hp / goblin.baseInfo.maxHp) * 100 + '%' }"
              ></div>
            </div>
            <span class="val">{{ goblin.baseInfo.hp }}/{{ goblin.baseInfo.maxHp }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <span v-if="battleStatus !== 'running'" class="cmd-btn" @click="fight">[ 发起进攻 ]</span>
        <span v-else class="cmd-text gray">正在激战中...</span>
      </div>
    </BorderContainer>

    <BorderContainer title="战斗过程">
      <div class="log-list">
        <div v-for="(log, index) in battleLogs" :key="index" class="log-item">
          <span class="log-turn">[{{ battleLogs.length - index }}]</span>
          <span :class="['log-msg', { 'system-msg': log.includes('🏁') || log.includes('💀') }]">
            {{ log }}
          </span>
        </div>
        <div v-if="battleLogs.length === 0" class="empty-text">--- 战斗还未开始 ---</div>
      </div>
    </BorderContainer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';
import { canFight } from '@/utils/battle';
import { goblinMonster } from '@/npc/monster/ge_bu_lin';

const { startBattle, currentTurns, battleStatus } = useBattle();
const playerStore = usePlayerStore();
const { player } = playerStore;

const goblin = reactive({
  ...goblinMonster,
  baseInfo: { ...goblinMonster.baseInfo, hp: goblinMonster.baseInfo.hp },
});

const battleLogs = ref<string[]>([]);

const fight = () => {
  const check = canFight(player, goblin);
  // if (!check.canFight) {
  //   alert(check.reason);
  //   return;
  // }

  battleLogs.value = [];
  startBattle(player, goblin, {
    delay: 600,
    onTurn: (event) => {
      player.baseInfo.hp = event.attackerHp;
      goblin.baseInfo.hp = event.defenderHp;
      battleLogs.value.unshift(event.msg);
    },
    onFinish: (result) => {
      player.baseInfo.hp = result.finalAttackerHp;
      goblin.baseInfo.hp = result.finalDefenderHp;
      battleStatus.value = 'finished';
    },
  });
};
</script>

<style lang="scss" scoped>
.mud-battle {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.battle-stage {
  padding: 8px 0;
  .vs-text {
    text-align: center;
    color: var(--color-gray);
    margin: 8px 0;
    font-size: 0.9em;
  }
}

.unit {
  .unit-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    .u-name {
      font-weight: bold;
    }
    .u-stats {
      font-size: 0.85em;
      color: var(--color-gray);
    }
  }
}

/* MUD 风格血条 */
.hp-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  .label {
    color: var(--color-gray);
  }
  .bar-wrap {
    flex: 1;
    height: 6px;
    background: #222;
    border: 1px solid #444;
    .bar {
      height: 100%;
      transition: width 0.3s ease;
    }
  }
  .val {
    width: 80px;
    text-align: right;
    font-family: monospace;
  }
}

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

/* 操作区 */
.actions {
  margin-top: 12px;
  text-align: center;
  .cmd-btn {
    color: var(--color-cyan);
    cursor: pointer;
    &:hover {
      color: var(--color-yellow);
    }
  }
}

/* 日志区 */
.log-list {
  max-height: 300px;
  overflow-y: auto;
  .log-item {
    margin-bottom: 6px;
    font-size: 0.95em;
    line-height: 1.5;
    display: flex;
    gap: 8px;
    .log-turn {
      color: var(--color-gray);
      font-family: monospace;
    }
    .log-msg {
      color: var(--color-text);
    }
    .system-msg {
      color: var(--color-yellow);
      border-bottom: 1px dashed var(--color-yellow);
    }
  }
}

.empty-text {
  text-align: center;
  padding: 10px;
  color: var(--color-gray);
  font-style: italic;
}
</style>
