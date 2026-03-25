const fs = require('fs'); 
const path = 'C:/Habit Haven/public/app.js'; 
let text = fs.readFileSync(path, 'utf8'); 
const marker = 'document.getElementById(\"resetProgressButton\")'; 
const index = text.indexOf(marker); 
if (index !== -1) { 
  const lines = [ 
    'document.getElementById(\"resetProgressButton\").addEventListener(\"click\", async () = 
    '  const confirmed = window.confirm(\"Reset all habits, coins, XP, and equipped items?\");', 
    '', 
    '  if (!confirmed) {', 
    '    return;', 
    '  }', 
    '', 
    '  try {', 
    '    const payload = await api(\"/api/profile/reset\", { method: \"POST\" });', 
    '    state.user = payload.user;', 
    '    state.habits = payload.habits;', 
    '    state.completedHabitIds = payload.completedHabitIds;', 
    '    setStatus(\"Progress reset.\");', 
    '    rerender();', 
    '  } catch (error) {', 
    '    setStatus(error.message, \"error\");', 
    '  }', 
    '});' 
  ]; 
  text = text.slice(0, index).trimEnd() + '\n\n' + lines.join('\n') + '\n'; 
} 
fs.writeFileSync(path, text); 
console.log('rewrote reset tail'); 
