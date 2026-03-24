export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

export function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayDateString() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
