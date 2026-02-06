import cron from "node-cron";
import { checkAndSendBirthdayEmails } from "./birthdayEmailService";

let cronJobInitialized = false;

/**
 * Initialize the birthday reminder cron job
 * Runs every day at 9:00 AM
 */
export function initializeBirthdayCronJob(): void {
  if (cronJobInitialized) {
    console.log("ℹ️  Cron job za rođendane je već inicijalizovan.");
    return;
  }

  try {
    // Schedule for 9:00 AM every day (0 9 * * *)
    // Format: minute hour day month dayOfWeek
    const job = cron.schedule("0 9 * * *", async () => {
      console.log("⏰ Pokretanje cron job-a za proveru rođendana...");
      await checkAndSendBirthdayEmails();
    });

    cronJobInitialized = true;
    console.log("✅ Cron job za rođendane je uspešno inicijalizovan!");
    console.log("📅 Job će se pokrenuti svakodnevno u 9:00 AM.");

    // Optional: For testing, you can uncomment the line below to check birthdays immediately on startup
    // checkAndSendBirthdayEmails();
  } catch (error) {
    console.error("❌ Greška pri inicijalizaciji cron job-a:", error);
  }
}

/**
 * Stop the birthday cron job
 */
export function stopBirthdayCronJob(): void {
  if (cronJobInitialized) {
    console.log("⏹️  Zaustavljanje cron job-a za rođendane...");
    // Note: node-cron doesn't have a built-in stop method for individual jobs
    // This is more of a placeholder for future enhancements
    cronJobInitialized = false;
  }
}
