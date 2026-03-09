<template>
  <div v-if="visible" class="modal-overlay" @click="handleCancel">
    <div class="modal-box" @click.stop>
      <div class="modal-header">💰 确认购买</div>
      <div class="modal-body">
        <p>确认购买 [ {{ currentItem?.name }} ] ？</p>
        <p class="price-info">价格：<span class="price-value">{{ currentItem?.price ?? 0 }}</span> 💰</p>
      </div>
      <div class="modal-footer">
        <span class="modal-btn red" @click="handleConfirm">[ 购买 ]</span>
        <span class="modal-btn" @click="handleCancel">[ 取消 ]</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface DropConfirmModalEmits {
  (e: 'confirm', item: any): void;
}

const emits = defineEmits<DropConfirmModalEmits>();

// 内部状态
const visible = ref(false);
const currentItem = ref<any>(null);

// 公共API方法
const show = (item: any) => {
  currentItem.value = item;
  visible.value = true;
};

const hide = () => {
  visible.value = false;
  currentItem.value = null;
};

// 事件处理方法
const handleConfirm = () => {
  if (currentItem.value) {
    emits('confirm', currentItem.value);
  }
  hide();
};

const handleCancel = () => {
  hide();
};

// 暴露公共API
defineExpose({
  show,
  hide
});
</script>

<style lang="scss" scoped>
// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background-color: rgba(20, 20, 20, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(50, 50, 50, 0.7);
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: var(--color-yellow);
}

.modal-body {
  padding: 20px;
  color: var(--color-text);
  text-align: center;
  
  p {
    margin: 8px 0;
  }
  
  .price-info {
    font-size: 1.1em;
    color: var(--color-yellow);
    
    .price-value {
      font-weight: bold;
      font-size: 1.2em;
    }
  }
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background-color: rgba(30, 30, 30, 0.5);
  display: flex;
  justify-content: center;
  gap: 20px;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
  background-color: rgba(60, 60, 60, 0.5);
  color: var(--color-text);

  &:hover {
    background-color: rgba(80, 80, 80, 0.7);
    transform: translateY(-1px);
  }

  &.red {
    background-color: rgba(255, 80, 80, 0.2);
    color: var(--color-red);
    border-color: var(--color-red);

    &:hover {
      background-color: rgba(255, 80, 80, 0.4);
    }
  }
}
</style>