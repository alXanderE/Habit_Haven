const fs = require('fs'); 
let t = fs.readFileSync('C:/Habit Haven/public/app.js', 'utf8'); 
if (!t.includes('resetProgressButton')) { 
