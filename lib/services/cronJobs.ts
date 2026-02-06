import cron from "node-cron";
import { checkAndSendBirthdayEmails } from "./birthdayEmailService";

let cronJobInitialized = false;

export function initializeBirthdayCronJob(): void {
  if (cronJobInitialized) {
    console.log("ℹ️ Cron job is already initialized");
    return;
  }

  try {
    cron.schedule("0 9 * * *", async () => {
      console.log("⏰ Birthday cron triggered");
      await checkAndSendBirthdayEmails();
    });

    cronJobInitialized = true;
    console.log("✅ Birthday cron initialized (runs daily at 09:00).");
  } catch (error) {
    console.error("❌ Failed to initialize cron job", error);
  }
}
