@echo off 
set REPO_URL=https://github.com/alXanderE/Habit_Haven.git 
set BRANCH=main 
 
git remote set-url origin %%REPO_URL%% 
git fetch origin %%BRANCH%% 
git checkout %%BRANCH%% 
git pull origin %%BRANCH%% 
if exist package-lock.json ( 
  call npm ci 
) else ( 
  call npm install 
) 
echo Update complete. Run npm start if needed. 
