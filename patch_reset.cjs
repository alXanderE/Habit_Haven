const fs = require('fs'); 
let t = fs.readFileSync('C:/Habit Haven/src/app.js', 'utf8'); 
if (!t.includes('/api/profile/reset')) { 
const marker = '  app.use((err, _req, res, _next) => {'; 
const insert = `  app.post(\"/api/profile/reset\", async (_req, res, next) => {\n    try {\n      const user = await getDemoUser();\n      await Habit.deleteMany({ userId: user._id });\n      await Completion.deleteMany({ userId: user._id });\n\n      user.coins = 50;\n      user.xp = 0;\n      user.level = 1;\n      user.ownedItemIds = [];\n      user.equippedAvatarItemId = null;\n      user.equippedBaseItemId = null;\n      await user.save();\n\n      res.json({\n        message: \\\"Progress reset.\\\",\n        user,\n        habits: [],\n        completedHabitIds: []\n      });\n    } catch (error) {\n      next(error);\n    }\n  });\n\n`; 
t = t.replace(marker, insert + marker); 
} 
fs.writeFileSync('C:/Habit Haven/src/app.js', t);
t = fs.readFileSync('C:/Habit Haven/public/app.js', 'utf8'); 
if (!t.includes('resetProgressButton')) { 
const oldBlock = `  profileCard.innerHTML = \`\n    <div>\n      <p class=\"eyebrow\">Player</p>\n      <h2>${user.displayName}</h2>\n      <p class=\"muted\">Demo user flow for the MVP. Add auth later if you want multi-user support.</p>\n    </div>\n    <div class=\"stat-grid\">\n      <span class=\"chip\">Level ${user.level}</span>\n      <span class=\"chip\">${user.xp} XP</span>\n      <span class=\"chip\">${user.coins} coins</span>\n      <span class=\"chip\">${state.habits.length} habits</span>\n    </div>\n    <div class=\"message\">Complete habits today to earn upgrades.</div>\n  \`;`; 
const newBlock = `  profileCard.innerHTML = \`\n    <div>\n      <p class=\"eyebrow\">Player</p>\n      <h2>${user.displayName}</h2>\n      <p class=\"muted\">Demo user flow for the MVP. Add auth later if you want multi-user support.</p>\n    </div>\n    <div class=\"stat-grid\">\n      <span class=\"chip\">Level ${user.level}</span>\n      <span class=\"chip\">${user.xp} XP</span>\n      <span class=\"chip\">${user.coins} coins</span>\n      <span class=\"chip\">${state.habits.length} habits</span>\n    </div>\n    <div class=\"message\">Complete habits today to earn upgrades.</div>\n    <button id=\"resetProgressButton\" class=\"secondary\" type=\"button\">Reset progress</button>\n  \`;\n\n  document.getElementById(\"resetProgressButton\").addEventListener(\"click\", async () => {\n    const confirmed = window.confirm(\"Reset all habits, coins, XP, and equipped items?\");\n\n    if (!confirmed) {\n      return;\n    }\n\n    try {\n      const payload = await api(\"/api/profile/reset\", { method: \"POST\" });\n      state.user = payload.user;\n      state.habits = payload.habits;\n      state.completedHabitIds = payload.completedHabitIds;\n      setStatus(\"Progress reset.\");\n      rerender();\n    } catch (error) {\n      setStatus(error.message, \"error\");\n    }\n  });`; 
t = t.replace(oldBlock, newBlock); 
} 
fs.writeFileSync('C:/Habit Haven/public/app.js', t); 
console.log('patched reset feature'); 
