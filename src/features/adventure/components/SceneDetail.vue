<!-- 场景详情组件 - 展示场景信息、敌人列表和 NPC 列表 -->
<template>
  <BaseBorderContainer :title="scene.name">
    <div class="scene-detail-content">
      <p class="scene-intro">{{ scene.description }}</p>

      <div class="scene-header-info">
        <button class="back-button" @click="$emit('back')"><span class="icon">←</span> 返回</button>
      </div>

      <div class="entity-section" v-if="enemies.length > 0">
        <h3 class="section-title enemy-title">👹 敌人</h3>
        <div class="entity-grid">
          <div
            v-for="enemy in enemies"
            :key="enemy.id"
            class="entity-card enemy-card"
            @click="handleChallenge(enemy)"
          >
            <div class="entity-main">
              <span class="entity-name" :class="getCharacterTypeClass(enemy.type)">
                {{ enemy.name }}
              </span>
              <span class="entity-level">LV.{{ enemy.baseInfo.level }}</span>
            </div>
            <div class="entity-tag" :class="{ 'disabled-tag': !canFightMonster(enemy), 'challenge-tag': true }">
              战斗
            </div>
          </div>
        </div>
      </div>

      <div class="entity-section" v-if="npcs.length > 0">
        <h3 class="section-title npc-title">👤 仙门道友</h3>
        <div class="entity-grid">
          <div v-for="npc in npcs" :key="npc.id" class="entity-card npc-card" @click="$emit('talk', npc)">
            <div class="entity-main">
              <span class="entity-name" :class="getCharacterTypeClass(npc.type)">
                {{ npc.name }}
              </span>
              <span class="entity-level">{{ npc.baseInfo.level ? `Lv.${npc.baseInfo.level}` : '???' }}</span>
            </div>
            <div class="entity-tag" :class="{ 'merchant-tag': npc.type === 'merchant' }">
              {{ npc.type === 'merchant' ? '商店' : '交谈' }}
            </div>
          </div>
        </div>
      </div>

      <div class="no-monsters" v-else-if="enemies.length === 0 && npcs.length === 0">
        <div class="empty-state">
          <div class="empty-icon">🌿</div>
          <div class="empty-text">这里似乎空无一人</div>
        </div>
      </div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import { getCharacterTypeClass } from '@/features/adventure/model/scene';
import type { ICharacter } from '@/interface/character';
import type { Scene } from '@/interface/scene';

// ==================== Props & Emits ====================

// 组件属性：场景信息、敌人列表、NPC 列表、战斗能力检查函数
const props = defineProps<{
  scene: Scene;
  enemies: ICharacter[];
  npcs: ICharacter[];
  canFightMonster: (monster: ICharacter) => boolean;
}>();

// 组件事件：返回、挑战怪物、与 NPC 交谈
const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'challenge', monster: ICharacter): void;
  (e: 'talk', npc: ICharacter): void;
}>();

// ==================== 事件处理 ====================

/**
 * 处理挑战怪物请求
 * @param monster 要挑战的怪物
 */
const handleChallenge = (monster: ICharacter) => {
  // 检查是否可以挑战（等级限制）
  if (!props.canFightMonster(monster)) return;
  emit('challenge', monster);
};
</script>

<style lang="scss" scoped>
.scene-intro {
  color: var(--text-main);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.scene-header-info {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.back-button {
  background: transparent;
  border: 1px solid #444;
  color: var(--text-main);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: #666;
  }
}

.entity-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-left: 4px;
  opacity: 0.8;
}

.enemy-title {
  color: var(--color-red);
}

.npc-title {
  color: var(--color-cyan);
}

.entity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.entity-card {
  padding: 10px 14px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
}

.enemy-card:hover {
  border-color: rgba(255, 80, 80, 0.4);
}

.npc-card:hover {
  border-color: rgba(0, 255, 255, 0.4);
}

.entity-main {
  display: flex;
  flex-direction: column;
}

.entity-name {
  font-size: 14px;
  font-weight: 500;
}

.entity-level {
  font-size: 11px;
  color: var(--text-main);
  margin-top: 2px;
}

.entity-tag {
  font-size: 12px;
  color: var(--color-cyan);
}

.merchant-tag {
  color: var(--color-yellow);
}

.disabled-tag {
  color: var(--color-gray);
}

.monster-type {
  color: #ff6b6b;
}

.boss-type {
  color: #fcc419;
}

.npc-type {
  color: #3bc9db;
}

.merchant-type {
  color: #ffd43b;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #555;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  .empty-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
}
</style>