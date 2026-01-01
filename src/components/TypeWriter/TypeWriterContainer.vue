<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue';
const typeWriterMaps = reactive(new Map<string, any>());

const save = (id: string, instance: any) => {
  typeWriterMaps.set(id, instance);
};

provide('typewriterManager', {
  save,
});

defineExpose({
  getMaps: () => {
    return typeWriterMaps;
  },
  getList: () => {
    return Array.from(typeWriterMaps.values());
  },
  get: (id: string) => {
    return typeWriterMaps.get(id);
  },
  getTypingItem: () => {
    return Array.from(typeWriterMaps.values()).find((item) => {
      return item.isTyping;
    });
  },
});
</script>

<style></style>
