<template>
  <div class="scene-view-wrapper">
    <BorderContainer v-if="!currentScene && !isInBattle">
      <div class="scenes-list">
        <div v-for="scene in scenes" :key="scene.id" class="scene-item" @click="enterScene(scene)">
          <div class="scene-header">
            <h3 class="scene-name">{{ scene.name }}</h3>
          </div>
          <div class="scene-description">
            {{ scene.description }}
          </div>
        </div>
      </div>
    </BorderContainer>

    <template v-else-if="currentScene && !isInBattle">
      <BorderContainer :title="`${currentScene.name}`">
        <div class="scene-detail-content">
          <p class="scene-intro">{{ currentScene.description }}</p>

          <div class="scene-header-info">
            <button class="back-button" @click="exitScene"><span class="icon">←</span> 返回</button>
          </div>

          <div class="entity-section" v-if="enemiesInScene.length > 0">
            <h3 class="section-title enemy-title">👹 敌人</h3>
            <div class="entity-grid">
              <div
                v-for="enemy in enemiesInScene"
                :key="enemy.id"
                class="entity-card enemy-card"
                @click="challengeMonster(enemy)"
              >
                <div class="entity-main">
                  <span class="entity-name" :class="getCharacterTypeClass(enemy.type)">
                    {{ enemy.name }}
                  </span>
                  <span class="entity-level">LV.{{ enemy.baseInfo.level }}</span>
                </div>
                <div
                  class="entity-tag"
                  @click.stop="challengeMonster(enemy)"
                  :class="{ 'disabled-tag': !canFightMonster(enemy), 'challenge-tag': true }"
                >
                  挑战
                </div>
              </div>
            </div>
          </div>

          <div class="entity-section" v-if="npcsInScene.length > 0">
            <h3 class="section-title npc-title">👤 仙门道友</h3>
            <div class="entity-grid">
              <div
                v-for="npc in npcsInScene"
                :key="npc.id"
                class="entity-card npc-card"
                @click="selectNPC(npc)"
              >
                <div class="entity-main">
                  <span class="entity-name" :class="getCharacterTypeClass(npc.type)">
                    {{ npc.name }}
                  </span>
                  <span class="entity-level">{{
                    npc.baseInfo.level ? `Lv.${npc.baseInfo.level}` : '???'
                  }}</span>
                </div>
                <div class="entity-tag">交谈</div>
              </div>
            </div>
          </div>

          <div
            class="no-monsters"
            v-else-if="enemiesInScene.length === 0 && npcsInScene.length === 0"
          >
            <div class="empty-state">
              <div class="empty-icon">🌿</div>
              <div class="empty-text">这里似乎空无一人</div>
            </div>
          </div>
        </div>
      </BorderContainer>
    </template>

    <BattleView
      v-if="isInBattle && selectedMonster"
      :player="playerStore.finalPlayer"
      :enemy="selectedMonster"
      :scene-name="currentScene?.name"
      :show-close-button="true"
      @battle-end="onBattleEnd"
      @close="exitBattle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import type { Scene } from '@/interface/scene';
import type { ICharacter } from '@/interface/character';
import { canFight } from '@/utils/battle';
import BorderContainer from './borderContainer.vue';
import BattleView from './BattleView.vue';
import { tianTingXing } from '@/scene/tianTingXing';
import { qianJieXing } from '@/scene/qianJieXing';

const playerStore = usePlayerStore();

const scenes: Scene[] = [tianTingXing, qianJieXing];

const currentScene = ref<Scene | null>(null);
const selectedMonster = ref<ICharacter | null>(null);
const isInBattle = ref(false);

const enterScene = (scene: Scene) => {
  currentScene.value = scene;
};

const exitScene = () => {
  currentScene.value = null;
  selectedMonster.value = null;
};

const enemiesInScene = computed(() => {
  if (!currentScene.value) return [];
  return currentScene.value.characters.filter(
    (char) => char.type === 'enemy' || char.type === 'boss',
  );
});

const npcsInScene = computed(() => {
  if (!currentScene.value) return [];
  return currentScene.value.characters.filter((char) => char.type === 'npc');
});

const getCharacterTypeClass = (type: string): string => {
  const classMap: Record<string, string> = {
    monster: 'monster-type',
    npc: 'npc-type',
    player: 'player-type',
    boss: 'boss-type',
    enemy: 'monster-type',
  };
  return classMap[type] || 'default-type';
};

const challengeMonster = (monster: ICharacter) => {
  const fightCheck = canFight(playerStore.finalPlayer, monster);
  if (!fightCheck.canFight) {
    alert(fightCheck.reason);
    return;
  }
  selectedMonster.value = monster;
  isInBattle.value = true;
};

const onBattleEnd = (result: any) => {
  console.log('战斗结束:', result);
};

const exitBattle = () => {
  isInBattle.value = false;
  selectedMonster.value = null;
};

const selectNPC = (npc: ICharacter) => {
  console.log('选择了 NPC:', npc.name);
};

const canFightMonster = (monster: ICharacter): boolean => {
  return !!monster.battle && canFight(playerStore.finalPlayer, monster).canFight;
};
</script>

<style lang="scss" scoped>
.scene-view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 列表容器 */
.scenes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.scene-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--color-yellow);
  }
}

.scene-name {
  color: var(--color-yellow);
  margin: 0 0 8px 0;
  font-size: 1.1em;
}

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

/* 实体卡片网格 */
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

/* 扁平化卡片 */
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

/* 小操作件 */
.action-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-red);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.entity-tag {
  font-size: 12px;
  color: var(--color-cyan);
}

.challenge-tag {
  color: var(--color-red);
}

/* 类型色彩 */
.monster-type {
  color: #ff6b6b;
}
.boss-type {
  color: #fcc419;
}
.npc-type {
  color: #3bc9db;
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
