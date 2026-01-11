import { ref, readonly } from 'vue';
import { defineStore } from 'pinia';
import type { ICultivation, IPlayer } from '@/interface';
import { RealmTypeCode } from '@/enums';

export const usePlayerStore = defineStore('player', () => {
  const player = ref<IPlayer>({
    name: '李强',
    hp: 1000,
    mp: 1000,
    atk: 100,
    def: 100,
    daoCultivation: {
      level: 1,
      currentExp: 0,
      realm: RealmTypeCode.ZHU_JI,
    },
  });

  const cultivation: ICultivation = getCultivation();

  /**
   * 获取当前境界
   * @returns ICultivation
   */
  function getCultivation() {
    let cultivation = null;
    if (player.value.daoCultivation) {
      cultivation = player.value.daoCultivation;
    }
    //
    else if (player.value.immortalCultivation) {
      cultivation = player.value.immortalCultivation;
    }
    //
    else if (player.value.demonicCultivation) {
      cultivation = player.value.demonicCultivation;
    }
    //
    else if (player.value.divineCultivation) {
      cultivation = player.value.divineCultivation;
    }

    return cultivation as ICultivation;
  }

  // 可以添加一些操作玩家数据的方法
  function updatePlayer(newPlayerData: Partial<IPlayer>) {
    Object.assign(player.value, newPlayerData);
  }

  function updateHp(newHp: number) {
    player.value.hp = newHp;
  }

  function updateMp(newMp: number) {
    player.value.mp = newMp;
  }

  function updateLevel(level: number) {
    if (cultivation) {
      cultivation.level = level;
    }
  }

  function updateExp(exp: number) {
    const cultivation = getCultivation();

    if (cultivation) {
      cultivation.currentExp = exp;
    }
  }

  // 返回玩家数据和操作方法，player为只读
  return {
    player: readonly(player),
    updatePlayer,
    updateHp,
    updateMp,
    updateExp,
    updateLevel,
  };
});
