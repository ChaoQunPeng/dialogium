<!-- 基础按钮组件 - 通用的按钮 UI 组件 -->
<template>
  <button
    class="base-button"
    :class="[
      `base-button--${type}`,
      `base-button--${size}`,
      `base-button--${variant}`,
      {
        'base-button--disabled': disabled,
        'base-button--loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="base-button__loader">
      <svg class="loading-spinner" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <!-- 按钮内容 -->
    <span class="base-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
// ==================== 类型定义 ====================

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'solid' | 'outline' | 'ghost';

// ==================== Props 定义 ====================

interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  variant: 'solid',
  disabled: false,
  loading: false
});

// ==================== 事件定义 ====================

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// ==================== 事件处理 ====================

/**
 * 点击事件处理
 */
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  outline: none;
  position: relative;

  // 尺寸变体
  &--small {
    padding: 6px 12px;
    font-size: 12px;
    min-height: 28px;
  }

  &--medium {
    padding: 10px 20px;
    font-size: 14px;
    min-height: 36px;
  }

  &--large {
    padding: 14px 28px;
    font-size: 16px;
    min-height: 44px;
  }

  // 样式变体
  &--solid {
    &.base-button--primary {
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
      border: 1px solid var(--color-cyan);
      color: var(--color-cyan);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.1) 100%);
        border-color: var(--color-yellow);
        color: var(--color-yellow);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
      }
    }

    &.base-button--success {
      background: linear-gradient(135deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 255, 0, 0.1) 100%);
      border: 1px solid var(--color-green);
      color: var(--color-green);

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(0, 255, 0, 0.3) 0%, rgba(0, 255, 0, 0.15) 100%);
        border-color: var(--color-green);
        color: #fff;
        transform: translateY(-2px);
      }
    }

    &.base-button--warning {
      background: linear-gradient(135deg, rgba(255, 191, 36, 0.2) 0%, rgba(255, 158, 11, 0.1) 100%);
      border: 1px solid var(--color-yellow);
      color: var(--color-yellow);

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(255, 191, 36, 0.3) 0%, rgba(255, 158, 11, 0.15) 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
      }
    }

    &.base-button--danger {
      background: linear-gradient(135deg, rgba(255, 77, 77, 0.2) 0%, rgba(130, 0, 0, 0.1) 100%);
      border: 1px solid #ff4d4d;
      color: #ff4d4d;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(255, 77, 77, 0.3) 0%, rgba(130, 0, 0, 0.15) 100%);
        border-color: #ff6b6b;
        color: #fff;
        transform: translateY(-2px);
      }
    }

    &.base-button--info {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
      border: 1px solid #667eea;
      color: #667eea;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.15) 100%);
        border-color: #764ba2;
        color: #fff;
        transform: translateY(-2px);
      }
    }
  }

  &--outline {
    background: transparent;

    &.base-button--primary {
      border: 1px solid var(--color-cyan);
      color: var(--color-cyan);

      &:hover:not(:disabled) {
        background: rgba(0, 255, 255, 0.1);
        color: var(--color-yellow);
        border-color: var(--color-yellow);
      }
    }

    &.base-button--success {
      border: 1px solid var(--color-green);
      color: var(--color-green);

      &:hover:not(:disabled) {
        background: rgba(0, 255, 0, 0.1);
        color: #fff;
      }
    }

    &.base-button--warning {
      border: 1px solid var(--color-yellow);
      color: var(--color-yellow);

      &:hover:not(:disabled) {
        background: rgba(255, 215, 0, 0.1);
        color: #fff;
      }
    }

    &.base-button--danger {
      border: 1px solid #ff4d4d;
      color: #ff4d4d;

      &:hover:not(:disabled) {
        background: rgba(255, 77, 77, 0.1);
        color: #fff;
      }
    }

    &.base-button--info {
      border: 1px solid #667eea;
      color: #667eea;

      &:hover:not(:disabled) {
        background: rgba(102, 126, 234, 0.1);
        color: #fff;
      }
    }
  }

  &--ghost {
    background: transparent;
    box-shadow: none;

    &.base-button--primary {
      color: var(--color-cyan);

      &:hover:not(:disabled) {
        background: rgba(0, 255, 255, 0.05);
        color: var(--color-yellow);
      }
    }

    &.base-button--success {
      color: var(--color-green);

      &:hover:not(:disabled) {
        background: rgba(0, 255, 0, 0.05);
        color: #fff;
      }
    }

    &.base-button--warning {
      color: var(--color-yellow);

      &:hover:not(:disabled) {
        background: rgba(255, 215, 0, 0.05);
        color: #fff;
      }
    }

    &.base-button--danger {
      color: #ff4d4d;

      &:hover:not(:disabled) {
        background: rgba(255, 77, 77, 0.05);
        color: #fff;
      }
    }

    &.base-button--info {
      color: #667eea;

      &:hover:not(:disabled) {
        background: rgba(102, 126, 234, 0.05);
        color: #fff;
      }
    }
  }

  // 禁用状态
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  // 加载状态
  &--loading {
    cursor: wait;
    pointer-events: none;

    .base-button__content {
      opacity: 0.7;
    }
  }

  // 加载动画
  &__loader {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;

    circle {
      stroke: currentColor;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: dash 1.5s ease-in-out infinite;
    }
  }

  &__content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
</style>
