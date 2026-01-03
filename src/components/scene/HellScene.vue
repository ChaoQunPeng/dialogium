<template>
  <div>
    <div>这是地狱, 傻逼们都会在这里被折磨</div>
    <!-- <div>
    <div @click="shanbaz">扇巴掌</div>
  </div> -->

    <!-- SceneFlow -->
    <div>
      <TypeWriterContainer ref="typeWriterContainerRef" :data="conversationDataList">
        <template #default="{ item }">
          <!-- 对话 -->
          <template v-if="item.type === 'conv'">
            <div class="item" style="margin-bottom: 12px">
              {{ item.speaker }} : <TypeWriter :data="item" />
            </div>
          </template>
        </template>
      </TypeWriterContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import TypeWriterContainer from '../TypeWriter/SceneFlow.vue';
import TypeWriter from '../TypeWriter/TypeWriter.vue';
import type { IConversationData } from '@/interface';
import { ref } from 'vue';
import { scene1 } from '@/data/data';
const conversationDataList = ref<IConversationData[]>(scene1.flow);
</script>

<style></style>
