import cron from "node-cron";

import prefeituracanoasTask from "./tasks/scrape/prefeitura_canoas";
import tosalvocanoasTask from "./tasks/scrape/tosalvocanoas";

console.log("Initializing cron jobs...");

cron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job tosalvocanoasTask...");
  await tosalvocanoasTask();
  console.log("tosalvocanoasTask completed.");
});

cron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job prefeituracanoasTask...");
  await prefeituracanoasTask();
  console.log("prefeituracanoasTask completed.");
});

console.log("Cron jobs initialized.");
