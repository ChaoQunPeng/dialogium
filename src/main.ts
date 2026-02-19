import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeGame } from '@/utils/initialize';

// 导入 TailwindCSS 样式
import './assets/main.css';

initializeGame();

import App from './App.vue';
import router from './router';
import BorderContainer from './components/borderContainer.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 全局注册组件
app.component('BorderContainer', BorderContainer);

app.mount('#app');

// 扩展 Window 接口以包含 generateUniqueIdV2 方法
declare global {
  interface Window {
    getUidId: () => string;
  }
}

window.getUidId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // 使用浏览器原生的 UUID 生成方法
    return crypto.randomUUID().replace(/-/g, '');
  } else {
    // 降级方案：使用时间戳和随机数
    return `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};