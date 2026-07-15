export type Difficulty = 'easy' | 'normal' | 'hard' | 'endless';
export type StageId = 'town' | 'mountain' | 'sea' | 'metro';
export type CharacterId = 'marshall' | 'chase' | 'skye' | 'rubble';

export interface Fire {
  id: string;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  size: number; // current health (0 to 100) or trouble size (burning or lost)
  maxSize: number; // original scale
  type: 'house' | 'tree' | 'car' | 'shop' | 'trash' | 'lost_kitten' | 'injured_boy' | 'lost_girl' | 'puppy_tree' | 'lost_keys' | 'trapped_high' | 'cliff_rescue' | 'tree_rescue' | 'rooftop_rescue' | 'balloon_rescue' | 'heavy_rock' | 'debris' | 'collapsed_tree' | 'blocked_tunnel' | 'bridge_disaster';
  name: string;
  hp: number; // building durability or rescue progress hp
  maxHp: number; // max building durability or max rescue progress hp
}

export type GameState = 'start_screen' | 'playing' | 'victory' | 'game_over';

export interface GameStats {
  totalFires: number;
  extinguishedFires: number;
  waterUsed: number;
}


