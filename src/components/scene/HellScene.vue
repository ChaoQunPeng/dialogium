<template>
  <div>
    <div v-if="!isTyping">
      <button @click="add">add</button>
    </div>

    <!-- SceneFlow -->
    <div>
      <SceneFlow ref="typeWriterContainerRef" :data="conversationDataList">
        <template #default="{ item }">
          <!-- 对话 -->
          <template v-if="item.type === 'conv'">
            <div class="item" style="margin-bottom: 12px">
              {{ item.speaker }} : <TypeWriter :data="item" @is-typing="listenOnTyping" />
            </div>
          </template>
        </template>
      </SceneFlow>
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneFlow from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IFlowData } from '@/interface';
import { ref } from 'vue';
import { scene1 } from '@/data/data';
const conversationDataList = ref<IFlowData[]>(scene1.flow);

const typeWriterContainerRef = ref<InstanceType<typeof SceneFlow>>();
const add = () => {
  const hasTypingItem = typeWriterContainerRef.value?.getTypingItem();
  if (hasTypingItem) {
    typeWriterContainerRef.value?.endCurrentFlow();
  } else {
    typeWriterContainerRef.value?.addFlowItem({
      type: 'conv',
      speaker: '小王',
      contentList: [
        {
          content:
            '中国是茶的故乡，也是世界上最早发现和利用茶树的国家。据《神农本草经》记载：“神农尝百草，日遇七十二毒，得荼而解之。”这里的“荼”便是今日之茶。茶文化在中国源远流长，历经数千年的发展，已深深融入中华民族的血脉之中。从唐代陆羽的《茶经》到宋代点茶的精致，再到明清时期散茶的兴起，每个时代都为茶文化留下了独特的印记。茶马古道见证了茶叶贸易的繁荣，丝绸之路则将中国茶香传遍世界。',
        },
      ],
    });
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
