import { redirect } from "next/navigation";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthCookie();
  if (!token) redirect("/login");

  try {
    await verifyAuthToken(token);
  } catch {
    redirect("/login");
  }

  return <div>{children}</div>;
}
