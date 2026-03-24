const fs = require('fs'); 
let t = fs.readFileSync('C:/Habit Haven/src/app.js', 'utf8'); 
t = t.replace('message: \\\\\\\"Progress reset.\\\\\\\",', 'message: \"Progress reset.\",'); 
fs.writeFileSync('C:/Habit Haven/src/app.js', t); 
t = fs.readFileSync('C:/Habit Haven/public/app.js', 'utf8'); 
if (!t.includes('resetProgressButton')) { 
