<!-- 战斗视图组件 - 用于封装战斗场景的展示 -->
<template>
  <FeatureBattleView
    :player="playerStore.finalPlayer"
    :enemy="enemy"
    :scene-name="sceneName"
    :show-close-button="showCloseButton"
    @battle-end="emit('battleEnd', $event)"
    @close="emit('close')"
  />
</template>

<script setup lang="ts">
// 导入战斗视图组件和相关依赖
import FeatureBattleView from '@/features/battle/views/BattleView.vue';
import { usePlayerStore } from '@/stores/player';
import type { ICharacter } from '@/interface/character';
import type { IBattleSummary } from '@/utils/battle';

// 玩家状态管理
const playerStore = usePlayerStore();

// 定义组件属性：敌人信息、场景名称、是否显示关闭按钮
defineProps<{
  enemy: ICharacter;
  sceneName?: string;
  showCloseButton?: boolean;
}>();

// 定义组件事件：战斗结束、关闭
const emit = defineEmits<{
  (e: 'battleEnd', result: IBattleSummary): void;
  (e: 'close'): void;
}>();
</script>
