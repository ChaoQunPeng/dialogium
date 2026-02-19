<template>
  <div class="p-6 space-y-4">
    <h2 class="text-2xl font-bold text-text-main mb-4">Tailwind Colors Demo</h2>
    
    <!-- 背景色示例 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 rounded bg-bg-main border border-text-muted">
        <p class="text-text-main">Main Background</p>
        <p class="text-text-muted text-sm">使用 bg-bg-main 和 text-text-main</p>
      </div>
      
      <div class="p-4 rounded bg-bg-card border border-text-muted">
        <p class="text-text-main">Card Background</p>
        <p class="text-text-muted text-sm">使用 bg-bg-card</p>
      </div>
    </div>

    <!-- 文字颜色示例 -->
    <div class="p-4 bg-bg-card rounded">
      <p class="text-text-main">主要文字颜色 (text-text-main)</p>
      <p class="text-text-muted">次要文字颜色 (text-text-muted)</p>
    </div>

    <!-- 强调色示例 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 rounded bg-bg-card border-2 border-yellow">
        <p class="text-yellow font-bold">黄色强调 (text-yellow)</p>
      </div>
      
      <div class="p-4 rounded bg-bg-card border-2 border-green">
        <p class="text-green font-bold">绿色成功 (text-green)</p>
      </div>
      
      <div class="p-4 rounded bg-bg-card border-2 border-red">
        <p class="text-red font-bold">红色警告 (text-red)</p>
      </div>
      
      <div class="p-4 rounded bg-bg-card border-2 border-cyan">
        <p class="text-cyan font-bold">青色信息 (text-cyan)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这个组件展示了如何使用在 tailwind.config.js 中配置的自定义颜色类
</script>