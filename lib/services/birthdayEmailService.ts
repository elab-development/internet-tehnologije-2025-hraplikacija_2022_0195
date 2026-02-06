import nodemailer from "nodemailer";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";

// Initialize SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmployeeWithEmail {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: Date | string;
  korisnik: {
    email: string;
  };
}

/**
 * Check if today is an employee's birthday
 */
function isBirthdayToday(datumRodjenja: Date | string): boolean {
  const birthday = new Date(datumRodjenja);
  const today = new Date();

  return (
    birthday.getMonth() === today.getMonth() &&
    birthday.getDate() === today.getDate()
  );
}

/**
 * Send birthday email to an employee
 */
async function sendBirthdayEmail(
  email: string,
  ime: string,
  prezime: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `🎉 Srećan rođendan, ${ime}!`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center;">🎉 Srećan rođendan! 🎉</h1>
              
              <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
                Dragi <strong>${ime} ${prezime}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.6;">
                Želimo ti sve najbolje u tvojemu specijalnom danu! <br>
                Neka ti je dan ispunjen sa radošću, osmehima i lepim uspomenama.
              </p>
              
              <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">
                Svih nas u kompaniji želi ti sve najbolje! 🎊
              </p>
              
              <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                Ova poruka je poslata automatski od HR sistema.
              </p>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Poruka o rođendanu poslana ${ime} ${prezime} (${email})`);
    return true;
  } catch (error) {
    console.error(
      `❌ Greška pri slanju poruke ${ime} ${prezime} (${email}):`,
      error
    );
    return false;
  }
}

/**
 * Check all employees and send birthday emails to those who have birthday today
 */
export async function checkAndSendBirthdayEmails(): Promise<void> {
  try {
    console.log("🔍 Proveravamo rođendane zaposlenih...");

    const employees = await db
      .select({
        id: zaposleni.id,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        datumRodjenja: zaposleni.datumRodjenja,
        korisnik: {
          email: korisnik.email,
        },
      })
      .from(zaposleni)
      .innerJoin(korisnik, eq(zaposleni.korisnikId, korisnik.id));

    const birthdayEmails: EmployeeWithEmail[] = employees.filter(
      (employee: EmployeeWithEmail) => isBirthdayToday(employee.datumRodjenja)
    );

    if (birthdayEmails.length === 0) {
      console.log("✅ Nema zaposlenih sa rođendanom danas.");
      return;
    }

    console.log(
      `🎂 Pronađeno ${birthdayEmails.length} zaposlenih sa rođendanom danas!`
    );

    for (const employee of birthdayEmails) {
      await sendBirthdayEmail(
        employee.korisnik.email,
        employee.ime,
        employee.prezime
      );
    }

    console.log("✅ Sve poruke o rođendanu su prosleđene!");
  } catch (error) {
    console.error("❌ Greška pri proveravanju rođendana:", error);
  }
}
