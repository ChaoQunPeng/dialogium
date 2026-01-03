<template>
  <!-- <div>这是地狱, 傻逼们都会在这里被折磨</div> -->
  <!-- <div>
    <div @click="shanbaz">扇巴掌</div>
  </div> -->

  <div>
    <TypeWriterContainer ref="typeWriterContainerRef" :data="conversationDataList">
      <template #default="{ item }">
        <div class="item" style="margin-bottom: 12px">
          {{ item.speaker }} : <TypeWriter :data="item" />
        </div>
      </template>
    </TypeWriterContainer>
  </div>
</template>

<script setup lang="ts">
import TypeWriterContainer from '../TypeWriter/TypeWriterContainer.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IConversationData } from '@/interface';
import { ref } from 'vue';
import { scene1 } from '@/data/data';
const conversationDataList = ref<IConversationData[]>(scene1.conversationData);
</script>

<style></style>
