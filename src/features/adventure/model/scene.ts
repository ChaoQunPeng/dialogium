import type { ICharacter } from '@/interface/character';
import type { Scene } from '@/interface/scene';

export interface SceneCharacterGroups {
  enemies: ICharacter[];
  npcs: ICharacter[];
}

export const partitionSceneCharacters = (scene: Scene | null): SceneCharacterGroups => {
  if (!scene) {
    return {
      enemies: [],
      npcs: [],
    };
  }

  return scene.characters.reduce<SceneCharacterGroups>(
    (groups, character) => {
      if (character.type === 'enemy' || character.type === 'boss') {
        groups.enemies.push(character);
      } else if (character.type === 'npc' || character.type === 'merchant') {
        groups.npcs.push(character);
      }

      return groups;
    },
    {
      enemies: [],
      npcs: [],
    },
  );
};

export const getCharacterTypeClass = (type: string): string => {
  const classMap: Record<string, string> = {
    monster: 'monster-type',
    npc: 'npc-type',
    player: 'player-type',
    boss: 'boss-type',
    enemy: 'monster-type',
    merchant: 'merchant-type',
  };

  return classMap[type] || 'default-type';
};

export const isBattleVictory = (winnerId: string | undefined, playerId: string): boolean => {
  return Boolean(winnerId && winnerId === playerId);
};