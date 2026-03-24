from pathlib import Path 
root = Path('C:/Habit Haven') 
(root / 'src/services/demoUser.js').write_text('''import { User } from \"../models/User.js\"; 
 
export const DEMO_USER_DEFAULTS = { 
  coins: 50, 
  xp: 0, 
  level: 1, 
  ownedItemIds: [], 
  equippedAvatarItemId: null, 
  equippedBaseItemId: null 
}; 
 
export function resetDemoUserProgress(user) { 
  user.coins = DEMO_USER_DEFAULTS.coins; 
  user.xp = DEMO_USER_DEFAULTS.xp; 
  user.level = DEMO_USER_DEFAULTS.level; 
  user.ownedItemIds = [...DEMO_USER_DEFAULTS.ownedItemIds]; 
  user.equippedAvatarItemId = DEMO_USER_DEFAULTS.equippedAvatarItemId; 
  user.equippedBaseItemId = DEMO_USER_DEFAULTS.equippedBaseItemId; 
  return user; 
} 
 
export async function ensureDemoUser() { 
