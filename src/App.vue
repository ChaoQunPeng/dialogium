<template>
  <div class="app-container">
    <header>头部</header>
    <main>
      <SceneView></SceneView>
    </main>
    <footer>底部</footer>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import SceneView from './components/scene/SceneView.vue';

defineComponent({
  components: {
    SceneView,
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: serif;
  color: #d4d4d4;
}

body {
  margin: 0;
  padding: 0;
  background-color: #404040;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  main {
    flex: 1;
    overflow: auto;
  }
}
</style>
