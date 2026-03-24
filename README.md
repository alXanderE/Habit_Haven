# Habit Haven MVP

Habit Haven is a gamified habit tracker web app MVP for a software engineering course project. Users create habits, complete them daily, earn coins and XP, and spend those rewards on avatar and base customization items.

## Stack

- Frontend: vanilla HTML, CSS, and JavaScript served from Express
- Backend: Node.js + Express
- Database: MongoDB Atlas with Mongoose
- CI: GitHub Actions
- Deployment target: Render or Railway for the Node app, MongoDB Atlas for the database

## Features in this MVP

- Habit CRUD
- Daily completion tracking
- Coin and XP rewards
- Habit streaks
- Level progression
- Avatar and base item purchasing
- Avatar and base item equipping

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment file:

```bash
copy .env.example .env
```

4. Fill in `MONGODB_URI` with your MongoDB Atlas connection string.
5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000).

## MongoDB Atlas setup

1. Create a free MongoDB Atlas account.
2. Create a new project and a free shared cluster.
3. Create a database user with a username and password.
4. In Network Access, add your IP address for local testing. For cloud deployment, you can temporarily allow `0.0.0.0/0` during setup, then tighten it later if your host provides fixed outbound IPs.
5. In Database, click Connect, choose Drivers, and copy the connection string.
6. Replace the placeholder values in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/habit-haven?retryWrites=true&w=majority
```

The app will automatically create the demo user on first startup.

## Data model summary

- `users`: player profile, coins, XP, level, owned items, equipped items
- `habits`: title, description, reward values, streaks, last completed date
- `completions`: one record per habit per day

## API overview

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/habits`
- `POST /api/habits`
- `PATCH /api/habits/:habitId`
- `DELETE /api/habits/:habitId`
- `POST /api/habits/:habitId/complete`
- `POST /api/store/purchase`
- `POST /api/store/equip`

## GitHub setup

1. Create a new GitHub repository.
2. Initialize git and push the code:

```bash
git init
git add .
git commit -m "Initial Habit Haven MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. GitHub Actions will automatically run the CI workflow in `.github/workflows/ci.yml`.

## Deployment on Render

1. Push the repository to GitHub.
2. Create a new Web Service on Render and connect your repository.
3. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in Render:
   - `MONGODB_URI`
   - `DEMO_USER_EMAIL`
   - `DEMO_USER_NAME`
5. Deploy the service.

Your app will then be publicly hosted from Render, with MongoDB Atlas as the persistent database.

## Deployment on Railway

1. Create a new Railway project from your GitHub repository.
2. Set the start command to `npm start` if Railway does not detect it automatically.
3. Add the same environment variables from `.env.example`.
4. Deploy and open the generated domain.

## Suggested next improvements

- Add authentication so each user has a private account
- Add weekly summaries and analytics
- Add reminder notifications
- Add more store items and progression systems
- Add tests for the API routes
