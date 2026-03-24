from pathlib import Path 
root = Path('C:/Habit Haven') 
app_path = root / 'src/app.js' 
app_text = app_path.read_text(encoding='utf-8') 
marker = '  app.use((err, _req, res, _next) = 
insert = '''  app.post(\"/api/profile/reset\", async (_req, res, next) = 
    try { 
      const user = await getDemoUser(); 
      await Habit.deleteMany({ userId: user._id }); 
      await Completion.deleteMany({ userId: user._id }); 
 
      user.coins = 50; 
      user.xp = 0; 
      user.level = 1; 
      user.ownedItemIds = []; 
      user.equippedAvatarItemId = null; 
      user.equippedBaseItemId = null; 
      await user.save(); 
 
      res.json({ 
        message: \"Progress reset.\", 
        user, 
        habits: [], 
        completedHabitIds: [] 
      }); 
    } catch (error) { 
      next(error); 
    } 
  }); 
 
''' 
if '/api/profile/reset' not in app_text: 
    app_text = app_text.replace(marker, insert + marker, 1) 
app_path.write_text(app_text, encoding='utf-8') 
front_path = root / 'public/app.js' 
front_text = front_path.read_text(encoding='utf-8') 
old = '''  profileCard.innerHTML = ` 
    <div> 
      <p class=\"eyebrow\">Player</p> 
      <h2>${user.displayName}</h2> 
      <p class=\"muted\">Demo user flow for the MVP. Add auth later if you want multi-user support.</p> 
    </div> 
    <div class=\"stat-grid\"> 
      <span class=\"chip\">Level ${user.level}</span> 
      <span class=\"chip\">${user.xp} XP</span> 
      <span class=\"chip\">${user.coins} coins</span> 
      <span class=\"chip\">${state.habits.length} habits</span> 
    </div> 
    <div class=\"message\">Complete habits today to earn upgrades.</div> 
  `; 
''' 
new = '''  profileCard.innerHTML = ` 
    <div> 
      <p class=\"eyebrow\">Player</p> 
      <h2>${user.displayName}</h2> 
      <p class=\"muted\">Demo user flow for the MVP. Add auth later if you want multi-user support.</p> 
    </div> 
    <div class=\"stat-grid\"> 
      <span class=\"chip\">Level ${user.level}</span> 
      <span class=\"chip\">${user.xp} XP</span> 
      <span class=\"chip\">${user.coins} coins</span> 
      <span class=\"chip\">${state.habits.length} habits</span> 
    </div> 
    <div class=\"message\">Complete habits today to earn upgrades.</div> 
    <button id=\"resetProgressButton\" class=\"secondary\" type=\"button\">Reset progress</button> 
  `; 
 
  document.getElementById(\"resetProgressButton\").addEventListener(\"click\", async () = 
    const confirmed = window.confirm(\"Reset all habits, coins, XP, and equipped items?\"); 
 
    if (!confirmed) { 
      return; 
    } 
 
    try { 
      const payload = await api(\"/api/profile/reset\", { method: \"POST\" }); 
      state.user = payload.user; 
      state.habits = payload.habits; 
      state.completedHabitIds = payload.completedHabitIds; 
      setStatus(\"Progress reset.\"); 
      rerender(); 
    } catch (error) { 
      setStatus(error.message, \"error\"); 
    } 
  }); 
''' 
if 'resetProgressButton' not in front_text: 
    front_text = front_text.replace(old, new, 1) 
front_path.write_text(front_text, encoding='utf-8') 
