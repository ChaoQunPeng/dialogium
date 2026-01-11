<template>
  <div style="color: #fff">
    <!-- SceneFlow -->
    经验:
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
import type { IMonster, INpc, IPlayer } from '@/interface';
import { onMounted, reactive, ref } from 'vue';
const sceneFlowRef = ref<InstanceType<typeof SceneFlow>>();

import { scene } from '@/data/scene';
import { getRandomElement, getWeightedRandomElement } from '@/utils/arrayUtils';
import { RealmTypeCode } from '@/enums';

onMounted(() => {
  setInterval(() => {
    const data = getWeightedRandomElement(scene.monsterList);
    sceneFlowRef.value?.addFlowItem(data!);
  }, 500);
});

const getRandomConversation = (item: INpc | IMonster) => {
  if (item.conversationList.length) {
    return getRandomElement(item.conversationList);
  }
};

const player = reactive<IPlayer>({
  name: '李强',
  hp: 1000,
  mp: 1000,
  atk: 100,
  def: 100,
  daoCultivation: {
    level: 1,
    currentExp: 0,
    realm: RealmTypeCode.ZHU_JI,
  },
});

const getBattleResult = (item: IMonster) => {
  return `${player.name}击败了${item.name}, 获得${item.exp}经验值, 获得了${getRandomElement(item.dropList)?.name}`;
};

// const getNpc = (): INpc => {
//   return {
//     __type: 'npc',
//     name: '小师弟',
//     conversationList: [
//       {
//         __type: 'conversationItem',
//         contentList: ['这是封缘星，请坐。'],
//         type: 'conversation',
//       },
//     ],
//   };
// };

// const add = () => {
//   const hasTypingItem = sceneFlowRef.value?.getTypingItem();
//   if (hasTypingItem) {
//     sceneFlowRef.value?.endCurrentFlow();
//   } else {
//     const data = getNpc();
//     sceneFlowRef.value?.addFlowItem(data);
//   }
// };

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
