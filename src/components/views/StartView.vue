<!-- 开始视图 - 用于展示游戏开始界面 -->
<template>
  <StartScreenView @game-started="emit('game-started')" />
</template>

<script setup lang="ts">
// 导入开始屏幕视图组件
import StartScreenView from '@/features/start/views/StartScreenView.vue';

// 定义组件事件：游戏已启动
const emit = defineEmits<{
  'game-started': [];
}>();
</script>
