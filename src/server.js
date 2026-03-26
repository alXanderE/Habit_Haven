import dotenv from "dotenv";
import { connectToDatabase } from "./db.js";
import { createApp } from "./app.js";
import { ensureDemoUser } from "./services/demoUser.js";

dotenv.config();

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGODB_URI;
const demoUserEmail = process.env.DEMO_USER_EMAIL || "demo@habithaven.app";

async function start() {
  await connectToDatabase(mongoUri);
  await ensureDemoUser();

  const app = createApp({ demoUserEmail });

  app.listen(port, host, () => {
    console.log(`Habit Haven listening on http://${host}:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
