<template>
  <div>
    <!-- SceneFlow -->
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
            <div class="item" style="margin-bottom: 12px">
              {{ speaker }}
              <TypeWriter :data="getRandomConversation(item)" @is-typing="listenOnTyping" />
            </div>
          </template>
        </template>
      </SceneFlow>
    </div>

    <div v-if="!isTyping">
      <button @click="add">add</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneFlow from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IMonster, INpc } from '@/interface';
import { onMounted, ref } from 'vue';
const sceneFlowRef = ref<InstanceType<typeof SceneFlow>>();

import { scene } from '@/data/scene';
import { getRandomElement, getWeightedRandomElement } from '@/utils/arrayUtils';

onMounted(() => {
  setInterval(() => {
    const data = getWeightedRandomElement(scene.monsterList);
    sceneFlowRef.value?.addFlowItem(data!);
  }, 1000);
});

const getRandomConversation = (item: INpc | IMonster) => {
  if (item.conversationList.length) {
    return getRandomElement(item.conversationList);
  }
};

const getNpc = (): INpc => {
  return {
    __type: 'npc',
    name: '小师弟',
    conversationList: [
      {
        __type: 'conversationItem',
        contentList: ['这是封缘星，请坐。'],
        type: 'conversation',
      },
    ],
  };
};

const add = () => {
  const hasTypingItem = sceneFlowRef.value?.getTypingItem();
  if (hasTypingItem) {
    sceneFlowRef.value?.endCurrentFlow();
  } else {
    const data = getNpc();
    sceneFlowRef.value?.addFlowItem(data);
  }
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

.SceneFlow {
  color: #fff;
}
</style>
