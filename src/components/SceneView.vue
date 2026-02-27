<template>
  <div class="scene-view-wrapper">
    <!-- 场景列表视图 -->
    <BorderContainer title="探索场景" v-if="!currentScene && !isInBattle">
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

    <!-- 场景详情视图 -->
    <template v-else-if="currentScene && !isInBattle">
      <BorderContainer :title="`${currentScene.name}`">
        <div class="scene-header-info">
          <div class="scene-description-detail">
            <!-- {{ getSceneDescription(currentScene.id) }} -->
          </div>
          <button class="back-button" @click="exitScene">返回场景列表</button>
        </div>

        <!-- 怪物列表 -->
        <div class="monsters-section" v-if="monstersInScene.length > 0">
          <h3 class="section-title">👹 场景中的怪物</h3>
          <div class="monsters-simple-grid">
            <div
              v-for="monster in monstersInScene"
              :key="monster.id"
              class="monster-simple-card"
              @click="challengeMonster(monster)"
            >
              <div class="monster-simple-info">
                <div class="monster-name" :class="getCharacterTypeClass(monster.type)">
                  {{ monster.name }}
                </div>
                <div class="monster-level">等级: {{ monster.baseInfo.level }}</div>
              </div>
              <button
                class="challenge-button"
                @click.stop="challengeMonster(monster)"
                :disabled="!canFightMonster(monster)"
              >
                挑战
              </button>
            </div>
          </div>
        </div>

        <!-- 无怪物提示 -->
        <div class="no-monsters" v-else>
          <div class="empty-state">
            <div class="empty-icon">🌿</div>
            <div class="empty-text">这个场景暂时没有怪物出没</div>
          </div>
        </div>
      </BorderContainer>
    </template>

    <!-- 战斗场景 - 内联展示 -->
    <BattleView
      v-if="isInBattle && selectedMonster"
      :player="player"
      :monster="selectedMonster"
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
// import { goblinMonster, eliteGoblin, goblinChief } from '@/npc/enemy/ge_bu_lin';
import BorderContainer from './borderContainer.vue';
import BattleView from './BattleView.vue';
import { tianTingXing } from '@/scene/tianTingXing';
import { qianJieXing } from '@/scene/qianJieXing';

const playerStore = usePlayerStore();
const player = computed(() => playerStore.player);

// 场景数据
const scenes: Scene[] = [
  tianTingXing,
  qianJieXing,
  // {
  //   id: 'forest_path',
  //   name: '天庭星',
  //   characters: [goblinMonster, eliteGoblin],
  // },
  // {
  //   id: 'dark_cave',
  //   name: '潜杰星',
  //   characters: [goblinChief],
  // },
  // {
  //   id: 'ancient_ruins',
  //   name: '星星宫·寒冰原',
  //   characters: [],
  // },
  // {
  //   id: 'mountain_pass',
  //   name: '天籁之城',
  //   characters: [goblinMonster],
  // },
];

// 状态管理
const currentScene = ref<Scene | null>(null);
const selectedMonster = ref<ICharacter | null>(null);
const isInBattle = ref(false);

// 进入场景
const enterScene = (scene: Scene) => {
  currentScene.value = scene;
};

// 退出场景
const exitScene = () => {
  currentScene.value = null;
  selectedMonster.value = null;
};

// 获取场景中的怪物（只显示type为monster的角色）
const monstersInScene = computed(() => {
  if (!currentScene.value) return [];
  return currentScene.value.characters;
  // return currentScene.value.characters.filter((char) => char.type === 'enemy');
});

// 获取角色类型样式类
const getCharacterTypeClass = (type: string): string => {
  const classMap: Record<string, string> = {
    monster: 'monster-type',
    npc: 'npc-type',
    player: 'player-type',
    boss: 'boss-type',
  };
  return classMap[type] || 'default-type';
};

// 挑战怪物
const challengeMonster = (monster: ICharacter) => {
  const fightCheck = canFight(player.value, monster);
  if (!fightCheck.canFight) {
    alert(fightCheck.reason);
    return;
  }

  selectedMonster.value = monster;
  isInBattle.value = true;
};

// 战斗结束回调（不再自动退出战斗）
const onBattleEnd = (result: any) => {
  // 处理战斗结果，比如获得经验、物品等
  console.log('战斗结束:', result);
  // 注意：这里不再调用exitBattle()，让用户手动选择是否继续
};

// 退出战斗（只有用户点击"离开战场"时才调用）
const exitBattle = () => {
  isInBattle.value = false;
  selectedMonster.value = null;
  // 如果当前在场景中，保持场景状态；否则返回场景列表
  if (!currentScene.value) {
    currentScene.value = null;
  }
};

// 检查是否可以挑战怪物
const canFightMonster = (monster: ICharacter): boolean => {
  return !!monster.battle && canFight(player.value, monster).canFight;
};
</script>

<style lang="scss" scoped>
.scene-view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scenes-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.scene-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-cyan);
    background: rgba(0, 255, 255, 0.1);
    transform: translateY(-2px);
  }
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.scene-name {
  color: var(--color-yellow);
  font-size: 1.2em;
  margin: 0;
}

.scene-meta {
  .monster-count {
    color: var(--color-red);
    font-size: 0.9em;
  }
}

.scene-description {
  color: var(--color-gray);
  line-height: 1.4;
  font-size: 14px;
}

.scene-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #444;
}

.scene-description-detail {
  color: var(--color-gray);
  font-style: italic;
  flex: 1;
  margin-right: 16px;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #666;
  color: var(--color-gray);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: var(--color-cyan);
    color: var(--color-cyan);
  }
}

.section-title {
  color: var(--color-yellow);
  margin-bottom: 16px;
  font-size: 1.3em;
  border-bottom: 1px solid var(--color-yellow);
  padding-bottom: 8px;
}

.monsters-simple-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.monster-simple-card {
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid var(--color-red);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: var(--color-yellow);
    background: rgba(255, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.monster-simple-info {
  flex: 1;
}

.monster-name {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 6px;
  color: var(--color-red);
}

.monster-level {
  color: var(--color-gray);
  font-size: 0.9em;
}

.challenge-button {
  background: var(--color-red);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  margin-left: 12px;

  &:hover:not(:disabled) {
    background: var(--color-yellow);
    transform: scale(1.05);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.no-monsters {
  .empty-state {
    text-align: center;
    padding: 40px 20px;

    .empty-icon {
      font-size: 3em;
      margin-bottom: 16px;
    }

    .empty-text {
      color: var(--color-yellow);
      font-size: 1.2em;
    }
  }
}

.battle-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.monster-type {
  color: var(--color-red);
}
.npc-type {
  color: var(--color-cyan);
}
.player-type {
  color: var(--color-green);
}
.boss-type {
  color: var(--color-yellow);
}
.default-type {
  color: var(--text-main);
}
</style>
