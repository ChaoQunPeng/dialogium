<!-- 基础边框容器 - 带标题的通用边框容器组件 -->
<template>
  <div class="border-container">
    <div v-if="title" class="title">【{{ title }}】</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 定义组件属性：可选的标题
defineProps<{
  title?: string;
}>();
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 2px;
  margin-bottom: 12px;

  .title {
    color: var(--color-yellow);
    margin-bottom: 8px;
    margin-left: -7px;
  }
}
</style>
