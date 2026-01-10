<template>
  <div>
    <!-- SceneFlow -->
    <div>
      <SceneFlow ref="typeWriterContainerRef" :data="conversationDataList">
        <template #default="{ speaker, item }">
          <!-- 对话 -->
          <template v-if="item.type === 'text'">
            <div class="item" style="margin-bottom: 12px">
              {{ speaker }} : <TypeWriter :data="item" @is-typing="listenOnTyping" />
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
import type { IConversationItem, INpc } from '@/interface';
import { ref } from 'vue';
const conversationDataList = ref<IConversationItem[]>([]);

const typeWriterContainerRef = ref<InstanceType<typeof SceneFlow>>();

const getNpc = (): INpc => {
  return {
    name: '小师弟',
    conversationList: [
      {
        contentList: ['这是封缘星，请坐。'],
        type: 'text',
      },
    ],
  };
};

const add = () => {
  const hasTypingItem = typeWriterContainerRef.value?.getTypingItem();
  if (hasTypingItem) {
    typeWriterContainerRef.value?.endCurrentFlow();
  } else {
    const data = getNpc();
    typeWriterContainerRef.value?.addFlowItem(data.name, data.conversationList[0]!);
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
</style>
