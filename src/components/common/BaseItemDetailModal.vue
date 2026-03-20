<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-box compact-modal" @click.stop>
      <div class="modal-header">
        <div class="header-main">
          <span class="item-title">【{{ currentItem?.name }}】</span>
          <div class="header-tags">
            <span v-if="currentItem?.isEquipped" class="tag-equipped">已佩戴</span>
            <span v-if="currentItem?.isLocked" class="tag-lock">封</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="basic-grid">
          <div class="grid-item">
            <span class="label">部位</span>
            <span class="val">{{ getSlotName(currentItem?.slot) }}</span>
          </div>
          <div v-if="currentItem?.level" class="grid-item">
            <span class="label">品阶</span>
            <span class="val">{{ currentItem.level }} 级</span>
          </div>
          <div class="grid-item">
            <span class="label">存量</span>
            <span class="val">x{{ currentItem?.count }}</span>
          </div>
        </div>

        <div class="description-box">
          {{ currentItem?.description || '暂无描述' }}
        </div>

        <div v-if="currentItem?.stats" class="stats-section">
          <div class="stats-list">
            <div v-if="currentItem.stats.attack" class="stat-entry">
              <span class="s-name">攻击</span>
              <span class="s-num">+{{ currentItem.stats.attack }}</span>
            </div>
            <div v-if="currentItem.stats.defense" class="stat-entry">
              <span class="s-name">防御</span>
              <span class="s-num">+{{ currentItem.stats.defense }}</span>
            </div>
            <div v-if="currentItem.stats.hp" class="stat-entry">
              <span class="s-name">气血</span>
              <span class="s-num">+{{ currentItem.stats.hp }}</span>
            </div>
            <div v-if="currentItem.stats.mp" class="stat-entry">
              <span class="s-name">灵力</span>
              <span class="s-num">+{{ currentItem.stats.mp }}</span>
            </div>
            <div v-if="currentItem.stats.speed" class="stat-entry">
              <span class="s-name">速度</span>
              <span class="s-num">+{{ currentItem.stats.speed }}</span>
            </div>
            <div v-if="currentItem.stats.crit" class="stat-entry">
              <span class="s-name">暴击</span>
              <span class="s-num">+{{ currentItem.stats.crit }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="action-buttons">
          <button
            v-if="
              currentItem?.category === 'equipment' &&
              !currentItem?.isEquipped &&
              !currentItem?.isLocked
            "
            class="btn cyan"
            @click="handleEquip"
          >
            装备
          </button>
          <button v-if="currentItem?.isEquipped" class="btn cyan" @click="handleUnequip">
            卸下
          </button>
          <button
            v-if="!currentItem?.isEquipped && !currentItem?.isLocked"
            class="btn red"
            @click="handleDrop"
          >
            丢弃
          </button>
          <button class="btn gray" @click="handleClose">关闭</button>
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
const visible = ref(false);
const currentItem = ref<any>(null);

const getSlotName = (slot: string) => {
  const slotMap: Record<string, string> = {
    weapon: '武器',
    body: '上衣',
    shoulder: '头肩',
    belt: '腰带',
    leg: '下装',
    shoes: '鞋子',
  };
  return slotMap[slot] || '物品';
};

const show = (item: any) => {
  if (!item) return;
  currentItem.value = item;
  visible.value = true;
};

const hide = () => {
  visible.value = false;
  currentItem.value = null;
};

const handleClose = () => hide();
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

defineExpose({ show, hide });
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.compact-modal {
  background: rgba(25, 25, 25, 0.98);
  border: 1px solid #444;
  border-top: 2px solid var(--color-yellow, #d4af37);
  width: 280px; /* 固定宽度更像游戏信息框 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

.modal-header {
  padding: 12px 15px;
  background: linear-gradient(to bottom, #333, #222);
  border-bottom: 1px solid #444;

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-title {
    color: var(--color-yellow, #ffd700);
    font-size: 1.1em;
    font-weight: bold;
  }

  .header-tags {
    display: flex;
    gap: 5px;
  }
}

/* 复用之前的线性标识样式 */
.tag-equipped {
  font-size: 10px;
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.5);
  padding: 0 4px;
  border-radius: 2px;
}

.tag-lock {
  font-size: 10px;
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.5);
  padding: 0 4px;
  border-radius: 2px;
}

.modal-body {
  padding: 12px 15px;

  .basic-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #444;

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .label {
        color: #888;
        font-size: 14px;
        margin-bottom: 2px;
      }
      .val {
        color: #eee;
        font-size: 14px;
      }
    }
  }

  .description-box {
    color: #bbb;
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 15px;
    font-style: italic;
  }

  .stats-section {
    background: rgba(0, 0, 0, 0.2);
    padding: 8px;
    border-radius: 4px;

    .stats-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 15px;
    }

    .stat-entry {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      .s-name {
        color: #999;
      }
      .s-num {
        color: #52c41a;
        font-family: monospace;
      }
    }
  }
}

.modal-footer {
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid #333;

  .action-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px;
  }
}

.btn {
  background: #333;
  border: 1px solid #555;
  color: #ccc;
  padding: 5px 0;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #444;
    color: #fff;
  }

  &.cyan {
    border-color: #008b8b;
    color: #00ced1;
    &:hover {
      background: rgba(0, 206, 209, 0.1);
    }
  }

  &.red {
    border-color: #8b0000;
    color: #ff4d4f;
    &:hover {
      background: rgba(255, 77, 79, 0.1);
    }
  }
}
</style>
