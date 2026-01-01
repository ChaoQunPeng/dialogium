<template>{{ typewriterContent }}</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, inject } from 'vue';

const props = defineProps<{
  content: string;
}>();

// 导入类型定义
interface TypewriterContainer {
  save: (id: string, instance: any) => void;
}

const typewriterContainer = inject<TypewriterContainer>('typewriterManager');

const index = ref(0);
const typewriterContent = ref('');
const maxIndex = props.content.length - 1;
const timer = ref();
const isTyping = ref(false);
const isDone = ref(false);
const isPause = ref(false);

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
  handleStart();
});

const handleStart = () => {
  isPause.value = false;
  isTyping.value = true;
  timer.value = setInterval(() => {
    if (index.value <= maxIndex) {
      typewriterContent.value += props.content.charAt(index.value);
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
  typewriterContent.value = props.content;
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
