<template>
  <div class="app-container">
    <HellScene></HellScene>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
// import TypeWriter from './components/TypeWriter/TypeWriter.vue';
// import TypeWriterContainer from './components/TypeWriter/TypeWriterContainer.vue';
// import PhaserGame from './components/PhaserGame.vue';
// import HelloWorld from './components/HelloWorld.vue';
import HellScene from './components/scene/HellScene.vue';

defineComponent({
  components: {
    // TypeWriterContainer,
    // TypeWriter,
    // HelloWorld,
    HellScene,
  },
});

// const index = ref(0);
// const conversationData = ref<Array<IConversationData>>(scene1.conversationData);
// const conversationList = ref<Array<IConversationData>>([]);
// const typeWriterContainerRef = ref<InstanceType<typeof TypeWriterContainer>>();

// const getConversation = (item: IConversationData) => {
//   if (!item.contentList || item.contentList.length === 0) {
//     return ''; // 或返回默认值
//   }

//   const contentList = item.contentList;
//   const random = Math.floor(Math.random());

//   // 数组随机取一个
//   const contentItem = contentList[random * contentList.length];

//   if (!contentItem) {
//     return '';
//   }

//   return contentItem.content;
// };
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: #111111;
}

.app-container {
  display: flex;
  /* min-width: 1366px; */
}
</style>
