<!-- 打字机效果组件 - 用于逐字显示文本内容 -->
<template>
  {{ typewriterContent }}
</template>

<script setup lang="ts">
import type { IConversationItem } from '@interface/index';
import { onMounted, ref, getCurrentInstance, inject } from 'vue';

// ==================== Props ====================

// 对话数据项
const props = defineProps<{
  data?: IConversationItem;
}>();

// ==================== 类型定义 ====================

// 打字机容器接口
interface TypewriterContainer {
  save: (id: string, instance: any) => void;
}

// 注入打字机管理器
const typewriterContainer = inject<TypewriterContainer | undefined>('typeWriterManager', undefined);

// ==================== 状态管理 ====================

// 当前字符索引
const index = ref(0);
// 打字机显示的内容
const typewriterContent = ref('');
// 最大索引（内容长度 -1）
const maxIndex = ref(0);
// 定时器引用
const timer = ref();
// 是否正在打字
const isTyping = ref(false);
// 是否完成
const isDone = ref(false);
// 是否暂停
const isPause = ref(false);
// 完整内容
const content = ref('');

// ==================== 生命周期 ====================

onMounted(() => {
  const currentInstance = getCurrentInstance();
  
  // 只有在提供了 typeWriterManager 时才注册到管理器
  if (typewriterContainer && currentInstance) {
    typewriterContainer.save(currentInstance.uid.toString(), {
      showAll,
      handleStart,
      handlePause,
      isTyping,
      isDone,
      isPause,
    });
  }
  
  // 随机获取内容并开始打字
  getRandomContent();
  handleStart();
});

// ==================== 事件定义 ====================

// 打字状态变化事件
const emits = defineEmits<{
  isTyping: [status: boolean];
}>();

// ==================== 核心逻辑 ====================

/**
 * 随机获取一段内容
 */
const getRandomContent = () => {
  const contentList = props.data?.contentList ?? [];
  const random = Math.floor(Math.random() * contentList.length);

  const contentItem = contentList[random * contentList.length];

  if (contentItem) {
    content.value = contentItem;
  } else {
    content.value = '';
  }

  maxIndex.value = content.value.length - 1;
};

/**
 * 开始打字
 */
const handleStart = () => {
  isPause.value = false;
  isTyping.value = true;
  timer.value = setInterval(() => {
    if (index.value <= maxIndex.value) {
      typewriterContent.value += content.value.charAt(index.value);
      index.value++;
      emits('isTyping', true);
    } else {
      isTyping.value = false;
      emits('isTyping', false);
      clearInterval(timer.value);
    }
  }, 50);
};

/**
 * 暂停打字
 */
const handlePause = () => {
  clearInterval(timer.value);
  emits('isTyping', false);
  isPause.value = true;
  isTyping.value = false;
};

/**
 * 显示全部内容
 */
const showAll = () => {
  clearInterval(timer.value);
  emits('isTyping', false);
  typewriterContent.value = content.value;
  isDone.value = true;
  isTyping.value = false;
};

// 暴露公共 API
defineExpose({
  showAll,
  handleStart,
  handlePause,
});
</script>

<style></style>
