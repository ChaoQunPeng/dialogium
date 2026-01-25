<template>
  <div>
    <div>
      <button @click="fight">战斗</button>
      <div v-if="!isFighting">战斗结束!</div>
      <div>{{ player.baseInfo.hp }}/{{ player.baseInfo.maxHp }}</div>
      <div>{{ slime.baseInfo.hp }}/{{ slime.baseInfo.maxHp }}</div>
      <div v-for="(log, index) in battleLogs" :key="index">{{ log }}</div>
    </div>
    <SceneFlow ref="sceneFlowRef" class="SceneFlow">
      <template #default="{ speaker, item }">
        <template v-if="item.__type === 'npc'">
          <div class="item" style="margin-bottom: 12px">
            {{ speaker }}

            <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
          </div>
        </template>

        <template v-if="item.__type === 'monster'">
          <!-- <div v-if="item.action === 'battle'" class="item" style="margin-bottom: 12px">
            {{ speaker }}: {{ battle(item) }}
          </div>

          <div v-else-if="item.action === 'conversation'" class="item" style="margin-bottom: 12px">
            {{ speaker }}
            <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
          </div> -->
        </template>
      </template>
    </SceneFlow>
  </div>
</template>

<script setup lang="ts">
import SceneFlow from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { ICharacter } from '@/interface';
import { onMounted, reactive, ref } from 'vue';
import { CharacterType } from '@/enums';

import { getRandomElement } from '@/utils/arrayUtils';
import { usePlayerStore } from '@/stores/player';
import { useBattle } from '@/hooks/useBattle';

const { isFighting, startBattle } = useBattle();
const playerStore = usePlayerStore();
const { player } = playerStore;

const sceneFlowRef = ref<InstanceType<typeof SceneFlow>>();
const isTyping = ref(false);

const slime = reactive<ICharacter>({
  id: 'm1',
  name: '小史莱姆',
  type: CharacterType.Monster,
  baseInfo: { level: 5, hp: 1000, maxHp: 1000, mp: 0, maxMp: 0 },
  battle: { attack: 15, defense: 0 },
});

const battleLogs = ref<string[]>([]);

onMounted(async () => {});

const fight = () => {
  startBattle(player, slime, {
    delay: 300,
    onTurn: (event) => {
      player.baseInfo.hp = event.attackerHp;
      slime.baseInfo.hp = event.defenderHp;
      battleLogs.value.unshift(event.msg);
    },
    onFinish: (result) => {
      console.log('战斗结果', result);
    },
  });
};

const getRandomConversation = (item: ICharacter) => {
  if (item.conversations?.length) {
    return getRandomElement(item.conversations);
  }
};

// const battle = (item: ICharacter) => {
//   let result = '';
//   if (playerStore.player.atk > item.battle.defense) {
//     result = `${playerStore.player.name}击败了${item.name}, 获得${item.exp}经验值, 获得了${getRandomElement(item.dropList)?.name}`;
//     playerStore.updateExp(item.exp);
//   } else {
//     const diff = Math.max(0, item.attack - playerStore.player.def);
//     result = `${item.name}对${playerStore.player.name}, 造成了${diff}点伤害`;
//     playerStore.updateHp(diff);
//   }

//   return result;
// };

const listenOnTyping = (status: boolean) => {
  isTyping.value = status;
};

// watch(isFighting, (newVal, oldVal) => {
//   if (!newVal && oldVal) {
//     // 从 true 变为 false，战斗结束
//     console.log('战斗结束！', battleResult.value);
//   }
// });
</script>

<style>
.item {
  color: #d4d4d4;
}
</style>
