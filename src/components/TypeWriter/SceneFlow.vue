<template>
  <div v-for="(item, index) in dataList" :key="index">
    <slot :item="item" :index="index"></slot>
  </div>
</template>

<script setup lang="ts">
import type { IConversationData } from '@/interface';
import { nextTick, onMounted, onUnmounted, provide, reactive, ref } from 'vue';

const props = defineProps<{
  data: IConversationData[];
}>();

const index = ref(0);
const dataList = ref<IConversationData[]>([]);
const typeWriterMaps = reactive(new Map<string, any>());

const save = (id: string, instance: any) => {
  typeWriterMaps.set(id, instance);
};

const getMaps = () => {
  return typeWriterMaps;
};

const getList = () => {
  return Array.from(typeWriterMaps.values());
};

const get = (id: string) => {
  return typeWriterMaps.get(id);
};

const getTypingItem = () => {
  return Array.from(typeWriterMaps.values()).find((item) => {
    return item.isTyping;
  });
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydonwSpace);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydonwSpace);
});

const handleKeydonwSpace = async (e: KeyboardEvent) => {
  if (e.repeat) return;

  await nextTick();

  if (e.code == 'Space') {
    const firstItem = getTypingItem();
    if (firstItem) {
      firstItem.showAll();
    } else {
      if (index.value < props.data.length) {
        const item = props.data[index.value];
        if (item) {
          dataList.value.push(item);
        }
        index.value++;
      } else {
        console.log('对话已结束');
      }
    }
  }
};

provide('typeWriterManager', {
  save,
  getMaps,
  getList,
  get,
  getTypingItem,
});

defineExpose({
  getMaps,
  getList,
  get,
  getTypingItem,
});
</script>

<style></style>
