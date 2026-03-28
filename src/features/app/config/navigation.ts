export type GameTabId = 'realm' | 'adventure' | 'quest';

export interface GameTab {
  id: GameTabId;
  name: string;
}

export const APP_TABS: GameTab[] = [
  { id: 'realm', name: '道体' }, // 法身/本尊/道体
  { id: 'adventure', name: '游历' },
  { id: 'quest', name: '因果' },
];
