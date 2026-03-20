import { reactive, ref, watch } from 'vue';
import { useBattle } from '@/hooks/useBattle';
import type { ICharacter } from '@/interface/character';
import { usePlayerStore } from '@/stores/player';
import type { IBattleSummary } from '@/utils/battle';

const cloneEnemy = (enemy: ICharacter): ICharacter => ({
  ...enemy,
  baseInfo: {
    ...enemy.baseInfo,
    hp: enemy.baseInfo.maxHp,
  },
  battle: enemy.battle ? { ...enemy.battle } : undefined,
});

export const useBattleFlow = (getEnemy: () => ICharacter) => {
  const playerStore = usePlayerStore();
  const { startBattle, currentTurns, battleStatus, battleRewards, reset } = useBattle();

  const isInBattle = ref(false);
  const battleLogs = ref<string[]>([]);
  const enemy = reactive<ICharacter>(cloneEnemy(getEnemy()));

  const syncEnemy = (nextEnemy: ICharacter) => {
    Object.assign(enemy, cloneEnemy(nextEnemy));
  };

  const applyVictoryRewards = (result: IBattleSummary) => {
    if (result.winner?.id !== playerStore.player.id || !battleRewards.value) return;

    const itemsToAdd = battleRewards.value.droppedItems.map((item) => ({
      itemId: item.id,
      count: item.count || 1,
    }));

    if (itemsToAdd.length > 0) {
      playerStore.acquireItem(itemsToAdd);
    }

    playerStore.gainExp(result.loser?.battle?.exp ?? 0);
  };

  const startEncounter = (onBattleEnd?: (result: IBattleSummary) => void) => {
    isInBattle.value = true;
    battleLogs.value = [];
    currentTurns.value = 0;

    setTimeout(() => {
      startBattle(playerStore.finalPlayer, enemy, {
        delay: 500,
        onTurn: (event) => {
          playerStore.setHp(event.attackerHp);
          enemy.baseInfo.hp = event.defenderHp;
          battleLogs.value.unshift(event.msg);
        },
        onFinish: (result) => {
          applyVictoryRewards(result);
          onBattleEnd?.(result);
        },
      });
    }, 500);
  };

  const resetEncounterState = () => {
    reset();
    currentTurns.value = 0;
    battleLogs.value = [];
    enemy.baseInfo.hp = getEnemy().baseInfo.maxHp;
  };

  const quitEncounter = () => {
    isInBattle.value = false;
    resetEncounterState();
  };

  const rematchEncounter = (onBattleEnd?: (result: IBattleSummary) => void) => {
    resetEncounterState();
    startEncounter(onBattleEnd);
  };

  watch(getEnemy, syncEnemy, { deep: true });

  return {
    enemy,
    isInBattle,
    battleLogs,
    currentTurns,
    battleStatus,
    battleRewards,
    startEncounter,
    quitEncounter,
    rematchEncounter,
  };
};