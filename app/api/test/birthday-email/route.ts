import { NextResponse } from "next/server";
import { checkAndSendBirthdayEmails } from "@/lib/services/birthdayEmailService";


export async function POST() {
  try {
    console.log("Manual test of birthday email service triggered");
    await checkAndSendBirthdayEmails();
    
    return NextResponse.json({
      success: true,
      message: "Birthday email check completed",
    });
  } catch (error) {
    console.error("Error during birthday email test:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json({
    message: "Birthday email service test endpoint",
    usage: "Send a POST request to trigger the birthday email check",
    note: "This endpoint should be removed or protected in production",
  });
}
