from pathlib import Path 
root = Path(r\"C:\Habit Haven\") 
index_path = root / \"public\" / \"index.html\" 
styles_path = root / \"public\" / \"styles.css\" 
app_path = root / \"public\" / \"app.js\" 
index_text = index_path.read_text(encoding=\"utf-8\") 
index_text = index_text.replace(\"          </form>\n\n          ^<div id=\\\"habitList\\\" class=\\\"habit-list\\\">^</div>\", \"          </form>\n          ^<p id=\\\"statusMessage\\\" class=\\\"status-message\\\" aria-live=\\\"polite\\\">^</p>\n\n          ^<div id=\\\"habitList\\\" class=\\\"habit-list\\\">^</div>\", 1) 
index_path.write_text(index_text, encoding=\"utf-8\") 
styles_text = styles_path.read_text(encoding=\"utf-8\") 
styles_text = styles_text.replace(\".message {\n  margin-top: 10px;\n  color: var(--accent-strong);\n  font-weight: 700;\n}\n\", \".message {\n  margin-top: 10px;\n  color: var(--accent-strong);\n  font-weight: 700;\n}\n\n.status-message {\n  min-height: 1.5rem;\n  margin: 0 0 18px;\n  color: var(--accent-strong);\n  font-weight: 700;\n}\n\n.status-message.error {\n  color: #b91c1c;\n}\n\", 1) 
styles_path.write_text(styles_text, encoding=\"utf-8\")
app_path.write_text('''const state = { 
  user: null, 
  habits: [], 
  completedHabitIds: [], 
  storeItems: [] 
}; 
 
function setStatus(message = \"\", type = \"info\") { 
  const statusNode = document.getElementById(\"statusMessage\"); 
  if (!statusNode) { 
    return; 
  } 
  statusNode.textContent = message; 
  statusNode.classList.toggle(\"error\", type === \"error\"); 
} 
 
async function api(path, options = {}) { 
  const response = await fetch(path, { 
    headers: { 
      \"Content-Type\": \"application/json\" 
    }, 
    ...options 
  }); 
 
  if (response.status === 204) { 
    return null; 
  } 
 
  const payload = await response.json(); 
 
  if (!response.ok) { 
