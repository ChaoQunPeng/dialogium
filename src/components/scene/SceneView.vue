<template>
  <div>
    <div>
      <button @click="fight">战斗</button>
      <div>回合数: {{ currentTurns ? currentTurns : 1 }}</div>
      <!-- <div v-if="battleStatus === 'finished'">战斗结束!</div> -->
      <div>玩家:{{ player.baseInfo.hp }}/{{ player.baseInfo.maxHp }}</div>
      <div>
        怪物: {{ goblin.baseInfo.hp }}/{{ goblin.baseInfo.maxHp }}

        {{ goblin.battle?.attack }}/{{ goblin.battle?.defense }}
      </div>
      <div v-for="(log, index) in battleLogs" :key="index">{{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICharacter } from '@/interface';
import { reactive, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';
import { canFight } from '@/utils/battle';
import { goblinMonster } from '@/npc/monster/ge_bu_lin'; // 导入哥布林怪物

const { startBattle, currentTurns, battleStatus } = useBattle();
const playerStore = usePlayerStore();
const { player } = playerStore;

// 使用哥布林怪物替代原来的史莱姆
const goblin = reactive<ICharacter>({
  ...goblinMonster, // 从ge_bu_lin.ts导入的哥布林数据
  baseInfo: {
    ...goblinMonster.baseInfo,
    hp: goblinMonster.baseInfo.hp, // 保持初始血量
  },
});

const battleLogs = ref<string[]>([]);

const fight = () => {
  const fightCheckResult = canFight(player, goblin);
  if (!fightCheckResult.canFight && fightCheckResult.code == 1) {
    alert(fightCheckResult.reason);
    return;
  }

  // 清空旧日志
  battleLogs.value = [];

  startBattle(player, goblin, {
    delay: 500, // 建议稍微加快一点，1000ms体感较慢
    onTurn: (event) => {
      // 这里的 event 就是我们定义的 IBattleEvent
      // 无论谁在攻击，event 都会实时返回双方剩下的血量
      player.baseInfo.hp = event.attack.attackerHp;
      goblin.baseInfo.hp = event.defenderHp;
      // 将新日志插入到最前面
      battleLogs.value.unshift(event.msg);
    },
    onFinish: (result) => {
      console.log('战斗最终结算:', result);
      // 最终确认一次血量，确保同步
      player.baseInfo.hp = result.finalAttackerHp;
      goblin.baseInfo.hp = result.finalDefenderHp;
      battleStatus.value = 'finished';
    },
  });
};
</script>

<style>
.item {
  color: #d4d4d4;
}
</style>
