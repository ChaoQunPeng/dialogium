<template>
  <div style="color: #fff">
    <div>
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
              {{ speaker }}: {{ getBattleResult(item) }}
            </div>

            <div
              v-else-if="item.action === 'conversation'"
              class="item"
              style="margin-bottom: 12px"
            >
              {{ speaker }}
              <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
            </div>
          </template>
        </template>
      </SceneFlow>
    </div>

    <!-- <div v-if="!isTyping">
      <button @click="add">添加对话</button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import SceneFlow from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IMonster, INpc } from '@/interface';
import { onMounted, ref } from 'vue';
const sceneFlowRef = ref<InstanceType<typeof SceneFlow>>();

import { scene } from '@/scene/FengYuanXing';
import { getRandomElement, getWeightedRandomElement } from '@/utils/arrayUtils';
import { usePlayerStore } from '@/stores/player';

onMounted(() => {
  setInterval(() => {
    const data = getWeightedRandomElement(scene.monsterList);
    sceneFlowRef.value?.addFlowItem(data!);
  }, 2000);
});

const getRandomConversation = (item: INpc | IMonster) => {
  if (item.conversationList.length) {
    return getRandomElement(item.conversationList);
  }
};

const playerStore = usePlayerStore();

const getBattleResult = (item: IMonster) => {
  return `${playerStore.player.name}击败了${item.name}, 获得${item.exp}经验值, 获得了${getRandomElement(item.dropList)?.name}`;
};
const isTyping = ref(false);
const listenOnTyping = (status: boolean) => {
  isTyping.value = status;
};
</script>

<style>
.item {
  color: #d4d4d4;
}
</style>
