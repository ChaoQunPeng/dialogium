<template>
  {{ typewriterContent }}
</template>

<script setup lang="ts">
import type { IFlowData } from '@interface/index';
import { onMounted, ref, getCurrentInstance, inject } from 'vue';

const props = defineProps<{
  data: IFlowData;
}>();

// 导入类型定义
interface TypewriterContainer {
  save: (id: string, instance: any) => void;
}

const typewriterContainer = inject<TypewriterContainer>('typeWriterManager');

const index = ref(0);
const typewriterContent = ref('');
const maxIndex = ref(0);
const timer = ref();
const isTyping = ref(false);
const isDone = ref(false);
const isPause = ref(false);
const content = ref('');

onMounted(() => {
  const currentInstance = getCurrentInstance();
  typewriterContainer!.save(currentInstance!.uid.toString(), {
    showAll,
    handleStart,
    handlePause,
    isTyping,
    isDone,
    isPause,
  });
  getRandomContent();
  handleStart();
});

const getRandomContent = () => {
  const contentList = props.data.contentList ?? [];
  const random = Math.floor(Math.random());

  const contentItem = contentList[random * contentList.length];

  if (contentItem) {
    content.value = contentItem.content;
  } else {
    content.value = '';
  }

  maxIndex.value = content.value.length - 1;
};

const handleStart = () => {
  isPause.value = false;
  isTyping.value = true;
  timer.value = setInterval(() => {
    if (index.value <= maxIndex.value) {
      typewriterContent.value += content.value.charAt(index.value);
      index.value++;
    } else {
      isTyping.value = false;
      clearInterval(timer.value);
    }
  }, 50);
};

const handlePause = () => {
  clearInterval(timer.value);
  isPause.value = true;
  isTyping.value = false;
};

/**
 * 显示全部
 */
const showAll = () => {
  clearInterval(timer.value);
  typewriterContent.value = content.value;
  isDone.value = true;
  isTyping.value = false;
};

defineExpose({
  showAll,
  handleStart,
  handlePause,
});
</script>

<style></style>
