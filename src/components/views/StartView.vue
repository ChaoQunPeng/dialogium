<template>
  <StartScreenView @game-started="emit('game-started')" />
</template>

<script setup lang="ts">
import StartScreenView from '@/features/start/views/StartScreenView.vue';

const emit = defineEmits<{
  'game-started': [];
}>();
</script>
