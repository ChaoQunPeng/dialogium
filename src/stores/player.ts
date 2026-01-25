import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type { ICharacter } from '@/interface';
import { CharacterType } from '@/enums';

export const usePlayerStore = defineStore('player', () => {
  const player = reactive<ICharacter>({
    id: 'player',
    name: '李强',
    type: CharacterType.Player,
    baseInfo: { level: 10, hp: 100, maxHp: 100, mp: 50, maxMp: 50 },
    battle: { attack: 100, defense: 100 },
  });

  // 返回玩家数据和操作方法，player为只读
  return {
    player,
  };
});
