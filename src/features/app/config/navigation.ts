export type GameTabId = 'realm' | 'adventure' | 'quest';

export interface GameTab {
  id: GameTabId;
  name: string;
}

export const APP_TABS: GameTab[] = [
  { id: 'realm', name: '修为' },
  { id: 'adventure', name: '历练' },
  { id: 'quest', name: '任务' },
];