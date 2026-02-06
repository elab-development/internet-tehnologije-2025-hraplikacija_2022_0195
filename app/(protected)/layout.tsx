import { redirect } from "next/navigation";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import Navbar from "@/components/layout/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthCookie();
  if (!token) redirect("/login");

  try {
    await verifyAuthToken(token);
  } catch {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}
