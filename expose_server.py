from pathlib import Path 
root = Path('C:/Habit Haven') 
server_path = root / 'src' / 'server.js' 
env_path = root / '.env.example' 
server_text = server_path.read_text(encoding='utf-8') 
