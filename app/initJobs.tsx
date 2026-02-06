/**
 * Server-side initialization for background tasks
 * This file is imported by the root layout to start background services
 */
import { initializeBirthdayCronJob } from "@/lib/services/cronJobs";

// Initialize all background jobs
initializeBirthdayCronJob();

export default function InitializeJobs() {
  return null;
}
