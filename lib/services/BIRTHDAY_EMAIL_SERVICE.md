# Birthday Email Service Documentation

## Overview
This automated service sends birthday greeting emails to employees every day at **9:00 AM** (server time). The service checks all employees in the database and sends emails to those whose birthday is today.

## How It Works

1. **Scheduler**: Uses `node-cron` to run a job at 9:00 AM daily
2. **Database Check**: Fetches all employees from the database
3. **Birthday Detection**: Compares employee birth dates with today's date
4. **Email Sending**: Sends personalized birthday emails via SMTP

## Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com           # Your SMTP server (e.g., gmail, office365)
SMTP_PORT=587                       # Port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                   # true for SSL (port 465), false for TLS (port 587)
SMTP_USER=your-email@gmail.com      # SMTP username
SMTP_PASSWORD=your-app-password     # SMTP password or app-specific password
SMTP_FROM=noreply@company.com       # (Optional) From address, defaults to SMTP_USER
```

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an **App Password** at https://myaccount.google.com/apppasswords
3. Use this app password in `SMTP_PASSWORD`
4. Configuration:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=google-app-password
   ```

### Office 365 Setup

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@company.com
SMTP_PASSWORD=your-office-password
```

## Files

### `lib/services/birthdayEmailService.ts`
Main service file containing:
- `checkAndSendBirthdayEmails()` - Main function that checks and sends emails
- `sendBirthdayEmail()` - Sends individual birthday emails
- `isBirthdayToday()` - Checks if today is someone's birthday
- Email template with styling

### `lib/services/cronJobs.ts`
Cron job scheduler:
- `initializeBirthdayCronJob()` - Initializes the 9 AM daily job
- `stopBirthdayCronJob()` - Stops the job (if needed)

### `app/initJobs.tsx`
Server component that runs initialization on app startup

## Usage

### Automatic (Default)
The service automatically initializes when the application starts. No manual action needed.

### Manual Testing
To test the service manually, you can:

1. **Call the service directly** from an API route:
```typescript
import { checkAndSendBirthdayEmails } from "@/lib/services/birthdayEmailService";

export async function GET() {
  await checkAndSendBirthdayEmails();
  return Response.json({ success: true });
}
```

2. **Trigger on demand** from the frontend:
```typescript
const response = await fetch("/api/test-birthday-email");
```

### Enable On Startup Testing
To check birthdays immediately when the server starts (for testing), uncomment this line in `lib/services/cronJobs.ts`:
```typescript
// checkAndSendBirthdayEmails();
```

## Database Requirements

The service requires:
- `zaposleni` table with `datumRodjenja` (birth date) field
- `korisnik` table with `email` field linked to employees

## Email Template

The service sends a styled HTML email with:
- Birthday greeting in Serbian
- Employee's name
- Festive design with emojis
- Company wishes

## Logging

The service logs all actions to the console:
- ✅ Successful email sends
- ❌ Errors during sending
- ℹ️ Job initialization status
- 🔍 Birthday check status

Example log output:
```
✅ Cron job za rođendane je uspešno inicijalizovan!
📅 Job će se pokrenuti svakodnevno u 9:00 AM.
🔍 Proveravamo rođendane zaposlenih...
✅ Poruka o rođendanu poslana John Doe (john@example.com)
✅ Sve poruke o rođendanu su prosleđene!
```

## Timezone Considerations

The cron job uses the **server's local timezone**. Make sure your server is set to the correct timezone (e.g., using TZ environment variable or system settings).

## Troubleshooting

### Emails not sending
1. Verify SMTP credentials in `.env.local`
2. Check if the SMTP server allows connections from your server
3. Look for error messages in the server console
4. Try testing with a manual API call first

### Job not running at 9 AM
1. Check server timezone is correct
2. Look at console logs to confirm job initialization
3. Verify `node-cron` package is installed

### Email template issues
1. Check employee records have valid emails
2. Verify SMTP service supports HTML emails
3. Check spam/junk folder for test emails

## Future Enhancements

- Add email confirmation/bounce handling
- Store email send history in database
- Add admin UI to manage email settings
- Support for multiple email templates
- Birthday reminder emails (e.g., 1 week before)
- Bulk email management dashboard
