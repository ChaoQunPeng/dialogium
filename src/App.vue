<template>
  <div class="app-container">
    <div>
      <PhaserGame />
    </div>

    <div style="width: 270px">
      <TypeWriterContainer ref="typeWriterContainerRef">
        <div
          v-for="(item, index) in conversationList"
          :key="index"
          class="item"
          style="margin-bottom: 12px"
        >
          {{ item.speaker }} : <TypeWriter :content="getConversation(item)" />
        </div>
      </TypeWriterContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IConversationData } from '@interface/index';
import { scene1 } from '@/data/data';
import TypeWriter from './components/TypeWriter/TypeWriter.vue';
import { defineComponent, nextTick, onMounted, onUnmounted, ref } from 'vue';
import TypeWriterContainer from './components/TypeWriter/TypeWriterContainer.vue';
import PhaserGame from './components/PhaserGame.vue';

defineComponent({
  components: {
    TypeWriterContainer,
    TypeWriter,
    PhaserGame,
  },
});

const index = ref(0);
const conversationData = ref<Array<IConversationData>>(scene1.conversationData);
const conversationList = ref<Array<IConversationData>>([]);
const typeWriterContainerRef = ref<InstanceType<typeof TypeWriterContainer>>();

onMounted(() => {
  // 监听按下空格键
  document.addEventListener('keydown', handleKeydonwSpace);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydonwSpace);
});

const handleKeydonwSpace = async (e: KeyboardEvent) => {
  if (e.repeat) return;

  await nextTick();

  if (e.code == 'Space') {
    const firstItem = typeWriterContainerRef.value?.getTypingItem();
    if (firstItem) {
      firstItem.showAll();
    } else {
      if (index.value < conversationData.value?.length) {
        const item = conversationData.value[index.value];
        if (item) {
          conversationList.value.push(item);
        }
        index.value++;
      } else {
        console.log('对话已结束');
      }
    }
  }
};

const getConversation = (item: IConversationData) => {
  if (!item.contentList || item.contentList.length === 0) {
    return ''; // 或返回默认值
  }

  const contentList = item.contentList;
  const random = Math.floor(Math.random());

  // 数组随机取一个
  const contentItem = contentList[random * contentList.length];

  if (!contentItem) {
    return '';
  }

  return contentItem.content;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  min-width: 1366px;
}
</style>
