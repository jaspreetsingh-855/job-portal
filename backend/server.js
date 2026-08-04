import "dotenv/config";
import app from "./src/app.js";
import { PORT } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
