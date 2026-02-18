<template>
  <div>
    <div>
      <button @click="fight">战斗</button>
      <div>回合数: {{ currentTurns ? currentTurns : 1 }}</div>
      <div v-if="battleStatus === 'finished'">战斗结束!</div>
      <div>玩家:{{ player.baseInfo.hp }}/{{ player.baseInfo.maxHp }}</div>
      <div>怪物:{{ slime.baseInfo.hp }}/{{ slime.baseInfo.maxHp }}</div>
      <div v-for="(log, index) in battleLogs" :key="index">{{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICharacter } from '@/interface';
import { reactive, ref } from 'vue';
import { CharacterType } from '@/enums';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';
import { canFight } from '@/utils/battle';

const { startBattle, currentTurns, battleStatus } = useBattle();
const playerStore = usePlayerStore();
const { player } = playerStore;

const slime = reactive<ICharacter>({
  id: 'slime_001',
  name: '史莱姆',
  type: CharacterType.Monster,
  baseInfo: {
    hp: 50,
    maxHp: 50,
    level: 1,
    mp: 0,
    maxMp: 0,
  },
});

const battleLogs = ref<string[]>([]);

const fight = () => {
  const fightCheckResult = canFight(player, slime);
  if (!fightCheckResult.canFight) {
    alert(fightCheckResult.reason);
    return;
  }

  startBattle(player, slime, {
    delay: 1000,
    onTurn: (event) => {
      debugger;
      player.baseInfo.hp = event.attack.attackerHp;
      slime.baseInfo.hp = event.defender?.defenderHp ?? 0;
      battleLogs.value.unshift(event.msg);
    },
    onFinish: (result) => {
      console.log('战斗结果', result);
    },
  });
};
</script>

<style>
.item {
  color: #d4d4d4;
}
</style>
