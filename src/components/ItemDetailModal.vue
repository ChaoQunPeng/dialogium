<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-box detail-modal" @click.stop>
      <div class="modal-header">
        <span class="item-title">{{ currentItem?.name }}</span>
        <span v-if="currentItem?.isLocked" class="lock-tag">[锁]</span>
        <span v-if="currentItem?.isEquipped" class="equipped-tag">[已装备]</span>
      </div>

      <div class="modal-body">
        <div class="item-basic-info">
          <div class="info-row">
            <span class="label">类别：</span>
            <span class="value">{{ getCategoryName(currentItem?.category) }}</span>
          </div>
          <div class="info-row">
            <span class="label">描述：</span>
            <span class="value">{{ currentItem?.description || '无' }}</span>
          </div>
          <div v-if="currentItem?.level" class="info-row">
            <span class="label">等级：</span>
            <span class="value">{{ currentItem.level }}</span>
          </div>
          <div class="info-row">
            <span class="label">数量：</span>
            <span class="value">x{{ currentItem?.count }}</span>
          </div>
        </div>

        <div v-if="currentItem?.stats" class="item-stats-section">
          <div class="section-title">属性加成</div>
          <div class="stats-grid">
            <div v-if="currentItem.stats.attack" class="stat-item">
              <span class="stat-label">攻击</span>
              <span class="stat-value positive">+{{ currentItem.stats.attack }}</span>
            </div>
            <div v-if="currentItem.stats.defense" class="stat-item">
              <span class="stat-label">防御</span>
              <span class="stat-value positive">+{{ currentItem.stats.defense }}</span>
            </div>
            <div v-if="currentItem.stats.hp" class="stat-item">
              <span class="stat-label">气血</span>
              <span class="stat-value positive">+{{ currentItem.stats.hp }}</span>
            </div>
            <div v-if="currentItem.stats.mp" class="stat-item">
              <span class="stat-label">灵力</span>
              <span class="stat-value positive">+{{ currentItem.stats.mp }}</span>
            </div>
            <div v-if="currentItem.stats.speed" class="stat-item">
              <span class="stat-label">速度</span>
              <span class="stat-value positive">+{{ currentItem.stats.speed }}</span>
            </div>
            <div v-if="currentItem.stats.crit" class="stat-item">
              <span class="stat-label">暴击</span>
              <span class="stat-value positive">+{{ currentItem.stats.crit }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentItem?.slot" class="item-slot-section">
          <div class="section-title">装备部位</div>
          <div class="slot-info">
            {{ getSlotName(currentItem.slot) }}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="action-buttons">
          <span
            v-if="
              currentItem?.category === 'equipment' &&
              !currentItem?.isEquipped &&
              !currentItem?.isLocked
            "
            class="modal-btn cyan"
            @click="handleEquip"
          >
            [ 装备 ]
          </span>
          <span
            v-if="currentItem?.isEquipped"
            class="modal-btn cyan"
            @click="handleUnequip"
          >
            [ 卸下 ]
          </span>
          <span
            v-if="!currentItem?.isEquipped && !currentItem?.isLocked"
            class="modal-btn red"
            @click="handleDrop"
          >
            [ 丢弃 ]
          </span>
          <span class="modal-btn" @click="handleClose">[ 关闭 ]</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ItemDetailModalEmits {
  (e: 'equip', instanceId: string): void;
  (e: 'unequip', item: any): void;
  (e: 'drop', item: any): void;
}

const emits = defineEmits<ItemDetailModalEmits>();

// 内部状态
const visible = ref(false);
const currentItem = ref<any>(null);

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'equipment': '装备',
    'consumable': '丹药',
    'material': '材料'
  };
  return categoryMap[category] || category;
};

// 获取装备部位名称
const getSlotName = (slot: string) => {
  const slotMap: Record<string, string> = {
    'weapon': '武器',
    'body': '上衣',
    'shoulder': '头肩',
    'belt': '腰带',
    'leg': '下装',
    'shoes': '鞋子'
  };
  return slotMap[slot] || slot;
};

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
const handleClose = () => {
  hide();
};

const handleEquip = () => {
  if (currentItem.value?.instanceId) {
    emits('equip', currentItem.value.instanceId);
    hide();
  }
};

const handleUnequip = () => {
  emits('unequip', currentItem.value);
  hide();
};

const handleDrop = () => {
  emits('drop', currentItem.value);
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  width: 80%;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(50, 50, 50, 0.7);
  display: flex;
  align-items: center;
  gap: 12px;

  .item-title {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--color-yellow);
  }

  .lock-tag {
    color: var(--color-red);
    font-size: 0.9em;
  }

  .equipped-tag {
    color: var(--color-green);
    font-size: 0.9em;
  }
}

.modal-body {
  padding: 20px;
  color: var(--color-text);

  .item-basic-info {
    margin-bottom: 20px;

    .info-row {
      display: flex;
      margin-bottom: 12px;

      .label {
        width: 60px;
        color: var(--color-gray);
        flex-shrink: 0;
      }

      .value {
        flex: 1;
        color: var(--color-text);
      }
    }
  }

  .item-stats-section {
    margin-bottom: 20px;

    .section-title {
      font-weight: bold;
      color: var(--color-cyan);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(64, 224, 208, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .stat-label {
          color: var(--color-gray);
        }

        .stat-value {
          &.positive {
            color: var(--color-green);
            font-weight: bold;
          }
        }
      }
    }
  }

  .item-slot-section {
    .section-title {
      font-weight: bold;
      color: var(--color-purple);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(128, 0, 128, 0.3);
    }

    .slot-info {
      padding: 12px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--color-text);
      text-align: center;
    }
  }
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background-color: rgba(30, 30, 30, 0.5);
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .action-buttons {
    display: flex;
    gap: 12px;
  }
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

  &.cyan {
    background-color: rgba(0, 200, 200, 0.2);
    color: var(--color-cyan);
    border-color: var(--color-cyan);

    &:hover {
      background-color: rgba(0, 200, 200, 0.4);
    }
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
