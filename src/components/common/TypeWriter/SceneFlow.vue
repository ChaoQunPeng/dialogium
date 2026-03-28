<!-- 场景流程管理器 - 用于管理对话打字机效果的容器组件 -->
<template>
  <div v-for="(item, index) in dataList" :key="index" class="item-data">
    <slot :speaker="speaker" :item="item" :index="index"></slot>
  </div>
</template>

<script setup lang="ts">
import type { IConversationItem } from '@/interface';
import { onMounted, onUnmounted, provide, reactive, ref } from 'vue';

// ==================== 状态管理 ====================

// 当前显示的对话列表
const dataList = ref<Array<IConversationItem>>([]);
// 打字机实例映射表，用于存储和管理所有打字机实例
const typeWriterMaps = reactive(new Map<string, any>());
// 当前说话者名称
const speaker = ref('');

// ==================== 核心方法 ====================

/**
 * 保存打字机实例到映射表
 * @param id 实例 ID
 * @param instance 打字机实例
 */
const save = (id: string, instance: any) => {
  typeWriterMaps.set(id, instance);
};

/**
 * 获取所有打字机实例映射表
 * @returns 打字机实例映射表
 */
const getMaps = () => {
  return typeWriterMaps;
};

/**
 * 获取打字机实例数组
 * @returns 打字机实例数组
 */
const getList = () => {
  return Array.from(typeWriterMaps.values());
};

/**
 * 根据 ID 获取打字机实例
 * @param id 实例 ID
 * @returns 对应的打字机实例
 */
const get = (id: string) => {
  return typeWriterMaps.get(id);
};

/**
 * 获取正在打字的实例
 * @returns 正在打字的实例，如果没有则返回 undefined
 */
const getTypingItem = () => {
  return Array.from(typeWriterMaps.values()).find((item) => {
    return item.isTyping;
  });
};

// ==================== 生命周期 ====================

onMounted(() => {
  // 组件挂载时的初始化逻辑
  // document.addEventListener('keydown', handleKeydonwSpace);
});

onUnmounted(() => {
  // 组件卸载时的清理逻辑
  // document.removeEventListener('keydown', handleKeydonwSpace);
});

// ==================== 流程控制 ====================

/**
 * 结束当前流程（立即显示所有内容）
 * 获取正在打字的实例并调用其 showAll 方法
 */
const endCurrentFlow = () => {
  const firstItem = getTypingItem();
  if (firstItem) {
    firstItem.showAll();
  }
};

/**
 * 添加新的流程项到对话列表
 * @param item 对话项，包含 name 和 __type 等属性
 */
const addFlowItem = (item: any) => {
  // 更新当前说话者
  speaker.value = item.name;

  // 根据类型处理不同的对话逻辑
  if (item.__type == 'npc') {
    // NPC 对话处理
  } else if (item.__type == 'monster') {
    // 怪物对话处理
  }

  // 将新项添加到列表开头
  dataList.value.unshift(item);
};

// ==================== 依赖注入 ====================

// 提供打字机管理器给子组件使用
provide('typeWriterManager', {
  save,
  getMaps,
  getList,
  get,
  getTypingItem,
});

// 暴露公共 API 供父组件调用
defineExpose({
  getMaps,
  getList,
  get,
  getTypingItem,
  addFlowItem,
  endCurrentFlow,
});
</script>

<style>
.item-data {
  color: #fff;
}
</style>
