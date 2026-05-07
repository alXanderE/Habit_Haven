export function calculateLevel(xp) {
  let level = 1;
  let remainingXp = Math.max(0, xp);

  while (remainingXp >= getXpRequiredForNextLevel(level)) {
    remainingXp -= getXpRequiredForNextLevel(level);
    level += 1;
  }

  return level;
}

export function getXpRequiredForNextLevel(level) {
  return 50 + 50 * level;
}

export function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayDateString() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
