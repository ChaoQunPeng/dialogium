<template>
  <div>
    人物经验: {{ playerStore.currentExp }} |
    <SceneFlow ref="sceneFlowRef" class="SceneFlow">
      <template #default="{ speaker, item }">
        <template v-if="item.__type === 'npc'">
          <div class="item" style="margin-bottom: 12px">
            {{ speaker }}

            <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
          </div>
        </template>

        <template v-if="item.__type === 'monster'">
          <div v-if="item.action === 'battle'" class="item" style="margin-bottom: 12px">
            {{ speaker }}: {{ battle(item) }}
          </div>

          <div v-else-if="item.action === 'conversation'" class="item" style="margin-bottom: 12px">
            {{ speaker }}
            <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
          </div>
        </template>
      </template>
    </SceneFlow>
  </div>
</template>

<script setup lang="ts">
import SceneFlow from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IMonster, INpc } from '@/interface';
import { onMounted, ref } from 'vue';

import { scene } from '@/scene/FengYuanXing';
import { getRandomElement, getWeightedRandomElement } from '@/utils/arrayUtils';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();
const sceneFlowRef = ref<InstanceType<typeof SceneFlow>>();
const isTyping = ref(false);

onMounted(() => {
  setInterval(() => {
    const data = getWeightedRandomElement(scene.monsterList);
    sceneFlowRef.value?.addFlowItem(data!);
    playerStore.updateExp(data?.exp || 0);
  }, 2000);
});

const getRandomConversation = (item: INpc | IMonster) => {
  if (item.conversationList.length) {
    return getRandomElement(item.conversationList);
  }
};

const battle = (item: IMonster) => {
  let result = '';
  if (playerStore.player.atk > item.defense) {
    result = `${playerStore.player.name}击败了${item.name}, 获得${item.exp}经验值, 获得了${getRandomElement(item.dropList)?.name}`;
    playerStore.updateExp(item.exp);
  } else {
    const diff = Math.max(0, item.attack - playerStore.player.def);
    result = `${item.name}对${playerStore.player.name}, 造成了${diff}点伤害`;
    playerStore.updateHp(diff);
  }

  return result;
};

const listenOnTyping = (status: boolean) => {
  isTyping.value = status;
};
</script>

<style>
.item {
  color: #d4d4d4;
}
</style>