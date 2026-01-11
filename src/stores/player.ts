import { ref, readonly, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ICultivation, IPlayer } from '@/interface';
import { RealmTypeCode } from '@/enums';

export const usePlayerStore = defineStore('player', () => {
  const player = ref<IPlayer>({
    name: '李强',
    hp: 1000,
    mp: 1000,
    atk: 100000,
    def: 100,
    daoCultivation: {
      level: 1,
      currentExp: 0,
      realm: RealmTypeCode.ZHU_JI,
    },
  });

  /**
   * 获取当前境界
   * @returns ICultivation
   */
  function getCultivation() {
    let cultivation = null;
    if (player.value.daoCultivation) {
      cultivation = player.value.daoCultivation;
    }
    else if (player.value.immortalCultivation) {
      cultivation = player.value.immortalCultivation;
    }
    else if (player.value.demonicCultivation) {
      cultivation = player.value.demonicCultivation;
    }
    else if (player.value.divineCultivation) {
      cultivation = player.value.divineCultivation;
    }

    return cultivation as ICultivation;
  }

  const currentExp = computed(() => {
    let cultivation = null;
    if (player.value.daoCultivation) {
      cultivation = player.value.daoCultivation;
    }
    else if (player.value.immortalCultivation) {
      cultivation = player.value.immortalCultivation;
    }
    else if (player.value.demonicCultivation) {
      cultivation = player.value.demonicCultivation;
    }
    else if (player.value.divineCultivation) {
      cultivation = player.value.divineCultivation;
    }

    return cultivation?.currentExp || 0;
  });

  // 可以添加一些操作玩家数据的方法
  function updatePlayer(newPlayerData: Partial<IPlayer>) {
    Object.assign(player.value, newPlayerData);
  }

  function updateHp(hp: number) {
    player.value.hp = Math.max(0, player.value.hp - hp);
  }

  function updateMp(newMp: number) {
    player.value.mp = newMp;
  }

  function updateLevel(level: number) {
    const cultivation = getCultivation();
    if (cultivation) {
      cultivation.level = level;
    }
  }

  function updateExp(exp: number) {
    const cultivation = getCultivation();
    if (cultivation) {
      cultivation.currentExp += exp;
    }
  }

  // 返回玩家数据和操作方法，player为只读
  return {
    player: readonly(player),
    currentExp,
    updatePlayer,
    updateHp,
    updateMp,
    updateExp,
    updateLevel,
  };
});
